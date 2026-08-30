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
import { withLuxuryArtChampagneRomanceDemoAssets } from "@/lib/luxuryArtChampagneRomanceDemo";
import { withLuxuryArtSoftDemoAssets } from "@/lib/luxuryArtSoftDemo";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

export default async function DemoThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = themeRegistry[theme];

  if (!Theme) notFound();

  const invitation = withLuxuryArtSoftDemoAssets(
    theme,
    withLuxuryArtChampagneRomanceDemoAssets(
      theme,
      withLuxuryArtLoveParadiseDemoAssets(
        theme,
        withLuxuryArtGardenDemoAssets(
          theme,
          withPearlTideDemoAssets(
            theme,
            withPrismaticVowsDemoAssets(
              theme,
              withVelvetCinemaDemoAssets(
                theme,
                withLoveChronicleDemoAssets(
                  theme,
                  withPorcelainBloomDemoAssets(theme, getDemoInvitation(theme)),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );

  return (
    <WeddingThemeSafeArea theme={theme}>
      <Theme invitation={invitation} />
    </WeddingThemeSafeArea>
  );
}
