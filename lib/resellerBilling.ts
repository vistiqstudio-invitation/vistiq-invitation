export const INVITATION_ACTIVATION_FEE = 20_000;

export type ResellerBillingModel = "legacy_commission" | "per_invitation";

export function usesInvitationActivationFee(model?: string | null) {
  return model === "per_invitation";
}
