import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { getSessionProfile } from "@/lib/supabase/dal";
import { createAdminPaidPackageOrder } from "@/lib/createManualPackageOrder";

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
  // Package rules are fixed: standard reseller keeps 80% and Vistiq takes
  // a 20% platform fee. Reseller Brand keeps 100%. Do not trust a stale
  // browser value for this field.
  const commission_percent = pkg === "reseller_brand" ? 100 : 80;
  // Accounts created directly by Vistiq Owner are already approved. Ignore
  // any client-supplied status so this rule cannot be bypassed by a stale or
  // modified browser request.
  const status = "active";
  const brandExpiresAt = pkg === "reseller_brand"
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    : null;

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

  const { data: reseller, error: resellerError } = await supabaseAdmin
    .from("resellers")
    .insert({
      user_id: created.user.id,
      name,
      whatsapp,
      package: pkg,
      commission_percent,
      status,
      brand_active: pkg === "reseller_brand",
      brand_expires_at: brandExpiresAt,
    })
    .select("id")
    .single();

  if (resellerError || !reseller) {
    // Roll back the auth user so we don't leave an orphaned login with no
    // matching reseller row.
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json(
      { error: "Gagal menyimpan data reseller." },
      { status: 500 }
    );
  }

  try {
    const { orderId } = await createAdminPaidPackageOrder(supabaseAdmin, {
      resellerId: reseller.id,
      package: pkg,
      name,
      email,
      whatsapp,
      authUserId: created.user.id,
      confirmedBy: profile.id,
    });

    return NextResponse.json({ email, password, orderId, orderStatus: "paid" });
  } catch (orderError) {
    // Account creation and its paid package ledger record must not diverge.
    // If the ledger insert fails, remove both rows so a later retry cannot
    // leave an active account without a traceable package order.
    await supabaseAdmin.from("resellers").delete().eq("id", reseller.id);
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);

    console.error("create-reseller: manual package order failed", orderError);
    return NextResponse.json(
      { error: orderError instanceof Error ? orderError.message : "Gagal membuat order paket manual." },
      { status: 500 },
    );
  }
}
