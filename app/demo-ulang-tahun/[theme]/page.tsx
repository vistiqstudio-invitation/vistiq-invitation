import { notFound } from "next/navigation";
import { birthdayThemeRegistry } from "@/lib/theme";
import { getDemoBirthdayInvitation } from "@/lib/demoBirthdayInvitation";

export default async function DemoBirthdayThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = birthdayThemeRegistry[theme];
  if (!Theme) notFound();
  return <Theme invitation={getDemoBirthdayInvitation(theme)} />;
}
