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

type PackageOrderOptions = {
  status: "pending" | "paid";
  paymentType: string;
  authUserId?: string | null;
  paidAt?: string | null;
  confirmedBy?: string | null;
  confirmedAt?: string | null;
  settlementAppliedAt?: string | null;
};

function packageIdFor(pkg: ManualResellerPackage) {
  return pkg === "reseller_brand" ? "reseller-brand" : "reseller";
}

async function createPackageOrder(
  supabase: SupabaseClient,
  input: ManualPackageOrderInput,
  options: PackageOrderOptions,
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
      status: options.status,
      payment_type: options.paymentType,
      auth_user_id: options.authUserId ?? null,
      provision_status: "completed",
      account_created_at: createdAt,
      reseller_id: input.resellerId,
      order_source: "owner_manual",
      paid_at: options.paidAt ?? null,
      confirmed_by: options.confirmedBy ?? null,
      confirmed_at: options.confirmedAt ?? null,
      settlement_applied_at: options.settlementAppliedAt ?? null,
    })
    .select("id, order_id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      if (options.status === "pending") {
        throw new Error("Reseller ini masih memiliki order paket manual yang pending.");
      }

      // The auth_user_id unique index protects the paid admin-created order
      // from being inserted twice. Treat an exact retry as success so the
      // account and its financial record stay intact.
      if (options.authUserId) {
        const { data: existing } = await supabase
          .from("checkout_orders")
          .select("id, order_id, status, package_id, reseller_id, payment_type")
          .eq("auth_user_id", options.authUserId)
          .maybeSingle();

        if (
          existing?.status === "paid" &&
          existing.package_id === packageId &&
          existing.reseller_id === input.resellerId &&
          existing.payment_type === "admin_created"
        ) {
          return { id: existing.id as string, orderId: existing.order_id as string };
        }
      }

      throw new Error("Akun ini sudah memiliki order paket yang tercatat.");
    }
    throw new Error(error?.message || "Order paket manual gagal dibuat.");
  }

  return { id: data.id as string, orderId: data.order_id as string };
}

export async function createManualPackageOrder(
  supabase: SupabaseClient,
  input: ManualPackageOrderInput,
) {
  return createPackageOrder(supabase, input, {
    status: "pending",
    paymentType: "manual_transfer",
  });
}

export async function createAdminPaidPackageOrder(
  supabase: SupabaseClient,
  input: ManualPackageOrderInput & { authUserId: string; confirmedBy: string },
) {
  const settledAt = new Date().toISOString();

  return createPackageOrder(supabase, input, {
    status: "paid",
    paymentType: "admin_created",
    authUserId: input.authUserId,
    paidAt: settledAt,
    confirmedBy: input.confirmedBy,
    confirmedAt: settledAt,
    settlementAppliedAt: settledAt,
  });
}
