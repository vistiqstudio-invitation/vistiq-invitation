import { notFound } from "next/navigation";
import { khitanThemeRegistry } from "@/lib/theme";
import { getDemoKhitanInvitation } from "@/lib/demoKhitanInvitation";

export default async function DemoKhitanThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = khitanThemeRegistry[theme];

  if (!Theme) notFound();

  return <Theme invitation={getDemoKhitanInvitation(theme)} />;
}
