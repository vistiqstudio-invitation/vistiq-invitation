import { invitationCopy } from "@/lib/invitationCopy";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getInvitationBySlug } from "@/lib/invitation";
import { applyFlexibleWeddingEvents } from "@/lib/flexibleInvitationEvents";
import { themeRegistry, aqiqahThemeRegistry, khitanThemeRegistry, birthdayThemeRegistry } from "@/lib/theme";
import WhiteLabelFrame from "@/components/WhiteLabelFrame";
import SmartCoverRuntime from "@/components/SmartCoverRuntime";
import VistiqInvitationFooter from "@/components/VistiqInvitationFooter";
import WeddingThemeSafeArea from "@/components/WeddingThemeSafeArea";

type Props = { params: Promise<{ slug: string }> };
const getCachedInvitationBySlug = cache(getInvitationBySlug);
const PRIMARY_ORIGIN = "https://www.vistiqinvitation.com";

async function requestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "www.vistiqinvitation.com";
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getCachedInvitationBySlug(slug);
  if (!invitation) return { title: "Undangan Tidak Ditemukan | Vistiq Invitation" };
  const origin = await requestOrigin();
  const canonical = `${origin}/${encodeURIComponent(slug)}`;
  // Use the invitation's actual cover photograph for social previews.
  // The shared OG renderer remains the fallback for invitations without a cover.
  // URL of each uploaded cover is unique, so replacing the cover also changes
  // the OG image address without requiring a fixed per-invitation version.
  const cover = invitation.coverImage?.trim() || "";
  const publicCover = /^https:\/\//i.test(cover)
    ? cover
    : cover.startsWith("/") && !cover.startsWith("//")
      ? `${PRIMARY_ORIGIN}${cover}`
      : null;
  const ogImage = publicCover || `${PRIMARY_ORIGIN}/api/og/${encodeURIComponent(slug)}?v=8`;
  const coverPath = publicCover?.split(/[?#]/, 1)[0].toLowerCase() || "";
  const ogImageType = !publicCover ? "image/png"
    : /\.png$/.test(coverPath) ? "image/png"
    : /\.jpe?g$/.test(coverPath) ? "image/jpeg"
    : /\.webp$/.test(coverPath) ? "image/webp"
    : undefined;
  const category = invitation.category;
  const copy = invitationCopy[category];
  const name = category === "wedding"
    ? [invitation.groom.name, invitation.bride.name].filter(Boolean).join(" & ")
    : category === "aqiqah" ? invitation.baby.name : invitation.child.name;
  const brand = invitation.brand?.name ?? "Vistiq Invitation";
  const occasion = category === "birthday" && invitation.child.age
    ? `ulang tahun ke-${invitation.child.age}`
    : copy.label.toLowerCase();
  const title = `${category === "wedding" ? name || copy.label : [copy.label, name].filter(Boolean).join(" ")} | ${brand}`;
  const description = `Undangan ${[occasion, name].filter(Boolean).join(" ")}. ${category === "birthday" ? "Mari ikut merayakan hari spesial ini." : copy.openingDescription}`;
  return {
    metadataBase: new URL(origin), title, description,
    alternates: { canonical },
    openGraph: { type:"website", url:canonical, siteName:invitation.brand?.name ?? "Vistiq Invitation", title, description, images:[{url:ogImage,secureUrl:ogImage,width:1200,height:630,alt:title,type:ogImageType}] },
    twitter: { card:"summary_large_image", title, description, images:[ogImage] },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;
  const baseInvitation = await getCachedInvitationBySlug(slug);
  if (!baseInvitation || baseInvitation.status !== "active") notFound();

  const footer = baseInvitation.isDirectAdminInvitation && !(await headers()).has("x-vistiq-reseller-id")
    ? <VistiqInvitationFooter />
    : null;

  function renderFrame(
    invitation: NonNullable<Awaited<ReturnType<typeof getInvitationBySlug>>>,
    title: string,
    content: ReactNode
  ) {
    return (
      <WhiteLabelFrame brand={invitation.brand}>
        <WeddingThemeSafeArea theme={invitation.theme} invitation={invitation}>
          <SmartCoverRuntime coverImage={invitation.coverImage} title={title}>
            {content}
          </SmartCoverRuntime>
          {footer}
        </WeddingThemeSafeArea>
      </WhiteLabelFrame>
    );
  }

  if (baseInvitation.category === "aqiqah") {
    const Theme = aqiqahThemeRegistry[baseInvitation.theme] || aqiqahThemeRegistry["akikah-nur"];
    return renderFrame(baseInvitation, baseInvitation.baby.name, <Theme invitation={baseInvitation} />);
  }

  if (baseInvitation.category === "khitan") {
    const Theme = khitanThemeRegistry[baseInvitation.theme] || khitanThemeRegistry["khitan-warna"];
    return renderFrame(baseInvitation, baseInvitation.child.name, <Theme invitation={baseInvitation} />);
  }

  if (baseInvitation.category === "birthday") {
    const Theme = birthdayThemeRegistry[baseInvitation.theme] || birthdayThemeRegistry["princess-fairytale"];
    return renderFrame(baseInvitation, baseInvitation.child.name, <Theme invitation={baseInvitation} />);
  }

  const invitation = await applyFlexibleWeddingEvents(baseInvitation);
  const theme = invitation.theme === "luxury-art-lx005" ? "luxury-art-champagne-romance" : invitation.theme;
  const Theme = themeRegistry[theme] || themeRegistry["luxury-gold"];
  const weddingInvitation = { ...baseInvitation, ...invitation, theme };
  const title = `${invitation.groom.nickname || invitation.groom.name} & ${invitation.bride.nickname || invitation.bride.name}`;
  return renderFrame(weddingInvitation, title, <Theme invitation={weddingInvitation} />);
}
