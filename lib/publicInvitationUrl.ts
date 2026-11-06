/**
 * All invitations are distributed on Vistiq's public primary domain.
 * Reseller custom domains may be configured for other uses, but must never
 * determine invitation share links for admin, reseller, or client accounts.
 */
export const PUBLIC_INVITATION_ORIGIN = "https://www.vistiqinvitation.com";

export function publicInvitationUrl(slug: string, guestName?: string): string {
  const base = `${PUBLIC_INVITATION_ORIGIN}/${encodeURIComponent(slug)}`;
  return guestName ? `${base}?to=${encodeURIComponent(guestName)}` : base;
}
