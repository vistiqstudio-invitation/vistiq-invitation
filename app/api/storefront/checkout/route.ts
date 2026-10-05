import "server-only";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { themeList, aqiqahThemeList, khitanThemeList, birthdayThemeList, type ThemeMeta } from "@/lib/theme";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function positive(...values: unknown[]) {
  for (const value of values) {
    const amount = Number(value ?? 0);
    if (Number.isFinite(amount) && amount > 0) return Math.round(amount);
  }
  return 0;
}

function getTheme(category: string, themeKey: string): ThemeMeta | undefined {
  const list = category === "wedding"
    ? themeList
    : category === "khitan"
      ? khitanThemeList
      : category === "akikah"
        ? aqiqahThemeList
        : category === "ulang-tahun"
          ? birthdayThemeList
          : [];
  return list.find((theme) => theme.key === themeKey);
}

function weddingAmount(theme: ThemeMeta, reseller: Record<string, unknown>) {
  const tags = theme.tags || [];
  if (tags.includes("premium-3d-motion")) {
    return positive(reseller.wedding_motion_price, reseller.wedding_price, reseller.starting_price);
  }
  if (tags.includes("luxury-art")) {
    return positive(reseller.wedding_luxury_art_price, reseller.wedding_price, reseller.starting_price);
  }
  if (tags.includes("tanpa-foto")) {
    return positive(reseller.wedding_no_photo_price, reseller.wedding_price, reseller.starting_price);
  }
  if (tags.includes("adat") || tags.includes("3d-motion-adat")) {
    return positive(reseller.wedding_adat_price, reseller.wedding_price, reseller.starting_price);
  }
  if (tags.includes("premium")) {
    return positive(reseller.wedding_premium_price, reseller.wedding_price, reseller.starting_price);
  }
  return positive(reseller.wedding_regular_price, reseller.wedding_price, reseller.starting_price);
}

function orderAmount(category: string, theme: ThemeMeta, reseller: Record<string, unknown>) {
  if (category === "wedding") return weddingAmount(theme, reseller);
  if (category === "khitan") return positive(reseller.khitan_price, reseller.starting_price);
  if (category === "akikah") return positive(reseller.aqiqah_price, reseller.starting_price);
  if (category === "ulang-tahun") return positive(reseller.birthday_price, reseller.starting_price);
  return 0;
}

export async function POST(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serverKey || !supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Konfigurasi checkout belum tersedia." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data checkout tidak valid." }, { status: 400 });
  }

  const resellerKey = clean(body.resellerKey, 255).toLowerCase();
  const themeKey = clean(body.themeKey, 100);
  const category = clean(body.category, 32);
  const name = clean(body.name, 50);
  const email = clean(body.email, 100).toLowerCase();
  const phone = clean(body.phone, 24).replace(/[^0-9+]/g, "");
  const theme = getTheme(category, themeKey);

  if (!resellerKey || !theme) {
    return NextResponse.json({ error: "Reseller atau tema tidak valid." }, { status: 400 });
  }
  if (name.length < 2 || !validEmail(email) || phone.replace(/\D/g, "").length < 9) {
    return NextResponse.json({ error: "Nama, email, dan nomor WhatsApp wajib diisi dengan benar." }, { status: 400 });
  }

  const supabase = createServiceClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const resellerQuery = supabase
    .from("resellers")
    .select("id,status,starting_price,wedding_price,khitan_price,aqiqah_price,birthday_price,wedding_premium_price,wedding_motion_price,wedding_luxury_art_price,wedding_regular_price,wedding_adat_price,wedding_no_photo_price")
    .eq("status", "active");
  const { data: reseller, error: resellerError } = isUuid(resellerKey)
    ? await resellerQuery.eq("id", resellerKey).maybeSingle()
    : await resellerQuery.or(`landing_slug.eq.${resellerKey},custom_domain.eq.${resellerKey},free_subdomain.eq.${resellerKey}`).maybeSingle();

  if (resellerError || !reseller) {
    return NextResponse.json({ error: "Katalog reseller tidak ditemukan atau belum aktif." }, { status: 404 });
  }

  const resellerRow = reseller as unknown as Record<string, unknown>;
  const resellerId = String(resellerRow.id ?? "");
  if (!resellerId) {
    return NextResponse.json({ error: "Data reseller tidak valid." }, { status: 500 });
  }

  const amount = orderAmount(category, theme, resellerRow);
  if (amount <= 0) {
    return NextResponse.json({ error: "Harga tema belum dikonfigurasi oleh reseller." }, { status: 409 });
  }

  const dbCategory = category === "akikah" ? "aqiqah" : category === "ulang-tahun" ? "birthday" : category;
  const packageId = `theme:${dbCategory}:${theme.key}`;
  const orderId = `VSTQ-ST-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
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
      transaction_details: { order_id: orderId, gross_amount: amount },
      item_details: [{ id: theme.key, price: amount, quantity: 1, name: theme.label.slice(0, 50) }],
      customer_details: { first_name: name, email, phone },
      expiry: { unit: "days", duration: 1 },
      page_expiry: { unit: "days", duration: 1 },
      custom_field1: "reseller_storefront",
      custom_field2: resellerId,
      custom_field3: theme.key,
    }),
    cache: "no-store",
  });

  const result = (await midtransResponse.json()) as { token?: string; redirect_url?: string; error_messages?: string[] };
  if (!midtransResponse.ok || !result.token) {
    console.error("storefront-midtrans-create:", result.error_messages ?? result);
    return NextResponse.json({ error: result.error_messages?.[0] ?? "Midtrans belum dapat membuat transaksi." }, { status: 502 });
  }

  const { error: insertError } = await supabase.from("checkout_orders").insert({
    order_id: orderId,
    package_id: packageId,
    package_name: theme.label,
    amount,
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    status: "pending",
    reseller_id: resellerId,
    order_source: "reseller_storefront",
  });

  if (insertError) {
    console.error("storefront checkout order insert failed:", insertError.message);
    return NextResponse.json({ error: "Order pembayaran gagal dicatat. Silakan coba lagi." }, { status: 500 });
  }

  return NextResponse.json({ token: result.token, orderId, redirectUrl: result.redirect_url });
}
