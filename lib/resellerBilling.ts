export const RESELLER_JOIN_FEE = 149_000;
export const INVITATION_ACTIVATION_FEE = 20_000;
export const MITRA_BRAND_MONTHLY_FEE = 59_000;

export type ResellerBillingModel = "legacy_commission" | "per_invitation" | "monthly_subscription";

export function usesInvitationActivationFee(model?: string | null) {
  return model === "per_invitation";
}

export function usesMonthlySubscription(model?: string | null) {
  return model === "monthly_subscription";
}
