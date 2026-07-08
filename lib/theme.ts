import type { InvitationData } from "@/types/invitation";
import LuxuryGold from "@/themes/luxury-gold/LuxuryGold";
import MinimalWhite from "@/themes/minimal-white/MinimalWhite";
import IslamicGreen from "@/themes/islamic-green/IslamicGreen";

export const themeRegistry: Record<
  string,
  (props: { invitation: InvitationData }) => React.JSX.Element
> = {
  "luxury-gold": LuxuryGold,
  "minimal-white": MinimalWhite,
  "islamic-green": IslamicGreen,
};
