import "server-only";

import crypto from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PAYMENT_PACKAGES } from "@/lib/paymentPackages";

export type ManualResellerPackage = "reseller" | "reseller_brand";

type ManualPackageOrderInput = {
  resellerId: string;
  package: ManualResellerPackage;
  name: string;
  email: string;
  whatsapp: string;
  amount?: number;
};

function packageIdFor(pkg: ManualResellerPackage) {
  return pkg === "reseller_brand" ? "reseller-brand" : "reseller";
}

export async function createManualPackageOrder(
  supabase: SupabaseClient,
  input: ManualPackageOrderInput,
) {
  const packageId = packageIdFor(input.package);
  const packageInfo = PAYMENT_PACKAGES[packageId];
  const amount = input.amount ?? packageInfo.amount;

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error("Nominal pembayaran tidak valid.");
  }

  const orderCode = packageId === "reseller-brand" ? "RB" : "RS";
  const orderId = `VSTQ-MANUAL-${orderCode}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const createdAt = new Date().toISOString();

  const { data, error } = await supabase
    .from("checkout_orders")
    .insert({
      order_id: orderId,
      package_id: packageId,
      package_name: packageInfo.name,
      amount,
      customer_name: input.name.trim(),
      customer_email: input.email.trim().toLowerCase(),
      customer_phone: input.whatsapp.trim(),
      status: "pending",
      payment_type: "manual_transfer",
      provision_status: "completed",
      account_created_at: createdAt,
      reseller_id: input.resellerId,
      order_source: "owner_manual",
    })
    .select("id, order_id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      throw new Error("Reseller ini masih memiliki order paket manual yang pending.");
    }
    throw new Error(error?.message || "Order paket manual gagal dibuat.");
  }

  return { id: data.id as string, orderId: data.order_id as string };
}
