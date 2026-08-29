import "server-only";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { isPaymentPackage, PAYMENT_PACKAGES } from "@/lib/paymentPackages";

const ADMIN_WHATSAPP = "6281371338032";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function phoneVariants(value: string) {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("62") ? `0${digits.slice(2)}` : digits.startsWith("0") ? digits : `0${digits}`;
  const intl = digits.startsWith("62") ? digits : digits.startsWith("0") ? `62${digits.slice(1)}` : `62${digits}`;
  return Array.from(new Set([value, digits, local, intl, `+${intl}`].filter(Boolean)));
}

function manualWhatsAppUrl(params: { orderId: string; packageName: string; amount: number; name: string }) {
  const message = [
    "Halo Admin Vistiq, saya sudah membuat pesanan paket.",
    "",
    `Order: ${params.orderId}`,
    `Paket: ${params.packageName}`,
    `Total: Rp ${params.amount.toLocaleString("id-ID")}`,
    `Nama: ${params.name}`,
    "",
    "Saya ingin melakukan pembayaran manual. Mohon kirimkan informasi rekening dan setelah pembayaran diterima mohon dikonfirmasi dari Dashboard Owner.",
  ].join("\n");
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data checkout tidak valid." }, { status: 400 });
  }

  if (!isPaymentPackage(body.packageId)) {
    return NextResponse.json({ error: "Paket tidak valid." }, { status: 400 });
  }

  const name = clean(body.name, 50);
  const email = clean(body.email, 100).toLowerCase();
  const phone = clean(body.phone, 24).replace(/[^0-9+]/g, "");
  const referralCode = clean(body.referralCode, 32).toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (name.length < 2 || !validEmail(email) || phone.replace(/\D/g, "").length < 9) {
    return NextResponse.json(
      { error: "Nama, email, dan nomor WhatsApp wajib diisi dengan benar." },
      { status: 400 },
    );
  }

  const item = PAYMENT_PACKAGES[body.packageId];
  const orderId = `VSTQ-${item.code}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const manualPackage = body.packageId === "reseller" || body.packageId === "reseller-brand";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Konfigurasi checkout belum tersedia." }, { status: 503 });
  }

  const supabase = createServiceClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let affiliateId: string | null = null;
  if (referralCode) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id")
      .eq("referral_code", referralCode)
      .eq("status", "active")
      .maybeSingle();
    affiliateId = affiliate?.id ?? null;
  }

  // Untuk Reseller Brand, nomor WhatsApp yang sama dengan akun aktif dianggap
  // sebagai checkout perpanjangan. auth_user_id menjadi penanda target renewal.
  let renewalUserId: string | null = null;
  if (body.packageId === "reseller-brand") {
    const { data: existing } = await supabase
      .from("resellers")
      .select("user_id, package")
      .in("whatsapp", phoneVariants(phone))
      .in("package", ["reseller-brand", "reseller_brand"])
      .not("user_id", "is", null)
      .limit(1)
      .maybeSingle();
    renewalUserId = existing?.user_id ?? null;
  }

  const { error: orderError } = await supabase.from("checkout_orders").insert({
    order_id: orderId,
    package_id: body.packageId,
    package_name: item.name,
    amount: item.amount,
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    status: "pending",
    payment_type: manualPackage ? "manual_whatsapp" : null,
    auth_user_id: renewalUserId,
    affiliate_id: affiliateId,
    referral_code: affiliateId ? referralCode : null,
  });

  if (orderError) {
    console.error("checkout_orders insert:", orderError.message);
    return NextResponse.json({ error: "Gagal membuat order pembayaran." }, { status: 500 });
  }

  if (manualPackage) {
    return NextResponse.json({
      manual: true,
      orderId,
      amount: item.amount,
      whatsappUrl: manualWhatsAppUrl({ orderId, packageName: item.name, amount: item.amount, name }),
      renewal: Boolean(renewalUserId),
    });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  if (!serverKey) {
    return NextResponse.json({ error: "Konfigurasi pembayaran belum tersedia." }, { status: 503 });
  }

  const endpoint = production
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const midtransResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: item.amount },
      item_details: [{ id: body.packageId, price: item.amount, quantity: 1, name: item.name }],
      customer_details: { first_name: name, email, phone },
      expiry: { unit: "hours", duration: 24 },
      custom_field1: body.packageId,
    }),
    cache: "no-store",
  });

  const result = (await midtransResponse.json()) as {
    token?: string;
    redirect_url?: string;
    error_messages?: string[];
  };

  if (!midtransResponse.ok || !result.token) {
    console.error("midtrans-create:", result.error_messages ?? result);
    await supabase
      .from("checkout_orders")
      .update({ provision_error: result.error_messages?.[0] ?? "Midtrans gagal membuat transaksi." })
      .eq("order_id", orderId);
    return NextResponse.json(
      { error: result.error_messages?.[0] ?? "Midtrans belum dapat membuat transaksi." },
      { status: 502 },
    );
  }

  return NextResponse.json({ token: result.token, orderId, redirectUrl: result.redirect_url });
}
