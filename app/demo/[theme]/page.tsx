import { notFound } from "next/navigation";
import { themeRegistry } from "@/lib/theme";
import { getDemoInvitation } from "@/lib/demoInvitation";
import { withPorcelainBloomDemoAssets } from "@/lib/porcelainBloomDemo";

export default async function DemoThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = themeRegistry[theme];

  if (!Theme) notFound();

  const invitation = withPorcelainBloomDemoAssets(
    theme,
    getDemoInvitation(theme),
  );

  return <Theme invitation={invitation} />;
}
