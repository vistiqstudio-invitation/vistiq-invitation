import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { getSessionProfile } from "@/lib/supabase/dal";

function generatePassword() {
  return crypto.randomBytes(9).toString("base64url");
}

export async function POST(request: Request) {
  // Read these inside the handler (not at module scope) so we always see
  // the live process.env at request time.
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Only an owner (checked via the caller's own session, anon-key client)
  // may reach the service-role logic below.
  const profile = await getSessionProfile();

  if (!profile || profile.role !== "owner") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    const missing = [
      !SUPABASE_URL && "NEXT_PUBLIC_SUPABASE_URL",
      !SERVICE_ROLE_KEY && "SUPABASE_SERVICE_ROLE_KEY",
    ].filter(Boolean);
    console.error("create-reseller: missing env vars:", missing);
    return NextResponse.json(
      { error: `Env var belum diset di server: ${missing.join(", ")}` },
      { status: 500 }
    );
  }

  const body = await request.json();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const whatsapp = (body.whatsapp || "").trim();
  const pkg = body.package === "reseller_brand" ? "reseller_brand" : "reseller";
  const commission_percent = Number(body.commission_percent) || 0;
  const status = body.status || "active";

  if (!name || !email) {
    return NextResponse.json(
      { error: "Nama dan email wajib diisi." },
      { status: 400 }
    );
  }

  const supabaseAdmin = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const password = generatePassword();

  const { data: created, error: createUserError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "reseller", name, whatsapp },
    });

  if (createUserError || !created.user) {
    const message = createUserError?.message.includes("already been registered")
      ? "Email ini sudah terdaftar."
      : createUserError?.message || "Gagal membuat akun login.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { error: resellerError } = await supabaseAdmin.from("resellers").insert({
    user_id: created.user.id,
    name,
    whatsapp,
    package: pkg,
    commission_percent,
    status,
  });

  if (resellerError) {
    // Roll back the auth user so we don't leave an orphaned login with no
    // matching reseller row.
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json(
      { error: "Gagal menyimpan data reseller." },
      { status: 500 }
    );
  }

  return NextResponse.json({ email, password });
}
