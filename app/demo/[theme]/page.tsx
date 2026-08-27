import { notFound } from "next/navigation";
import { themeRegistry } from "@/lib/theme";
import { getDemoInvitation } from "@/lib/demoInvitation";
import { withPorcelainBloomDemoAssets } from "@/lib/porcelainBloomDemo";
import { withLoveChronicleDemoAssets } from "@/lib/loveChronicleDemo";
import { withVelvetCinemaDemoAssets } from "@/lib/velvetCinemaDemo";
import { withPrismaticVowsDemoAssets } from "@/lib/prismaticVowsDemo";
import { withPearlTideDemoAssets } from "@/lib/pearlTideDemo";
import { withLuxuryArtGardenDemoAssets } from "@/lib/luxuryArtGardenDemo";
import { withLuxuryArtLoveParadiseDemoAssets } from "@/lib/luxuryArtLoveParadiseDemo";
import { withLuxuryArtLX005DemoAssets } from "@/lib/luxuryArtLX005Demo";
import LuxuryArtLX005 from "@/themes/luxury-art-lx005/LuxuryArtLX005";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

export default async function DemoThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = theme === "luxury-art-lx005" ? LuxuryArtLX005 : themeRegistry[theme];

  if (!Theme) notFound();

  const invitation = withLuxuryArtLX005DemoAssets(theme, withLuxuryArtLoveParadiseDemoAssets(theme, withLuxuryArtGardenDemoAssets(theme, withPearlTideDemoAssets(theme, withPrismaticVowsDemoAssets(theme, withVelvetCinemaDemoAssets(theme, withLoveChronicleDemoAssets(theme, withPorcelainBloomDemoAssets(
    theme,
    getDemoInvitation(theme),
  ))))))));

  return (
    <WeddingThemeSafeArea theme={theme}>
      <Theme invitation={invitation} />
    </WeddingThemeSafeArea>
  );
}