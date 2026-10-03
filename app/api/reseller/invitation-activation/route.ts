import "server-only";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";
import { INVITATION_ACTIVATION_FEE } from "@/lib/resellerBilling";

const LINK_DAYS = 7;
const LINK_MS = LINK_DAYS * 86_400_000;

function invitationName(invitation: {
  category?: string | null;
  groom_name?: string | null;
  bride_name?: string | null;
  baby_name?: string | null;
}) {
  if (invitation.category === "aqiqah" || invitation.category === "khitan") {
    return invitation.baby_name || "Undangan Digital";
  }
  return [invitation.groom_name, invitation.bride_name].filter(Boolean).join(" & ") || "Undangan Digital";
}

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "reseller") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const midtransKey = process.env.MIDTRANS_SERVER_KEY;
  if (!supabaseUrl || !serviceKey || !midtransKey) {
    return NextResponse.json({ error: "Konfigurasi pembayaran belum lengkap." }, { status: 503 });
  }

  let invitationId: number;
  try {
    const body = await request.json();
    invitationId = Number(body.invitationId);
  } catch {
    return NextResponse.json({ error: "Data aktivasi tidak valid." }, { status: 400 });
  }
  if (!Number.isSafeInteger(invitationId) || invitationId <= 0) {
    return NextResponse.json({ error: "ID undangan tidak valid." }, { status: 400 });
  }

  const db = createServiceClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: reseller } = await db
    .from("resellers")
    .select("id, package, status, billing_model, brand_active, brand_expires_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!reseller || reseller.status !== "active") {
    return NextResponse.json({ error: "Akun reseller belum aktif." }, { status: 403 });
  }
  if (reseller.billing_model !== "per_invitation") {
    return NextResponse.json({ error: "Akun Anda masih menggunakan sistem lama." }, { status: 409 });
  }
  const brandExpired = reseller.package === "reseller_brand"
    && reseller.brand_expires_at
    && Date.parse(reseller.brand_expires_at) <= Date.now();
  if (reseller.package === "reseller_brand" && (!reseller.brand_active || brandExpired)) {
    return NextResponse.json({ error: "Perpanjang langganan Mitra Brand sebelum mengaktifkan undangan." }, { status: 403 });
  }

  const { data: invitation } = await db
    .from("invitations")
    .select("id, client_id, slug, category, groom_name, bride_name, baby_name, is_active")
    .eq("id", invitationId)
    .maybeSingle();
  if (!invitation?.client_id) {
    return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  }

  const { data: client } = await db
    .from("clients")
    .select("id, name, email, whatsapp")
    .eq("id", invitation.client_id)
    .eq("reseller_id", reseller.id)
    .maybeSingle();
  if (!client) {
    return NextResponse.json({ error: "Undangan bukan milik akun ini." }, { status: 403 });
  }
  if (invitation.is_active) {
    return NextResponse.json({ success: true, active: true });
  }

  let { data: transaction } = await db
    .from("transactions")
    .select("id, status, midtrans_order_id, midtrans_redirect_url, payment_link_expires_at")
    .eq("invitation_id", invitationId)
    .eq("transaction_type", "invitation_activation")
    .maybeSingle();

  if (transaction?.status === "paid") {
    return NextResponse.json({ success: true, active: true });
  }
  if (
    transaction?.status === "pending"
    && transaction.midtrans_redirect_url
    && transaction.payment_link_expires_at
    && Date.parse(transaction.payment_link_expires_at) > Date.now()
  ) {
    return NextResponse.json({
      success: true,
      paymentUrl: transaction.midtrans_redirect_url,
      orderId: transaction.midtrans_order_id,
      expiresAt: transaction.payment_link_expires_at,
    });
  }

  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const auth = `Basic ${Buffer.from(`${midtransKey}:`).toString("base64")}`;
  const statusBase = production ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";

  if (transaction?.midtrans_order_id) {
    const statusResponse = await fetch(
      `${statusBase}/v2/${encodeURIComponent(transaction.midtrans_order_id)}/status`,
      { headers: { Authorization: auth, Accept: "application/json" }, cache: "no-store" },
    );
    if (statusResponse.ok) {
      const state = await statusResponse.json();
      const paid = state.transaction_status === "settlement"
        || (state.transaction_status === "capture" && state.fraud_status === "accept");
      if (paid) {
        return NextResponse.json({
          error: "Pembayaran sebelumnya sudah berhasil. Tekan Periksa Status Pembayaran terlebih dahulu.",
          orderId: transaction.midtrans_order_id,
        }, { status: 409 });
      }
      if (!["expire", "deny", "cancel", "failure"].includes(String(state.transaction_status))) {
        return NextResponse.json({ error: "Pembayaran sebelumnya masih diproses oleh Midtrans." }, { status: 409 });
      }
    } else if (statusResponse.status !== 404) {
      return NextResponse.json({ error: "Midtrans belum dapat memverifikasi tagihan sebelumnya." }, { status: 502 });
    }
  }

  if (!transaction) {
    const { data: inserted, error: insertError } = await db
      .from("transactions")
      .insert({
        client_id: client.id,
        reseller_id: reseller.id,
        invitation_id: invitationId,
        transaction_type: "invitation_activation",
        amount: INVITATION_ACTIVATION_FEE,
        commission: 0,
        status: "pending",
      })
      .select("id, status, midtrans_order_id, midtrans_redirect_url, payment_link_expires_at")
      .single();
    if (insertError || !inserted) {
      if (insertError?.code === "23505") {
        const retry = await db.from("transactions")
          .select("id, status, midtrans_order_id, midtrans_redirect_url, payment_link_expires_at")
          .eq("invitation_id", invitationId)
          .eq("transaction_type", "invitation_activation")
          .maybeSingle();
        transaction = retry.data;
      } else {
        return NextResponse.json({ error: "Tagihan aktivasi gagal dibuat." }, { status: 500 });
      }
    } else {
      transaction = inserted;
    }
  }
  if (!transaction) {
    return NextResponse.json({ error: "Tagihan aktivasi tidak tersedia." }, { status: 500 });
  }

  const orderId = `VSTQ-IA-${Date.now()}-${crypto.randomBytes(5).toString("hex")}`;
  const finishUrl = `${new URL(request.url).origin}/pembayaran/status?order_id=${encodeURIComponent(orderId)}`;
  const snapEndpoint = production
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
  const midtransResponse = await fetch(snapEndpoint, {
    method: "POST",
    headers: { Authorization: auth, Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: INVITATION_ACTIVATION_FEE },
      item_details: [{
        id: "invitation-activation",
        price: INVITATION_ACTIVATION_FEE,
        quantity: 1,
        name: `Aktivasi ${invitationName(invitation)}`.slice(0, 50),
      }],
      customer_details: {
        first_name: profile.name || client.name || "Reseller Vistiq",
        email: profile.email,
        phone: profile.whatsapp || client.whatsapp || undefined,
      },
      expiry: { unit: "days", duration: LINK_DAYS },
      page_expiry: { unit: "days", duration: LINK_DAYS },
      callbacks: { finish: finishUrl },
      custom_field1: "invitation_activation",
      custom_field2: String(invitationId),
    }),
    cache: "no-store",
  });
  const midtrans = await midtransResponse.json().catch(() => ({})) as {
    redirect_url?: string;
    error_messages?: string[];
  };
  if (!midtransResponse.ok || !midtrans.redirect_url) {
    console.error("invitation_activation_midtrans_failed", midtransResponse.status, midtrans.error_messages);
    return NextResponse.json({ error: "Midtrans gagal membuat pembayaran. Silakan coba lagi." }, { status: 502 });
  }

  const expiresAt = new Date(Date.now() + LINK_MS).toISOString();
  const { data: saved, error: saveError } = await db
    .from("transactions")
    .update({
      midtrans_order_id: orderId,
      midtrans_redirect_url: midtrans.redirect_url,
      payment_link_expires_at: expiresAt,
      status: "pending",
    })
    .eq("id", transaction.id)
    .neq("status", "paid")
    .select("id")
    .maybeSingle();
  if (saveError || !saved) {
    return NextResponse.json({ error: "Status tagihan berubah. Muat ulang halaman sebelum mencoba lagi." }, { status: 409 });
  }

  return NextResponse.json({ success: true, paymentUrl: midtrans.redirect_url, orderId, expiresAt });
}
