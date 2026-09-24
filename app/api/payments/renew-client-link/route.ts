import "server-only";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";

const LINK_DAYS = 7;
const LINK_MS = LINK_DAYS * 86400000;

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile || (profile.role !== "reseller" && profile.role !== "owner")) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const midtransKey = process.env.MIDTRANS_SERVER_KEY;
  if (!url || !serviceKey || !midtransKey) {
    return NextResponse.json({ error: "Konfigurasi pembayaran belum lengkap." }, { status: 503 });
  }
  const db = createServiceClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { transactionId } = await request.json();
    if (typeof transactionId !== "string" || !/^[0-9a-f-]{36}$/i.test(transactionId)) {
      return NextResponse.json({ error: "ID tagihan tidak valid." }, { status: 400 });
    }

    const { data: tx, error: lookupError } = await db
      .from("transactions")
      .select("id, reseller_id, client_id, amount, status, midtrans_order_id, midtrans_redirect_url, payment_link_expires_at")
      .eq("id", transactionId)
      .single();
    if (lookupError || !tx) {
      return NextResponse.json({ error: "Tagihan tidak ditemukan." }, { status: 404 });
    }
    if (profile.role === "reseller") {
      const { data: seller } = await db.from("resellers")
        .select("id, package").eq("user_id", profile.id).maybeSingle();
      if (!seller || seller.id !== tx.reseller_id || seller.package !== "reseller") {
        return NextResponse.json({ error: "Anda tidak dapat mengubah tagihan ini." }, { status: 403 });
      }
    }
    if (!tx.reseller_id || tx.status === "paid") {
      return NextResponse.json({ error: "Tagihan sudah lunas atau tidak memenuhi syarat." }, { status: 409 });
    }
    if (!Number.isInteger(Number(tx.amount)) || Number(tx.amount) < 1000) {
      return NextResponse.json({ error: "Nominal tagihan tidak valid." }, { status: 400 });
    }

    const expired = !tx.midtrans_redirect_url || !tx.payment_link_expires_at
      || Date.parse(tx.payment_link_expires_at) <= Date.now();
    if (!expired && tx.status === "pending") {
      return NextResponse.json({
        error: "Link masih berlaku, gunakan link pembayaran yang sudah ada.",
        paymentUrl: tx.midtrans_redirect_url,
        expiresAt: tx.payment_link_expires_at,
      }, { status: 409 });
    }

    const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const auth = "Basic " + Buffer.from(midtransKey + ":").toString("base64");
    const base = production ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";
    const oldOrderId = tx.midtrans_order_id;

    // Never discard a payment that may have been made on the previous link.
    // On a provider outage / uncertain pending state, renewal must fail closed.
    if (oldOrderId) {
      const statusResponse = await fetch(base + "/v2/" + encodeURIComponent(oldOrderId) + "/status", {
        headers: { Authorization: auth, Accept: "application/json" },
        cache: "no-store",
      });
      if (statusResponse.ok) {
        const state = await statusResponse.json();
        const currentStatus = String(state.transaction_status || "");
        const paid = currentStatus === "settlement"
          || (currentStatus === "capture" && state.fraud_status === "accept");
        if (paid) {
          return NextResponse.json({
            error: "Pembayaran sebelumnya sudah berhasil. Tekan Cek Midtrans terlebih dahulu; jangan membuat tagihan baru.",
          }, { status: 409 });
        }
        if (!["expire", "deny", "cancel", "failure"].includes(currentStatus)) {
          return NextResponse.json({
            error: "Pembayaran lama masih diproses di Midtrans. Periksa statusnya sebelum memperbarui link.",
          }, { status: 409 });
        }
      } else if (statusResponse.status !== 404) {
        return NextResponse.json({
          error: "Midtrans belum dapat memverifikasi tagihan lama. Coba lagi nanti.",
        }, { status: 502 });
      } else if (!expired) {
        return NextResponse.json({ error: "Link masih berlaku." }, { status: 409 });
      }
    }

    const { data: client } = await db.from("clients")
      .select("name, email, whatsapp").eq("id", tx.client_id).maybeSingle();
    if (!client) {
      return NextResponse.json({ error: "Data client tidak ditemukan." }, { status: 404 });
    }

    const orderId = "VSTQ-RC-" + Date.now() + "-" + crypto.randomBytes(5).toString("hex");
    const snapEndpoint = production
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";
    const response = await fetch(snapEndpoint, {
      method: "POST",
      headers: {
        Authorization: auth, Accept: "application/json", "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: Number(tx.amount) },
        item_details: [{
          id: "reseller-client-invitation", price: Number(tx.amount), quantity: 1,
          name: "Undangan Digital Vistiq",
        }],
        customer_details: {
          first_name: client.name || "Client", email: client.email || undefined,
          phone: client.whatsapp || undefined,
        },
        expiry: { unit: "days", duration: LINK_DAYS },
        page_expiry: { unit: "days", duration: LINK_DAYS },
        custom_field1: "reseller_client",
        custom_field2: tx.id,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({})) as {
      redirect_url?: string; error_messages?: string[];
    };
    if (!response.ok || !data.redirect_url) {
      console.error("renew_client_link_midtrans_failed", response.status, data.error_messages);
      return NextResponse.json({ error: "Midtrans gagal membuat link baru. Coba lagi nanti." }, { status: 502 });
    }

    const expiresAt = new Date(Date.now() + LINK_MS).toISOString();
    let update = db.from("transactions")
      .update({
        midtrans_order_id: orderId,
        midtrans_redirect_url: data.redirect_url,
        payment_link_expires_at: expiresAt,
        status: "pending",
      })
      .eq("id", tx.id)
      .neq("status", "paid");
    update = oldOrderId ? update.eq("midtrans_order_id", oldOrderId) : update.is("midtrans_order_id", null);
    const { data: saved, error: saveError } = await update.select("id").maybeSingle();
    if (saveError || !saved) {
      console.error("renew_client_link_save_failed", saveError);
      return NextResponse.json({ error: "Tagihan berubah atau gagal diperbarui. Muat ulang sebelum mencoba lagi." }, { status: 409 });
    }
    return NextResponse.json({
      success: true, paymentUrl: data.redirect_url, expiresAt,
    });
  } catch (error) {
    console.error("renew_client_link_unexpected", error);
    return NextResponse.json({ error: "Gagal memperbarui link pembayaran. Silakan coba lagi." }, { status: 500 });
  }
}
