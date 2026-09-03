import { notFound } from "next/navigation";
import { birthdayThemeRegistry } from "@/lib/theme";
import { getDemoBirthdayInvitation } from "@/lib/demoBirthdayInvitation";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

export default async function DemoBirthdayThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = birthdayThemeRegistry[theme];
  if (!Theme) notFound();

  const invitation = getDemoBirthdayInvitation(theme);

  return (
    <WeddingThemeSafeArea theme={theme} invitation={invitation}>
      <Theme invitation={invitation} />
    </WeddingThemeSafeArea>
  );
}
