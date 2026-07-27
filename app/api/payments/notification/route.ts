import "server-only";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { packageFromOrderId } from "@/lib/paymentPackages";
import { provisionPaidOrder } from "@/lib/provisionPaidOrder";

export async function POST(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return NextResponse.json({ error: "Missing configuration" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = String(body.order_id ?? "");

  // Midtrans' Sandbox dashboard sends a synthetic notification with an
  // order id such as SANDBOX-M123... when the merchant clicks "Test".
  // Acknowledge that connectivity check without changing any real order.
  if (/^SANDBOX-M/i.test(orderId)) {
    return NextResponse.json({ received: true, test: true });
  }

  const grossAmount = String(body.gross_amount ?? "");
  const expectedSignature = crypto
    .createHash("sha512")
    .update(`${orderId}${body.status_code ?? ""}${grossAmount}${serverKey}`)
    .digest("hex");

  const signature = String(body.signature_key ?? "");
  const validSignature = signature.length === expectedSignature.length && crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
  const matchedPackage = packageFromOrderId(orderId);

  if (!validSignature || !matchedPackage || Number(grossAmount) !== matchedPackage[1].amount) {
    return NextResponse.json({ error: "Invalid notification" }, { status: 403 });
  }

  const transactionStatus = String(body.transaction_status ?? "pending");
  const fraudStatus = String(body.fraud_status ?? "accept");
  const paid = transactionStatus === "settlement" || (transactionStatus === "capture" && fraudStatus === "accept");
  const normalizedStatus = paid
    ? "paid"
    : ["deny", "cancel", "expire"].includes(transactionStatus)
      ? transactionStatus
      : "pending";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceRoleKey) {
    const supabase = createServiceClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase
      .from("checkout_orders")
      .update({
        status: normalizedStatus,
        payment_type: body.payment_type ?? null,
        transaction_id: body.transaction_id ?? null,
        paid_at: paid ? new Date().toISOString() : null,
        raw_notification: body,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);
    if (error) console.warn("checkout_orders notification skipped:", error.message);

    if (!error && paid) {
      const { data: order } = await supabase.from("checkout_orders").select("id, affiliate_id, package_id, amount").eq("order_id", orderId).single();
      if (order?.affiliate_id) {
        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("commission_percent")
          .eq("id", order.affiliate_id)
          .single();
        const commissionPercent = Number(affiliate?.commission_percent ?? 10);
        await supabase.from("affiliate_commissions").upsert({
          affiliate_id: order.affiliate_id, checkout_order_id: order.id, order_id: orderId,
          package_id: order.package_id, sale_amount: order.amount,
          commission_amount: Math.round(Number(order.amount) * commissionPercent / 100), status: "held",
          available_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        }, { onConflict: "checkout_order_id", ignoreDuplicates: true });
      }
      try {
        await provisionPaidOrder(supabase, orderId, new URL(request.url).origin);
      } catch (provisionError) {
        console.error("checkout account provisioning failed:", provisionError);
      }
    }
    if (!error && ["deny", "cancel", "expire"].includes(normalizedStatus)) {
      const { data: order } = await supabase.from("checkout_orders").select("id").eq("order_id", orderId).single();
      if (order) {
        await supabase.from("affiliate_commissions").update({ status: "cancelled" }).eq("checkout_order_id", order.id).neq("status", "paid");
      }
    }
  }

  return NextResponse.json({ received: true });
}
