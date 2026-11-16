import { notFound } from "next/navigation";
import { aqiqahThemeRegistry } from "@/lib/theme";
import { getDemoAqiqahInvitation } from "@/lib/demoAqiqahInvitation";
import { getDemoBrand, type DemoThemePageProps } from "@/lib/demoBrand";
import WhiteLabelFrame from "@/components/WhiteLabelFrame";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

export default async function DemoAkikahThemePage({
  params,
  searchParams,
}: DemoThemePageProps) {
  const { theme } = await params;
  const Theme = aqiqahThemeRegistry[theme];

  if (!Theme) notFound();

  const invitation = { ...getDemoAqiqahInvitation(theme), brand: await getDemoBrand(searchParams) };

  return (
    <WhiteLabelFrame brand={invitation.brand}>
      <WeddingThemeSafeArea theme={theme} invitation={invitation}>
        <Theme invitation={invitation} />
      </WeddingThemeSafeArea>
    </WhiteLabelFrame>
  );
}
