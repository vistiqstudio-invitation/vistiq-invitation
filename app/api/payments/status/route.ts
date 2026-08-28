import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { provisionPaidOrder } from "@/lib/provisionPaidOrder";

export async function GET(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const orderId = new URL(request.url).searchParams.get("order_id") ?? "";
  const isResellerClientOrder = /^VSTQ-RC-[A-Za-z0-9-]{8,60}$/.test(orderId);
  const isPackageOrder = /^VSTQ-(CL|RS|RB)-[A-Za-z0-9-]{8,45}$/.test(orderId);

  if (!isResellerClientOrder && !isPackageOrder) {
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

  const paid = data.transaction_status === "settlement"
    || (data.transaction_status === "capture" && data.fraud_status === "accept");
  const normalizedStatus = paid
    ? "paid"
    : ["deny", "cancel", "expire"].includes(data.transaction_status)
      ? data.transaction_status
      : "pending";

  let accountStatus: string | null = null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceRoleKey) {
    const supabase = createServiceClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    if (isResellerClientOrder) {
      const { data: transaction } = await supabase
        .from("transactions")
        .select("id, client_id, amount, status")
        .eq("midtrans_order_id", orderId)
        .maybeSingle();

      if (transaction && Number(data.gross_amount) === Number(transaction.amount)) {
        const updatePayload: Record<string, unknown> = {
          status: normalizedStatus,
          payment_type: data.payment_type ?? null,
          midtrans_transaction_id: data.transaction_id ?? null,
        };

        if (paid) {
          updatePayload.paid_at = new Date().toISOString();
          updatePayload.available_at = new Date(Date.now() + 6 * 86400000).toISOString();
        }

        await supabase
          .from("transactions")
          .update(updatePayload)
          .eq("id", transaction.id);

        if (paid && transaction.client_id) {
          await supabase.from("clients").update({ status: "active" }).eq("id", transaction.client_id);
          // Payment is recorded here; invitation activation requires Vistiq admin approval.
        }
      }
    } else {
      const { data: order } = await supabase
        .from("checkout_orders")
        .select("status, provision_status")
        .eq("order_id", orderId)
        .maybeSingle();
      accountStatus = order?.provision_status ?? null;

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
            .select("provision_status")
            .eq("order_id", orderId)
            .maybeSingle();
          accountStatus = refreshed?.provision_status ?? accountStatus;
        }
      }
    }
  }

  return NextResponse.json({
    orderId: data.order_id,
    status: data.transaction_status,
    normalizedStatus,
    paid,
    paymentType: data.payment_type ?? null,
    grossAmount: data.gross_amount,
    transactionTime: data.transaction_time ?? null,
    settlementTime: data.settlement_time ?? null,
    accountStatus,
  });
}
