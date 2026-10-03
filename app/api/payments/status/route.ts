import "server-only";

import { after, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { provisionPaidOrder } from "@/lib/provisionPaidOrder";
import { safelyProcessPaymentWhatsApp } from "@/lib/paymentWhatsApp";

export async function GET(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const orderId = new URL(request.url).searchParams.get("order_id") ?? "";
  const isResellerClientOrder = /^VSTQ-(RC|IA)-[A-Za-z0-9-]{8,60}$/.test(orderId);
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
        .select("id, client_id, invitation_id, transaction_type, amount, status")
        .eq("midtrans_order_id", orderId)
        .maybeSingle();

      if (transaction && Number(data.gross_amount) === Number(transaction.amount)) {
        const updatePayload: Record<string, unknown> = {
          status: normalizedStatus,
          payment_type: data.payment_type ?? null,
          midtrans_transaction_id: data.transaction_id ?? null,
        };

        // Use the same database-owned 24-hour hold as payment notifications.
        // Status refreshes must preserve the original payment/availability time.

        const { error: updateError } = await supabase
          .from("transactions")
          .update(updatePayload)
          .eq("id", transaction.id);

        if (!updateError && paid) after(() => safelyProcessPaymentWhatsApp(supabase));

        // For invitation_activation, the database trigger publishes the invitation
        // and activates its client in the same transaction.
      }
    } else {
      const { data: order } = await supabase
        .from("checkout_orders")
        .select("status, provision_status, amount")
        .eq("order_id", orderId)
        .maybeSingle();
      accountStatus = order?.provision_status ?? null;

      if (order && paid && Number(data.gross_amount) === Number(order.amount) && order.status !== "paid") {
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
          after(() => safelyProcessPaymentWhatsApp(supabase));
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
    invitationActivation: isResellerClientOrder && orderId.startsWith("VSTQ-IA-"),
  });
}
