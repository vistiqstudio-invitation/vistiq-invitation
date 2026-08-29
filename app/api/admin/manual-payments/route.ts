import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";
import { provisionPaidOrder } from "@/lib/provisionPaidOrder";

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function addOneMonth(current?: string | null) {
  const now = new Date();
  const currentDate = current ? new Date(current) : null;
  const base = currentDate && currentDate.getTime() > now.getTime() ? currentDate : now;
  const next = new Date(base);
  next.setMonth(next.getMonth() + 1);
  return next.toISOString();
}

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const supabase = serviceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Konfigurasi server belum lengkap." }, { status: 503 });
  }

  let body: { type?: string; id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  if (!body.id || !["reseller-client", "checkout-order"].includes(body.type || "")) {
    return NextResponse.json({ error: "Jenis pembayaran tidak valid." }, { status: 400 });
  }

  const paidAt = new Date().toISOString();

  if (body.type === "reseller-client") {
    const { data: transaction, error } = await supabase
      .from("transactions")
      .select("id, reseller_id, status, amount, commission")
      .eq("id", body.id)
      .maybeSingle();

    if (error || !transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
    }

    const { data: reseller } = await supabase
      .from("resellers")
      .select("package")
      .eq("id", transaction.reseller_id)
      .maybeSingle();

    if (!reseller || reseller.package !== "reseller") {
      return NextResponse.json(
        { error: "Hanya pembayaran client Reseller standar yang diproses oleh Vistiq." },
        { status: 400 },
      );
    }

    if (transaction.status === "paid") {
      return NextResponse.json({ success: true, alreadyPaid: true });
    }
    if (transaction.status !== "pending") {
      return NextResponse.json({ error: "Status transaksi tidak dapat dikonfirmasi." }, { status: 409 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("transactions")
      .update({
        status: "paid",
        payment_type: "manual_whatsapp",
        settled_at: paidAt,
      })
      .eq("id", body.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    if (!updated) {
      const { data: latest } = await supabase.from("transactions").select("status").eq("id", body.id).maybeSingle();
      if (latest?.status === "paid") return NextResponse.json({ success: true, alreadyPaid: true });
      return NextResponse.json({ error: "Transaksi berubah sebelum dikonfirmasi. Silakan refresh." }, { status: 409 });
    }

    return NextResponse.json({ success: true });
  }

  const { data: order, error: orderError } = await supabase
    .from("checkout_orders")
    .select("id, order_id, package_id, package_name, status, auth_user_id, customer_phone")
    .eq("id", body.id)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order paket tidak ditemukan." }, { status: 404 });
  }

  if (!["reseller", "reseller-brand"].includes(order.package_id)) {
    return NextResponse.json(
      { error: "Konfirmasi manual hanya untuk Paket Reseller dan Reseller Brand." },
      { status: 400 },
    );
  }

  if (order.status === "paid") {
    return NextResponse.json({ success: true, alreadyPaid: true });
  }
  if (order.status !== "pending") {
    return NextResponse.json({ error: "Status order tidak dapat dikonfirmasi." }, { status: 409 });
  }

  const { data: paidOrder, error: paidError } = await supabase
    .from("checkout_orders")
    .update({
      status: "paid",
      payment_type: "manual_whatsapp",
      paid_at: paidAt,
      updated_at: paidAt,
    })
    .eq("id", body.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (paidError) {
    return NextResponse.json({ error: paidError.message }, { status: 500 });
  }
  if (!paidOrder) {
    const { data: latest } = await supabase.from("checkout_orders").select("status").eq("id", body.id).maybeSingle();
    if (latest?.status === "paid") return NextResponse.json({ success: true, alreadyPaid: true });
    return NextResponse.json({ error: "Order berubah sebelum dikonfirmasi. Silakan refresh." }, { status: 409 });
  }

  try {
    // Reseller Brand yang checkout kembali dengan akun yang sama dianggap perpanjangan.
    if (order.package_id === "reseller-brand" && order.auth_user_id) {
      const { data: existing } = await supabase
        .from("resellers")
        .select("id, package, brand_expires_at")
        .eq("user_id", order.auth_user_id)
        .maybeSingle();

      if (existing && ["reseller-brand", "reseller_brand"].includes(existing.package)) {
        const nextExpiry = addOneMonth(existing.brand_expires_at);
        const { error: renewError } = await supabase
          .from("resellers")
          .update({
            package: "reseller_brand",
            status: "active",
            brand_active: true,
            commission_percent: 100,
            brand_expires_at: nextExpiry,
          })
          .eq("id", existing.id);
        if (renewError) throw renewError;

        await supabase
          .from("checkout_orders")
          .update({
            provision_status: "completed",
            provision_error: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        return NextResponse.json({ success: true, renewed: true, brandExpiresAt: nextExpiry });
      }
    }

    const origin = new URL(request.url).origin;
    await provisionPaidOrder(supabase, order.order_id, origin);
    return NextResponse.json({ success: true, provisioned: true });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Pembayaran tercatat, tetapi aktivasi akun gagal.";
    return NextResponse.json({
      success: true,
      provisioningFailed: true,
      warning: message,
    });
  }
}
