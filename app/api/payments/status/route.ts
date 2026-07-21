import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { provisionPaidOrder } from "@/lib/provisionPaidOrder";

export async function GET(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const orderId = new URL(request.url).searchParams.get("order_id") ?? "";

  if (!/^VSTQ-(CL|RS|RB)-[A-Za-z0-9-]{8,45}$/.test(orderId)) {
    return NextResponse.json({ error: "Nomor pesanan tidak valid." }, { status: 400 });
  }
  if (!serverKey) {
    return NextResponse.json({ error: "Konfigurasi pembayaran belum tersedia." }, { status: 503 });
  }

  const base = production ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";
  const response = await fetch(`${base}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    },
    cache: "no-store",
  });
  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: response.status === 404 ? "Pembayaran belum dipilih atau belum tercatat." : "Status belum dapat diperiksa." },
      { status: response.status === 404 ? 404 : 502 },
    );
  }

  let accountStatus: string | null = null;
  let accountError: string | null = null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceRoleKey) {
    const supabase = createServiceClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: order } = await supabase
      .from("checkout_orders")
      .select("status, provision_status, provision_error")
      .eq("order_id", orderId)
      .maybeSingle();
    accountStatus = order?.provision_status ?? null;
    accountError = order?.provision_error ?? null;

    // Safety net: Midtrans's webhook notification can fail to arrive (wrong
    // notification URL, downtime, etc). This status check talks to Midtrans
    // directly with our own server key, so if it says paid but our own
    // record is still pending, self-heal by replaying what the webhook does.
    const paid = data.transaction_status === "settlement" || (data.transaction_status === "capture" && data.fraud_status === "accept");
    if (order && paid && order.status !== "paid") {
      const { error: updateError } = await supabase
        .from("checkout_orders")
        .update({
          status: "paid",
          payment_type: data.payment_type ?? null,
          transaction_id: data.transaction_id ?? null,
          paid_at: new Date().toISOString(),
          raw_notification: data,
          updated_at: new Date().toISOString(),
        })
        .eq("order_id", orderId);
      if (!updateError) {
        try {
          await provisionPaidOrder(supabase, orderId, new URL(request.url).origin);
        } catch (provisionError) {
          console.error("checkout account provisioning failed (status sync):", provisionError);
        }
        const { data: refreshed } = await supabase
          .from("checkout_orders")
          .select("provision_status, provision_error")
          .eq("order_id", orderId)
          .maybeSingle();
        accountStatus = refreshed?.provision_status ?? accountStatus;
        accountError = refreshed?.provision_error ?? accountError;
      }
    }
  }

  return NextResponse.json({
    orderId: data.order_id,
    status: data.transaction_status,
    paymentType: data.payment_type ?? null,
    grossAmount: data.gross_amount,
    transactionTime: data.transaction_time ?? null,
    settlementTime: data.settlement_time ?? null,
    accountStatus,
    accountError,
  });
}
