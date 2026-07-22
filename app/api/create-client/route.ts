import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { getSessionProfile } from "@/lib/supabase/dal";

function generatePassword() {
  return crypto.randomBytes(9).toString("base64url");
}

// Shared by both the reseller ("Tambah Client Baru") and admin/owner
// ("Data Client") dashboards. Previously both just inserted a bare row
// into `clients` with no login at all - a client had no way to reach
// their own dashboard (generate guest links, see RSVP, etc). This mirrors
// create-reseller: makes a real auth.users login (role: 'client' via the
// handle_new_user trigger) and hands the generated password back so the
// caller can share it with the client.
export async function POST(request: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const profile = await getSessionProfile();

  if (!profile || (profile.role !== "owner" && profile.role !== "reseller")) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    const missing = [
      !SUPABASE_URL && "NEXT_PUBLIC_SUPABASE_URL",
      !SERVICE_ROLE_KEY && "SUPABASE_SERVICE_ROLE_KEY",
    ].filter(Boolean);
    console.error("create-client: missing env vars:", missing);
    return NextResponse.json(
      { error: `Env var belum diset di server: ${missing.join(", ")}` },
      { status: 500 }
    );
  }

  const supabaseAdmin = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const body = await request.json();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const whatsapp = (body.whatsapp || "").trim();
  const package_name = body.package_name || "Luxury Gold";
  const status = body.status || "active";

  if (!name || !email) {
    return NextResponse.json(
      { error: "Nama dan email wajib diisi." },
      { status: 400 }
    );
  }

  // A reseller can only ever create clients under their own reseller_id -
  // never trust a reseller_id passed in the request body for that role.
  // Owner may optionally attach the client to a reseller via body.reseller_id,
  // or leave it null for a client the owner manages directly.
  let reseller_id: string | null = null;

  if (profile.role === "reseller") {
    const { data: reseller } = await supabaseAdmin
      .from("resellers")
      .select("id")
      .eq("user_id", profile.id)
      .single();

    if (!reseller) {
      return NextResponse.json(
        { error: "Akun reseller belum terhubung." },
        { status: 400 }
      );
    }

    reseller_id = reseller.id;
  } else if (body.reseller_id) {
    reseller_id = body.reseller_id;
  }

  const password = generatePassword();

  const { data: created, error: createUserError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "client", name, whatsapp },
    });

  if (createUserError || !created.user) {
    const message = createUserError?.message.includes("already been registered")
      ? "Email ini sudah terdaftar."
      : createUserError?.message || "Gagal membuat akun login.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { error: clientError } = await supabaseAdmin.from("clients").insert({
    user_id: created.user.id,
    reseller_id,
    name,
    email,
    whatsapp,
    package_name,
    status,
  });

  if (clientError) {
    // Roll back the auth user so we don't leave an orphaned login with no
    // matching client row.
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json(
      { error: "Gagal menyimpan data client." },
      { status: 500 }
    );
  }

  return NextResponse.json({ email, password });
}
