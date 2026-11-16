import { notFound } from "next/navigation";
import { khitanThemeRegistry } from "@/lib/theme";
import { getDemoKhitanInvitation } from "@/lib/demoKhitanInvitation";
import { getDemoBrand, type DemoThemePageProps } from "@/lib/demoBrand";
import WhiteLabelFrame from "@/components/WhiteLabelFrame";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

export default async function DemoKhitanThemePage({
  params,
  searchParams,
}: DemoThemePageProps) {
  const { theme } = await params;
  const Theme = khitanThemeRegistry[theme];

  if (!Theme) notFound();

  const invitation = { ...getDemoKhitanInvitation(theme), brand: await getDemoBrand(searchParams) };

  return (
    <WhiteLabelFrame brand={invitation.brand}>
      <WeddingThemeSafeArea theme={theme} invitation={invitation}>
        <Theme invitation={invitation} />
      </WeddingThemeSafeArea>
    </WhiteLabelFrame>
  );
}
