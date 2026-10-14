import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { getSessionProfile } from "@/lib/supabase/dal";

function generatePassword() { return crypto.randomBytes(9).toString("base64url"); }

export async function POST(request: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const profile = await getSessionProfile();
  if (!profile || (profile.role !== "owner" && profile.role !== "reseller")) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return NextResponse.json({ error: "Konfigurasi server belum lengkap." }, { status: 500 });

  const db = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const body = await request.json();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const whatsapp = (body.whatsapp || "").trim();
  const package_name = body.package_name || "Luxury Gold";
  let status = body.status || "active";
  if (!name || !email) return NextResponse.json({ error: "Nama dan email wajib diisi." }, { status: 400 });

  let reseller_id: string | null = null;
  let resellerPackage: "reseller" | "reseller_brand" | null = null;
  let resellerBillingModel: "legacy_commission" | "per_invitation" | null = null;
  if (profile.role === "reseller") {
    const { data: reseller } = await db.from("resellers").select("id, package, billing_model").eq("user_id", profile.id).single();
    if (!reseller) return NextResponse.json({ error: "Akun reseller belum terhubung." }, { status: 400 });
    reseller_id = reseller.id;
    resellerPackage = reseller.package as "reseller" | "reseller_brand";
    resellerBillingModel = reseller.billing_model as "legacy_commission" | "per_invitation";
  } else if (body.reseller_id) {
    reseller_id = body.reseller_id;
    const { data: reseller } = await db.from("resellers").select("package, billing_model").eq("id", reseller_id).maybeSingle();
    resellerPackage = (reseller?.package as "reseller" | "reseller_brand" | undefined) ?? null;
    resellerBillingModel = (reseller?.billing_model as "legacy_commission" | "per_invitation" | undefined) ?? null;
  }

  // Reseller biasa selalu menunggu pembayaran aktivasi Rp20.000.
  // Mitra Brand legacy dipertahankan seperti sebelumnya dan dapat mengatur status client sendiri.
  if (reseller_id && resellerPackage !== "reseller_brand") status = "pending";

  const password = generatePassword();
  const { data: created, error: createUserError } = await db.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { role: "client", name, whatsapp } });
  if (createUserError || !created.user) {
    const message = createUserError?.message.includes("already been registered") ? "Email ini sudah terdaftar." : createUserError?.message || "Gagal membuat akun login.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data: client, error: clientError } = await db.from("clients").insert({ user_id: created.user.id, reseller_id, name, email, whatsapp, package_name, status, sale_price: 0 }).select("id").single();
  if (clientError || !client) {
    await db.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: "Gagal menyimpan data client." }, { status: 500 });
  }

  return NextResponse.json({ clientId: client.id, email, password, salePrice: 0, paymentUrl: null, paymentError: null, billingModel: resellerBillingModel });
}
