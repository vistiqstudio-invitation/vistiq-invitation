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
import { withThreeDMotionDemoAssets } from "@/lib/threeDMotionDemo";
import { withPremium3DMotionDemoAssets } from "@/lib/premium3DMotionDemo";
import { withFizanIslamicMotionDemoAssets } from "@/lib/fizanIslamicMotionDemo";
import { withAzureBloomDemoAssets } from "@/lib/azureBloomDemo";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

export default async function DemoThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const Theme = themeRegistry[theme];

  if (!Theme) notFound();

  let invitation = getDemoInvitation(theme);
  invitation = withPorcelainBloomDemoAssets(theme, invitation);
  invitation = withLoveChronicleDemoAssets(theme, invitation);
  invitation = withVelvetCinemaDemoAssets(theme, invitation);
  invitation = withPrismaticVowsDemoAssets(theme, invitation);
  invitation = withPearlTideDemoAssets(theme, invitation);
  invitation = withLuxuryArtGardenDemoAssets(theme, invitation);
  invitation = withLuxuryArtLoveParadiseDemoAssets(theme, invitation);
  invitation = withLuxuryArtChampagneRomanceDemoAssets(theme, invitation);
  invitation = withLuxuryArtSoftDemoAssets(theme, invitation);
  invitation = withThreeDMotionDemoAssets(theme, invitation);
  invitation = withPremium3DMotionDemoAssets(theme, invitation);
  invitation = withFizanIslamicMotionDemoAssets(theme, invitation);
  invitation = withAzureBloomDemoAssets(theme, invitation);

  return (
    <WeddingThemeSafeArea theme={theme} invitation={invitation}>
      <Theme invitation={invitation} />
    </WeddingThemeSafeArea>
  );
}
