import "server-only";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";

const password = () => crypto.randomBytes(9).toString("base64url");
const codeFrom = (name: string) =>
  `${name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) || "AFF"}${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Konfigurasi server belum lengkap." }, { status: 503 });

  const { applicationId, action } = await request.json();
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: application } = await supabase.from("affiliate_applications").select("*").eq("id", applicationId).single();
  if (!application || application.status !== "pending") return NextResponse.json({ error: "Pendaftaran tidak ditemukan atau sudah diproses." }, { status: 404 });

  if (action === "reject") {
    await supabase.from("affiliate_applications").update({ status: "rejected", reviewed_at: new Date().toISOString() }).eq("id", applicationId);
    return NextResponse.json({ success: true });
  }
  if (action !== "approve") return NextResponse.json({ error: "Aksi tidak valid." }, { status: 400 });

  const temporaryPassword = password();
  const { data: created, error: authError } = await supabase.auth.admin.createUser({
    email: application.email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { role: "affiliate", name: application.name, whatsapp: application.whatsapp },
  });
  if (authError || !created.user) return NextResponse.json({ error: authError?.message || "Akun gagal dibuat." }, { status: 400 });

  const referralCode = codeFrom(application.name);
  const { error: affiliateError } = await supabase.from("affiliates").insert({
    user_id: created.user.id,
    application_id: application.id,
    name: application.name,
    email: application.email,
    whatsapp: application.whatsapp,
    referral_code: referralCode,
    commission_percent: 30,
  });
  if (affiliateError) {
    await supabase.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: "Data affiliate gagal dibuat." }, { status: 500 });
  }
  await supabase.from("affiliate_applications").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", applicationId);
  return NextResponse.json({ email: application.email, password: temporaryPassword, referralCode });
}
