import { notFound } from "next/navigation";
import { birthdayThemeRegistry } from "@/lib/theme";
import { getDemoBirthdayInvitation } from "@/lib/demoBirthdayInvitation";
import { getDemoBrand, type DemoThemePageProps } from "@/lib/demoBrand";
import WhiteLabelFrame from "@/components/WhiteLabelFrame";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

export default async function DemoBirthdayThemePage({
  params,
  searchParams,
}: DemoThemePageProps) {
  const { theme } = await params;
  const Theme = birthdayThemeRegistry[theme];
  if (!Theme) notFound();

  const invitation = { ...getDemoBirthdayInvitation(theme), brand: await getDemoBrand(searchParams) };

  return (
    <WhiteLabelFrame brand={invitation.brand}>
      <WeddingThemeSafeArea theme={theme} invitation={invitation}>
        <Theme invitation={invitation} />
      </WeddingThemeSafeArea>
    </WhiteLabelFrame>
  );
}
