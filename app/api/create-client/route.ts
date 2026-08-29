import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { getSessionProfile } from "@/lib/supabase/dal";

const ADMIN_WHATSAPP = "6281371338032";

function generatePassword() {
  return crypto.randomBytes(9).toString("base64url");
}

function manualClientPaymentUrl(params: {
  transactionId: string;
  amount: number;
  clientName: string;
  resellerName: string;
}) {
  const message = [
    "Halo Admin Vistiq, saya ingin konfirmasi pembayaran undangan client Reseller.",
    "",
    `ID Transaksi: ${params.transactionId}`,
    `Client: ${params.clientName}`,
    `Reseller: ${params.resellerName}`,
    `Total: Rp ${params.amount.toLocaleString("id-ID")}`,
    "",
    "Mohon kirimkan informasi rekening Vistiq. Setelah transfer diterima, mohon tandai Pembayaran Sukses dari Dashboard Owner.",
  ].join("\n");
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
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
    return NextResponse.json({ error: "Nama dan email wajib diisi." }, { status: 400 });
  }

  let reseller_id: string | null = null;
  let resellerPackage: string | null = null;
  let resellerName = profile.name || "Reseller";

  if (profile.role === "reseller") {
    const { data: reseller } = await supabaseAdmin
      .from("resellers")
      .select("id, package, name")
      .eq("user_id", profile.id)
      .single();

    if (!reseller) {
      return NextResponse.json({ error: "Akun reseller belum terhubung." }, { status: 400 });
    }

    reseller_id = reseller.id;
    resellerPackage = reseller.package;
    resellerName = reseller.name || resellerName;
  } else if (body.reseller_id) {
    reseller_id = body.reseller_id;
    const { data: reseller } = await supabaseAdmin
      .from("resellers")
      .select("package, name")
      .eq("id", reseller_id)
      .maybeSingle();
    resellerPackage = reseller?.package ?? null;
    resellerName = reseller?.name || resellerName;
  }

  const salePrice = resellerPackage === "reseller"
    ? Math.max(1000, Number.isFinite(requestedSalePrice) ? requestedSalePrice : 100000)
    : Math.max(0, Number.isFinite(requestedSalePrice) ? requestedSalePrice : 100000);

  if (resellerPackage === "reseller") status = "pending";

  const password = generatePassword();
  const { data: created, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
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
    return NextResponse.json({ error: "Gagal menyimpan data client." }, { status: 500 });
  }

  let paymentUrl: string | null = null;
  let transactionId: string | null = null;

  // Trigger database membuat transaksi pending hanya untuk Reseller standar.
  // Pembayaran dilakukan manual ke Vistiq; tidak lagi membuat link Midtrans.
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
      transactionId = transaction.id;
      await supabaseAdmin
        .from("transactions")
        .update({ payment_type: "manual_whatsapp" })
        .eq("id", transaction.id)
        .eq("status", "pending");
      paymentUrl = manualClientPaymentUrl({
        transactionId: transaction.id,
        amount: Number(transaction.amount),
        clientName: name,
        resellerName,
      });
    }
  }

  return NextResponse.json({
    clientId: client.id,
    email,
    password,
    salePrice,
    transactionId,
    paymentUrl,
    paymentMethod: resellerPackage === "reseller" ? "manual_whatsapp" : "direct_to_brand_reseller",
    paymentError: null,
  });
}
