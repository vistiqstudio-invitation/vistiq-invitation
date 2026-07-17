import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/invitation";
import { themeRegistry, aqiqahThemeRegistry } from "@/lib/theme";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return { title: "Undangan Tidak Ditemukan | Vistiq Invitation" };
  }

  if (invitation.category === "aqiqah") {
    const title = `Aqiqah ${invitation.baby.name} | ${invitation.brand?.name ?? "Vistiq Invitation"}`;
    const description = `Undangan aqiqah ${invitation.baby.name}. Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: invitation.coverImage ? [invitation.coverImage] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: invitation.coverImage ? [invitation.coverImage] : undefined,
      },
    };
  }

  const title = `${invitation.groom.name} & ${invitation.bride.name} | ${invitation.brand?.name ?? "Wedding Invitation"}`;
  const description = `Undangan pernikahan ${invitation.groom.name} & ${invitation.bride.name}. Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: invitation.coverImage ? [invitation.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: invitation.coverImage ? [invitation.coverImage] : undefined,
    },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation || invitation.status !== "active") {
    notFound();
  }

  if (invitation.category === "aqiqah") {
    const Theme = aqiqahThemeRegistry[invitation.theme] || aqiqahThemeRegistry["akikah-nur"];
    return <Theme invitation={invitation} />;
  }

  const Theme = themeRegistry[invitation.theme] || themeRegistry["luxury-gold"];
  return <Theme invitation={invitation} />;
}
