import AdatMelayu from "@/themes/adat-melayu/AdatMelayu";
import { getDemoInvitation } from "@/lib/demoInvitation";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

export default function AdatMelayuDemoPage() {
  const invitation = getDemoInvitation("adat-melayu");
  return (
    <WeddingThemeSafeArea theme="adat-melayu" invitation={invitation}>
      <AdatMelayu invitation={invitation} />
    </WeddingThemeSafeArea>
  );
}
