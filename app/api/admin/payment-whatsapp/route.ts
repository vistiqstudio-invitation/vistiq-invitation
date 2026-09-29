import "server-only";
import { after, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";
import { PAYMENT_TEMPLATE_BODY, WHATSAPP_RECIPIENT, WHATSAPP_SENDER, safelyProcessPaymentWhatsApp, verifyWhatsAppConnection, whatsappConfig } from "@/lib/paymentWhatsApp";

async function ownerDatabase() {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET() {
  const db = await ownerDatabase();
  if (!db) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  const [settings, jobs] = await Promise.all([
    db.from("payment_whatsapp_settings").select("enabled,sender,recipient").eq("id", 1).single(),
    db.from("payment_whatsapp_outbox").select("id,order_id,customer_name,amount,status,created_at,last_error").order("created_at", { ascending: false }).limit(20),
  ]);
  if (settings.error || jobs.error) return NextResponse.json({ error: "Pengaturan belum dapat dimuat." }, { status: 503 });
  return NextResponse.json({ ...settings.data, credentialsReady: Boolean(whatsappConfig()), template: PAYMENT_TEMPLATE_BODY, jobs: jobs.data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  const db = await ownerDatabase();
  if (!db) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!["enable", "disable", "process", "retry"].includes(body?.action)) return NextResponse.json({ error: "Aksi tidak valid." }, { status: 400 });
  if (body.action === "disable") {
    const { error } = await db.from("payment_whatsapp_settings").update({ enabled: false, updated_at: new Date().toISOString() }).eq("id", 1);
    return error ? NextResponse.json({ error: "Pengaturan gagal disimpan." }, { status: 500 }) : NextResponse.json({ ok: true });
  }
  const config = whatsappConfig();
  if (!config) return NextResponse.json({ error: "Akun WhatsApp API belum terhubung." }, { status: 409 });
  const problem = await verifyWhatsAppConnection(config);
  if (problem) return NextResponse.json({ error: problem }, { status: 409 });
  if (body.action === "enable") {
    const { error } = await db.from("payment_whatsapp_settings").update({ enabled: true, sender: WHATSAPP_SENDER, recipient: WHATSAPP_RECIPIENT, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) return NextResponse.json({ error: "Pengaturan gagal disimpan." }, { status: 500 });
  } else {
    const { data: settings, error } = await db.from("payment_whatsapp_settings").select("enabled").eq("id", 1).single();
    if (error || !settings?.enabled) return NextResponse.json({ error: "Aktifkan koneksi terlebih dahulu." }, { status: 409 });
  }
  if (body.action === "retry") {
    if (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id)) return NextResponse.json({ error: "Pesan tidak valid." }, { status: 400 });
    const { error } = await db.from("payment_whatsapp_outbox").update({ status: "queued", last_error: null, claim_token: null, claimed_at: null, updated_at: new Date().toISOString() }).eq("id", body.id).eq("status", "failed");
    if (error) return NextResponse.json({ error: "Pesan belum dapat diproses ulang." }, { status: 500 });
  }
  after(() => safelyProcessPaymentWhatsApp(db));
  return NextResponse.json({ ok: true });
}
