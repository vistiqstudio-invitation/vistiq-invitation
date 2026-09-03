import { notFound } from "next/navigation";
import { khitanThemeRegistry } from "@/lib/theme";
import { getDemoKhitanInvitation } from "@/lib/demoKhitanInvitation";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

export default async function DemoKhitanThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = khitanThemeRegistry[theme];

  if (!Theme) notFound();

  const invitation = getDemoKhitanInvitation(theme);

  return (
    <WeddingThemeSafeArea theme={theme} invitation={invitation}>
      <Theme invitation={invitation} />
    </WeddingThemeSafeArea>
  );
}
