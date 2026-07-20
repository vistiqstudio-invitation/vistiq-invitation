import { notFound } from "next/navigation";
import { themeRegistry } from "@/lib/theme";
import { getDemoInvitation } from "@/lib/demoInvitation";
import { withPorcelainBloomDemoAssets } from "@/lib/porcelainBloomDemo";
import { withLoveChronicleDemoAssets } from "@/lib/loveChronicleDemo";
import { withVelvetCinemaDemoAssets } from "@/lib/velvetCinemaDemo";
import { withPrismaticVowsDemoAssets } from "@/lib/prismaticVowsDemo";
import { withPearlTideDemoAssets } from "@/lib/pearlTideDemo";

export default async function DemoThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = themeRegistry[theme];

  if (!Theme) notFound();

  const invitation = withPearlTideDemoAssets(theme, withPrismaticVowsDemoAssets(theme, withVelvetCinemaDemoAssets(theme, withLoveChronicleDemoAssets(theme, withPorcelainBloomDemoAssets(
    theme,
    getDemoInvitation(theme),
  )))));

  return <Theme invitation={invitation} />;
}
