import type { InvitationData } from "@/types/invitation";
import LuxuryGold from "@/themes/luxury-gold/LuxuryGold";

export const themeRegistry: Record<
  string,
  (props: { invitation: InvitationData }) => React.JSX.Element
> = {
  "luxury-gold": LuxuryGold,
};
