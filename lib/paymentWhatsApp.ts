import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export const WHATSAPP_SENDER = "6281371338032";
export const WHATSAPP_RECIPIENT = "6281261581332";
export const PAYMENT_TEMPLATE_NAME = "vistiq_pembayaran_berhasil";
export const PAYMENT_TEMPLATE_BODY = "Pembayaran berhasil diterima di Vistiq Invitation.\nNama: {{1}}\nNominal: {{2}}\nID pesanan: {{3}}\nMetode: {{4}}\nSilakan periksa detail pada dashboard Vistiq.";

type Job = {
  id: string; order_id: string; customer_name: string; amount: number;
  payment_type: string; recipient: string; claim_token: string;
};
type ApiConfig = { token: string; phoneId: string; accountId: string; version: string };

export function whatsappConfig(): ApiConfig | null {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const accountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID?.trim();
  const version = process.env.WHATSAPP_GRAPH_API_VERSION?.trim() || "v23.0";
  if (!token || !phoneId || !accountId || !/^\d+$/.test(phoneId) || !/^\d+$/.test(accountId) || !/^v\d+\.\d+$/.test(version)) return null;
  return { token, phoneId, accountId, version };
}

function headers(config: ApiConfig) {
  return { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" };
}

export async function verifyWhatsAppConnection(config: ApiConfig): Promise<string | null> {
  try {
    const base = `https://graph.facebook.com/${config.version}`;
    const [phoneResponse, templateResponse] = await Promise.all([
      fetch(`${base}/${config.phoneId}?fields=display_phone_number`, { headers: headers(config), cache: "no-store", signal: AbortSignal.timeout(8000) }),
      fetch(`${base}/${config.accountId}/message_templates?name=${PAYMENT_TEMPLATE_NAME}&fields=name,status,language,components,parameter_format`, { headers: headers(config), cache: "no-store", signal: AbortSignal.timeout(8000) }),
    ]);
    if (!phoneResponse.ok || !templateResponse.ok) return "Koneksi WhatsApp belum dapat diverifikasi. Periksa akses akun API.";
    const phone = await phoneResponse.json();
    if (String(phone.display_phone_number || "").replace(/\D/g, "") !== WHATSAPP_SENDER) return "Nomor pengirim API tidak sesuai dengan 0813-7133-8032.";
    const templates = await templateResponse.json();
    const approved = (templates.data || []).some((t: {name?: string; status?: string; language?: string; parameter_format?: string; components?: {type?: string; text?: string}[]}) =>
      t.name === PAYMENT_TEMPLATE_NAME && t.status === "APPROVED" && t.language === "id"
      && (!t.parameter_format || t.parameter_format === "POSITIONAL")
      && t.components?.length === 1 && t.components[0].type === "BODY" && t.components[0].text === PAYMENT_TEMPLATE_BODY);
    return approved ? null : "Template pembayaran berbahasa Indonesia belum disetujui atau isinya belum sesuai.";
  } catch {
    return "Koneksi WhatsApp belum dapat diperiksa. Coba lagi nanti.";
  }
}

function textParameter(value: unknown, fallback: string) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 200) || fallback;
}

export function paymentWhatsAppPayload(job: Job) {
  if (job.recipient !== WHATSAPP_RECIPIENT || !job.order_id.startsWith("VSTQ-") || !Number.isFinite(Number(job.amount)) || Number(job.amount) <= 0) {
    throw new Error("Invalid payment notification data");
  }
  const parameters = [textParameter(job.customer_name, "Pelanggan Vistiq"), `Rp ${Number(job.amount).toLocaleString("id-ID")}`, job.order_id, textParameter(job.payment_type, "Midtrans")];
  return {
    messaging_product: "whatsapp", recipient_type: "individual", to: WHATSAPP_RECIPIENT,
    type: "template", template: {
      name: PAYMENT_TEMPLATE_NAME, language: { code: "id" },
      components: [{ type: "body", parameters: parameters.map(text => ({ type: "text", text })) }],
    },
  };
}

export async function processPaymentWhatsApp(supabase: SupabaseClient) {
  const config = whatsappConfig();
  if (!config) return;
  const { data: settings, error: settingsError } = await supabase.from("payment_whatsapp_settings").select("enabled,sender,recipient").eq("id", 1).single();
  if (settingsError || !settings?.enabled || settings.sender !== WHATSAPP_SENDER || settings.recipient !== WHATSAPP_RECIPIENT) return;
  // Recheck the actual API sender so changing a phone ID cannot send from another number.
  const connectionError = await verifyWhatsAppConnection(config);
  if (connectionError) {
    console.warn("Payment WhatsApp connection requires attention");
    return;
  }
  const { data: jobs, error } = await supabase.rpc("claim_payment_whatsapp_jobs", { p_limit: 3 });
  if (error) { console.error("Payment WhatsApp queue unavailable"); return; }

  await Promise.all((jobs as Job[] || []).map(async job => {
    let result: {status: string; last_error: string | null; provider_message_id?: string} = { status: "unknown", last_error: "Delivery result uncertain; check WhatsApp before resending" };
    let payload: ReturnType<typeof paymentWhatsAppPayload>;
    try { payload = paymentWhatsAppPayload(job); }
    catch { result = { status: "failed", last_error: "Invalid payment notification data" }; await finishJob(supabase, job, result); return; }
    try {
      const response = await fetch(`https://graph.facebook.com/${config.version}/${config.phoneId}/messages`, {
        method: "POST", headers: headers(config), body: JSON.stringify(payload), signal: AbortSignal.timeout(8000),
      });
      const body = await response.json().catch(() => null);
      const messageId = body?.messages?.[0]?.id;
      if (response.ok && typeof messageId === "string") {
        result = { status: "accepted", last_error: null, provider_message_id: messageId };
      } else if (response.status >= 400 && response.status < 500) {
        // A definite rejection is retryable by the owner after fixing the connection.
        const code = Number(body?.error?.code);
        result = { status: "failed", last_error: `WhatsApp HTTP ${response.status}${Number.isFinite(code) ? ` (code ${code})` : ""}` };
      }
      // Timeouts, server errors and malformed success responses stay uncertain.
    } catch { /* Never replay an ambiguous send automatically. */ }
    await finishJob(supabase, job, result);
  }));
}

async function finishJob(supabase: SupabaseClient, job: Job, result: {status: string; last_error: string | null; provider_message_id?: string}) {
  const { error } = await supabase.from("payment_whatsapp_outbox").update({ ...result, updated_at: new Date().toISOString() }).eq("id", job.id).eq("claim_token", job.claim_token).eq("status", "processing");
  if (error) console.error("Payment WhatsApp result could not be recorded");
}

export async function safelyProcessPaymentWhatsApp(supabase: SupabaseClient) {
  try { await processPaymentWhatsApp(supabase); }
  catch { console.error("Payment WhatsApp worker failed; payment remains recorded"); }
}
