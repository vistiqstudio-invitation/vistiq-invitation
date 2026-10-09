import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getInvitationBySlug } from "@/lib/invitation";
import { applyFlexibleWeddingEvents } from "@/lib/flexibleInvitationEvents";
import { themeRegistry, aqiqahThemeRegistry, khitanThemeRegistry, birthdayThemeRegistry } from "@/lib/theme";
import WhiteLabelFrame from "@/components/WhiteLabelFrame";
import SmartCoverRuntime from "@/components/SmartCoverRuntime";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

type Props = { params: Promise<{ slug: string }> };
const getCachedInvitationBySlug = cache(getInvitationBySlug);

async function requestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "www.vistiqinvitation.com";
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

function publicCoverUrl(value?: string | null) {
  const url = value?.trim();
  if (!url) return null;
  // Smart-cover positioning is stored in the URL fragment. Crawlers need the
  // original public image URL only; fragments are never sent to the server.
  return url.split("#")[0];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getCachedInvitationBySlug(slug);
  if (!invitation) return { title: "Undangan Tidak Ditemukan | Vistiq Invitation" };
  const origin = await requestOrigin();
  const canonical = `${origin}/${encodeURIComponent(slug)}`;
  // Prefer the real uploaded cover for social crawlers. This avoids making
  // WhatsApp depend on a dynamic image renderer and preserves the client's photo.
  const ogImage = publicCoverUrl(invitation.coverImage) || `${origin}/api/og/${encodeURIComponent(slug)}?v=3`;
  let title = "Undangan Digital";
  let description = "Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu.";
  if (invitation.category === "aqiqah") { title = `Aqiqah ${invitation.baby.name} | ${invitation.brand?.name ?? "Vistiq Invitation"}`; description = `Undangan aqiqah ${invitation.baby.name}. ${description}`; }
  else if (invitation.category === "khitan") { title = `Khitan ${invitation.child.name} | ${invitation.brand?.name ?? "Vistiq Invitation"}`; description = `Undangan khitan ${invitation.child.name}. ${description}`; }
  else if (invitation.category === "birthday") { title = `Ulang Tahun ${invitation.child.name} | ${invitation.brand?.name ?? "Vistiq Invitation"}`; description = `Undangan ulang tahun ke-${invitation.child.age ?? ""} ${invitation.child.name}. Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir.`; }
  else { title = `${invitation.groom.name} & ${invitation.bride.name} | ${invitation.brand?.name ?? "Wedding Invitation"}`; description = `Undangan pernikahan ${invitation.groom.name} & ${invitation.bride.name}. ${description}`; }
  return {
    metadataBase: new URL(origin), title, description,
    alternates: { canonical },
    openGraph: { type:"website", url:canonical, siteName:invitation.brand?.name ?? "Vistiq Invitation", title, description, images:[{url:ogImage,width:1200,height:630,alt:title}] },
    twitter: { card:"summary_large_image", title, description, images:[ogImage] },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;
  const baseInvitation = await getCachedInvitationBySlug(slug);
  if (!baseInvitation || baseInvitation.status !== "active") notFound();
  const invitation = baseInvitation.category === "wedding" ? await applyFlexibleWeddingEvents(baseInvitation) : baseInvitation;
  if (invitation.category === "aqiqah") { const Theme=aqiqahThemeRegistry[invitation.theme]||aqiqahThemeRegistry["akikah-nur"]; return <WhiteLabelFrame brand={invitation.brand}><WeddingThemeSafeArea theme={invitation.theme} invitation={invitation}><SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.baby.name}><Theme invitation={invitation}/></SmartCoverRuntime></WeddingThemeSafeArea></WhiteLabelFrame>; }
  if (invitation.category === "khitan") { const Theme=khitanThemeRegistry[invitation.theme]||khitanThemeRegistry["khitan-warna"]; return <WhiteLabelFrame brand={invitation.brand}><WeddingThemeSafeArea theme={invitation.theme} invitation={invitation}><SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.child.name}><Theme invitation={invitation}/></SmartCoverRuntime></WeddingThemeSafeArea></WhiteLabelFrame>; }
  if (invitation.category === "birthday") { const Theme=birthdayThemeRegistry[invitation.theme]||birthdayThemeRegistry["princess-fairytale"]; return <WhiteLabelFrame brand={invitation.brand}><WeddingThemeSafeArea theme={invitation.theme} invitation={invitation}><SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.child.name}><Theme invitation={invitation}/></SmartCoverRuntime></WeddingThemeSafeArea></WhiteLabelFrame>; }
  const resolvedTheme=invitation.theme==="luxury-art-lx005"?"luxury-art-champagne-romance":invitation.theme;
  const Theme=themeRegistry[resolvedTheme]||themeRegistry["luxury-gold"];
  const weddingInvitation={...invitation,theme:resolvedTheme};
  return <WhiteLabelFrame brand={invitation.brand}><WeddingThemeSafeArea theme={resolvedTheme} invitation={weddingInvitation}><SmartCoverRuntime coverImage={invitation.coverImage} title={`${invitation.groom.nickname||invitation.groom.name} & ${invitation.bride.nickname||invitation.bride.name}`}><Theme invitation={weddingInvitation}/></SmartCoverRuntime></WeddingThemeSafeArea></WhiteLabelFrame>;
}
