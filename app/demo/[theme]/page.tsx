import { notFound } from "next/navigation";
import { themeRegistry } from "@/lib/theme";
import { getDemoInvitation } from "@/lib/demoInvitation";

export default async function DemoThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = themeRegistry[theme];

  if (!Theme) notFound();

  return <Theme invitation={getDemoInvitation(theme)} />;
}
