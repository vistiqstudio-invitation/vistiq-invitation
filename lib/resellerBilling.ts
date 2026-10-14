export const RESELLER_JOIN_FEE = 149_000;
export const INVITATION_ACTIVATION_FEE = 20_000;

export type ResellerBillingModel = "per_invitation";

/**
 * Semua reseller Vistiq memakai biaya aktivasi per undangan.
 * Parameter dipertahankan agar pemanggil lama tetap kompatibel selama migrasi UI.
 */
export function usesInvitationActivationFee(_model?: string | null) {
  return true;
}
