import { notFound } from "next/navigation";
import { aqiqahThemeRegistry } from "@/lib/theme";
import { getDemoAqiqahInvitation } from "@/lib/demoAqiqahInvitation";

export default async function DemoAkikahThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = aqiqahThemeRegistry[theme];

  if (!Theme) notFound();

  return <Theme invitation={getDemoAqiqahInvitation(theme)} />;
}
