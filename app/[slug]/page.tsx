import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/invitation";
import { themeRegistry } from "@/lib/theme";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return { title: "Undangan Tidak Ditemukan | Vistiq Invitation" };
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

  if (!invitation || invitation.status === "inactive") {
    notFound();
  }

  const Theme = themeRegistry[invitation.theme] || themeRegistry["luxury-gold"];

  return <Theme invitation={invitation} />;
}
