import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getInvitationBySlug } from "@/lib/invitation";
import { applyFlexibleWeddingEvents } from "@/lib/flexibleInvitationEvents";
import {
  themeRegistry,
  aqiqahThemeRegistry,
  khitanThemeRegistry,
  birthdayThemeRegistry,
} from "@/lib/theme";
import WhiteLabelFrame from "@/components/WhiteLabelFrame";
import SmartCoverRuntime from "@/components/SmartCoverRuntime";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

type Props = { params: Promise<{ slug: string }> };

// generateMetadata and the page render need the same invitation. React cache
// keeps that lookup request-scoped, so edits remain fresh between requests
// while duplicate Supabase/RPC work inside one render is avoided.
const getCachedInvitationBySlug = cache(getInvitationBySlug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getCachedInvitationBySlug(slug);
  if (!invitation) return { title: "Undangan Tidak Ditemukan | Vistiq Invitation" };
  const ogImage = [`/api/og/${slug}`];

  if (invitation.category === "aqiqah") {
    const title = `Aqiqah ${invitation.baby.name} | ${invitation.brand?.name ?? "Vistiq Invitation"}`;
    const description = `Undangan aqiqah ${invitation.baby.name}. Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu.`;
    return { title, description, openGraph: { title, description, images: ogImage }, twitter: { card: "summary_large_image", title, description, images: ogImage } };
  }
  if (invitation.category === "khitan") {
    const title = `Khitan ${invitation.child.name} | ${invitation.brand?.name ?? "Vistiq Invitation"}`;
    const description = `Undangan khitan ${invitation.child.name}. Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu.`;
    return { title, description, openGraph: { title, description, images: ogImage }, twitter: { card: "summary_large_image", title, description, images: ogImage } };
  }
  if (invitation.category === "birthday") {
    const title = `Ulang Tahun ${invitation.child.name} | ${invitation.brand?.name ?? "Vistiq Invitation"}`;
    const description = `Undangan ulang tahun ke-${invitation.child.age ?? ""} ${invitation.child.name}. Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir.`;
    return { title, description, openGraph: { title, description, images: ogImage }, twitter: { card: "summary_large_image", title, description, images: ogImage } };
  }
  const title = `${invitation.groom.name} & ${invitation.bride.name} | ${invitation.brand?.name ?? "Wedding Invitation"}`;
  const description = `Undangan pernikahan ${invitation.groom.name} & ${invitation.bride.name}. Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu.`;
  return { title, description, openGraph: { title, description, images: ogImage }, twitter: { card: "summary_large_image", title, description, images: ogImage } };
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;
  const baseInvitation = await getCachedInvitationBySlug(slug);
  if (!baseInvitation || baseInvitation.status !== "active") notFound();

  const invitation =
    baseInvitation.category === "wedding"
      ? await applyFlexibleWeddingEvents(baseInvitation)
      : baseInvitation;

  if (invitation.category === "aqiqah") {
    const Theme = aqiqahThemeRegistry[invitation.theme] || aqiqahThemeRegistry["akikah-nur"];
    return <WhiteLabelFrame brand={invitation.brand}><WeddingThemeSafeArea theme={invitation.theme} invitation={invitation}><SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.baby.name}><Theme invitation={invitation} /></SmartCoverRuntime></WeddingThemeSafeArea></WhiteLabelFrame>;
  }
  if (invitation.category === "khitan") {
    const Theme = khitanThemeRegistry[invitation.theme] || khitanThemeRegistry["khitan-warna"];
    return <WhiteLabelFrame brand={invitation.brand}><WeddingThemeSafeArea theme={invitation.theme} invitation={invitation}><SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.child.name}><Theme invitation={invitation} /></SmartCoverRuntime></WeddingThemeSafeArea></WhiteLabelFrame>;
  }
  if (invitation.category === "birthday") {
    const Theme = birthdayThemeRegistry[invitation.theme] || birthdayThemeRegistry["princess-fairytale"];
    return <WhiteLabelFrame brand={invitation.brand}><WeddingThemeSafeArea theme={invitation.theme} invitation={invitation}><SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.child.name}><Theme invitation={invitation} /></SmartCoverRuntime></WeddingThemeSafeArea></WhiteLabelFrame>;
  }

  const resolvedTheme = invitation.theme === "luxury-art-lx005" ? "luxury-art-champagne-romance" : invitation.theme;
  const Theme = themeRegistry[resolvedTheme] || themeRegistry["luxury-gold"];
  const weddingInvitation = { ...invitation, theme: resolvedTheme };

  return (
    <WhiteLabelFrame brand={invitation.brand}>
      <WeddingThemeSafeArea theme={resolvedTheme} invitation={weddingInvitation}>
        <SmartCoverRuntime coverImage={invitation.coverImage} title={`${invitation.groom.nickname || invitation.groom.name} & ${invitation.bride.nickname || invitation.bride.name}`}>
          <Theme invitation={weddingInvitation} />
        </SmartCoverRuntime>
      </WeddingThemeSafeArea>
    </WhiteLabelFrame>
  );
}
