import { notFound } from "next/navigation";
import { aqiqahThemeRegistry } from "@/lib/theme";
import { getDemoAqiqahInvitation } from "@/lib/demoAqiqahInvitation";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

export default async function DemoAkikahThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = aqiqahThemeRegistry[theme];

  if (!Theme) notFound();

  const invitation = getDemoAqiqahInvitation(theme);

  return (
    <WeddingThemeSafeArea theme={theme} invitation={invitation}>
      <Theme invitation={invitation} />
    </WeddingThemeSafeArea>
  );
}
