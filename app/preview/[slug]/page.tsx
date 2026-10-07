import { notFound } from "next/navigation";
import { requireRole } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { getInvitationBySlug } from "@/lib/invitation";
import { applyFlexibleWeddingEvents } from "@/lib/flexibleInvitationEvents";
import {
  themeRegistry,
  aqiqahThemeRegistry,
  khitanThemeRegistry,
  birthdayThemeRegistry,
} from "@/lib/theme";
import SmartCoverRuntime from "@/components/SmartCoverRuntime";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PreviewPage({ params }: Props) {
  const { slug } = await params;
  const profile = await requireRole(["owner", "reseller"]);

  const supabase = await createClient();
  const { data: invitationRow } = await supabase
    .from("invitations")
    .select("client_id")
    .eq("slug", slug)
    .single();

  if (!invitationRow) notFound();

  if (invitationRow.client_id) {
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("id", invitationRow.client_id)
      .single();

    if (!client) notFound();
  } else if (profile.role !== "owner") {
    notFound();
  }

  const baseInvitation = await getInvitationBySlug(slug);
  if (!baseInvitation) notFound();

  const invitation =
    baseInvitation.category === "wedding"
      ? await applyFlexibleWeddingEvents(baseInvitation)
      : baseInvitation;

  if (invitation.category === "aqiqah") {
    const Theme = aqiqahThemeRegistry[invitation.theme] || aqiqahThemeRegistry["akikah-nur"];
    return (
      <WeddingThemeSafeArea theme={invitation.theme} invitation={invitation}>
        <SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.baby.name}>
          <Theme invitation={invitation} />
        </SmartCoverRuntime>
      </WeddingThemeSafeArea>
    );
  }

  if (invitation.category === "khitan") {
    const Theme = khitanThemeRegistry[invitation.theme] || khitanThemeRegistry["khitan-warna"];
    return (
      <WeddingThemeSafeArea theme={invitation.theme} invitation={invitation}>
        <SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.child.name}>
          <Theme invitation={invitation} />
        </SmartCoverRuntime>
      </WeddingThemeSafeArea>
    );
  }

  if (invitation.category === "birthday") {
    const Theme = birthdayThemeRegistry[invitation.theme] || birthdayThemeRegistry["princess-fairytale"];
    return (
      <WeddingThemeSafeArea theme={invitation.theme} invitation={invitation}>
        <SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.child.name}>
          <Theme invitation={invitation} />
        </SmartCoverRuntime>
      </WeddingThemeSafeArea>
    );
  }

  const resolvedTheme = invitation.theme === "luxury-art-lx005" ? "luxury-art-champagne-romance" : invitation.theme;
  const Theme = themeRegistry[resolvedTheme] || themeRegistry["luxury-gold"];
  const weddingInvitation = { ...invitation, theme: resolvedTheme };

  return (
    <WeddingThemeSafeArea theme={resolvedTheme} invitation={weddingInvitation}>
      <SmartCoverRuntime
        coverImage={invitation.coverImage}
        title={`${invitation.groom.nickname || invitation.groom.name} & ${
          invitation.bride.nickname || invitation.bride.name
        }`}
      >
        <Theme invitation={weddingInvitation} />
      </SmartCoverRuntime>
    </WeddingThemeSafeArea>
  );
}
