export const RESELLER_REGULAR_JOIN_FEE = 149_000;
export const RESELLER_PROMO_JOIN_FEE = 79_000;
// The owner ends this promotion manually; the daily display timer is not expiry.
export const RESELLER_PROMO_ACTIVE: boolean = true;
export const RESELLER_JOIN_FEE = RESELLER_PROMO_ACTIVE
  ? RESELLER_PROMO_JOIN_FEE
  : RESELLER_REGULAR_JOIN_FEE;
export const RESELLER_JOIN_PRICE_LABEL = `Rp${RESELLER_JOIN_FEE.toLocaleString("id-ID")}`;
export const INVITATION_ACTIVATION_FEE = 20_000;
export const MITRA_BRAND_MONTHLY_FEE = 59_000;

export type ResellerBillingModel = "legacy_commission" | "per_invitation" | "monthly_subscription";

export function usesInvitationActivationFee(model?: string | null) {
  return model === "per_invitation";
}

export function usesMonthlySubscription(model?: string | null) {
  return model === "monthly_subscription";
}
