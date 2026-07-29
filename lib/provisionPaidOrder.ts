import "server-only";

import crypto from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

type CheckoutOrder = {
  order_id: string;
  package_id: "client" | "reseller" | "reseller-brand";
  package_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};

function temporaryPassword() {
  return `${crypto.randomBytes(18).toString("base64url")}Aa1!`;
}

export async function provisionPaidOrder(
  supabase: SupabaseClient,
  orderId: string,
  redirectOrigin: string,
) {
  const { data: claimed, error: claimError } = await supabase
    .rpc("claim_checkout_provision", { target_order_id: orderId })
    .maybeSingle<CheckoutOrder>();

  if (claimError) throw new Error(`Gagal mengunci aktivasi akun: ${claimError.message}`);
  if (!claimed) return;

  let authUserId: string | null = null;

  try {
    const role = claimed.package_id === "client" ? "client" : "reseller";
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: claimed.customer_email,
      password: temporaryPassword(),
      email_confirm: true,
      user_metadata: {
        role,
        name: claimed.customer_name,
        whatsapp: claimed.customer_phone,
      },
    });

    if (createError || !created.user) {
      throw new Error(
        createError?.message.includes("already been registered")
          ? "Email sudah memiliki akun. Hubungi admin untuk menghubungkan paket."
          : createError?.message || "Akun login gagal dibuat.",
      );
    }

    authUserId = created.user.id;

    if (claimed.package_id === "client") {
      const { error } = await supabase.from("clients").insert({
        user_id: authUserId,
        reseller_id: null,
        name: claimed.customer_name,
        whatsapp: claimed.customer_phone,
        package_name: claimed.package_name,
        status: "active",
      });
      if (error) throw new Error(`Data client gagal dibuat: ${error.message}`);
    } else {
      const resellerBrand = claimed.package_id === "reseller-brand";
      const brandExpiresAt = resellerBrand
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;
      const { error } = await supabase.from("resellers").insert({
        user_id: authUserId,
        name: claimed.customer_name,
        whatsapp: claimed.customer_phone,
        package: resellerBrand ? "reseller_brand" : "reseller",
        commission_percent: resellerBrand ? 100 : 40,
        status: "active",
        brand_active: resellerBrand,
        brand_expires_at: brandExpiresAt,
      });
      if (error) throw new Error(`Data reseller gagal dibuat: ${error.message}`);
    }

    const { error: emailError } = await supabase.auth.resetPasswordForEmail(
      claimed.customer_email,
      { redirectTo: `${redirectOrigin}/reset-password` },
    );

    await supabase
      .from("checkout_orders")
      .update({
        auth_user_id: authUserId,
        provision_status: emailError ? "email_failed" : "completed",
        provision_error: emailError?.message ?? null,
        account_created_at: new Date().toISOString(),
        invite_sent_at: emailError ? null : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);
  } catch (caught) {
    if (authUserId) await supabase.auth.admin.deleteUser(authUserId);
    await supabase
      .from("checkout_orders")
      .update({
        provision_status: "failed",
        provision_error: caught instanceof Error ? caught.message.slice(0, 500) : "Aktivasi gagal.",
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);
    throw caught;
  }
}
