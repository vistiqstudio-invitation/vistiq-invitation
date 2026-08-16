import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { getSessionProfile } from "@/lib/supabase/dal";

function generatePassword() {
  return crypto.randomBytes(9).toString("base64url");
}

async function createClientPaymentLink({
  supabaseAdmin,
  transactionId,
  amount,
  name,
  email,
  phone,
}: {
  supabaseAdmin: ReturnType<typeof createServiceClient>;
  transactionId: string;
  amount: number;
  name: string;
  email: string;
  phone: string;
}) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  if (!serverKey) throw new Error("Konfigurasi Midtrans belum tersedia.");

  const orderId = `VSTQ-RC-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const endpoint = production
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: amount },
      item_details: [
        {
          id: "reseller-client-invitation",
          price: amount,
          quantity: 1,
          name: "Undangan Digital Vistiq",
        },
      ],
      customer_details: { first_name: name, email, phone },
      expiry: { unit: "hours", duration: 24 },
      custom_field1: "reseller_client",
      custom_field2: transactionId,
    }),
    cache: "no-store",
  });

  const result = (await response.json()) as {
    token?: string;
    redirect_url?: string;
    error_messages?: string[];
  };

  if (!response.ok || !result.redirect_url) {
    throw new Error(result.error_messages?.[0] || "Gagal membuat link pembayaran Midtrans.");
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const { error: updateError } = await supabaseAdmin
    .from("transactions")
    .update({
      midtrans_order_id: orderId,
      midtrans_redirect_url: result.redirect_url,
      payment_link_expires_at: expiresAt,
    })
    .eq("id", transactionId);

  if (updateError) throw new Error(updateError.message);

  return { orderId, paymentUrl: result.redirect_url, expiresAt };
}

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
      { status: 500 },
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
  let status = body.status || "active";
  const requestedSalePrice = Math.round(Number(body.sale_price || 100000));

  if (!name || !email) {
    return NextResponse.json(
      { error: "Nama dan email wajib diisi." },
      { status: 400 },
    );
  }

  let reseller_id: string | null = null;
  let resellerPackage: "reseller" | "reseller_brand" | null = null;

  if (profile.role === "reseller") {
    const { data: reseller } = await supabaseAdmin
      .from("resellers")
      .select("id, package")
      .eq("user_id", profile.id)
      .single();

    if (!reseller) {
      return NextResponse.json(
        { error: "Akun reseller belum terhubung." },
        { status: 400 },
      );
    }

    reseller_id = reseller.id;
    resellerPackage = reseller.package as "reseller" | "reseller_brand";
  } else if (body.reseller_id) {
    reseller_id = body.reseller_id;
    const { data: reseller } = await supabaseAdmin
      .from("resellers")
      .select("package")
      .eq("id", reseller_id)
      .maybeSingle();
    resellerPackage = (reseller?.package as "reseller" | "reseller_brand" | undefined) ?? null;
  }

  const salePrice = resellerPackage === "reseller"
    ? Math.max(1000, Number.isFinite(requestedSalePrice) ? requestedSalePrice : 100000)
    : Math.max(0, Number.isFinite(requestedSalePrice) ? requestedSalePrice : 100000);

  if (resellerPackage === "reseller") status = "pending";

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

  const { data: client, error: clientError } = await supabaseAdmin
    .from("clients")
    .insert({
      user_id: created.user.id,
      reseller_id,
      name,
      email,
      whatsapp,
      package_name,
      status,
      sale_price: salePrice,
    })
    .select("id")
    .single();

  if (clientError || !client) {
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json(
      { error: "Gagal menyimpan data client." },
      { status: 500 },
    );
  }

  let paymentUrl: string | null = null;
  let paymentError: string | null = null;

  if (resellerPackage === "reseller") {
    const { data: transaction } = await supabaseAdmin
      .from("transactions")
      .select("id, amount")
      .eq("client_id", client.id)
      .eq("reseller_id", reseller_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (transaction) {
      try {
        const payment = await createClientPaymentLink({
          supabaseAdmin,
          transactionId: transaction.id,
          amount: Number(transaction.amount),
          name,
          email,
          phone: whatsapp,
        });
        paymentUrl = payment.paymentUrl;
      } catch (error) {
        paymentError = error instanceof Error ? error.message : "Gagal membuat link pembayaran.";
        console.error("create-client payment link:", error);
      }
    }
  }

  return NextResponse.json({
    clientId: client.id,
    email,
    password,
    salePrice,
    paymentUrl,
    paymentError,
  });
}
