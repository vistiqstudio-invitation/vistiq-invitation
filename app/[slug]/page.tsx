import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/invitation";
import {
  themeRegistry,
  aqiqahThemeRegistry,
  khitanThemeRegistry,
  birthdayThemeRegistry,
} from "@/lib/theme";
import WhiteLabelFrame from "@/components/WhiteLabelFrame";
import SmartCoverRuntime from "@/components/SmartCoverRuntime";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return { title: "Undangan Tidak Ditemukan | Vistiq Invitation" };
  }

  // The /api/og route always returns an image - the invitation's cover
  // photo when one is set, otherwise a branded fallback card - so every
  // invitation link has a share preview.
  const ogImage = [`/api/og/${slug}`];

  if (invitation.category === "aqiqah") {
    const title = `Aqiqah ${invitation.baby.name} | ${invitation.brand?.name ?? "Vistiq Invitation"}`;
    const description = `Undangan aqiqah ${invitation.baby.name}. Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage,
      },
    };
  }

  if (invitation.category === "khitan") {
    const title = `Khitan ${invitation.child.name} | ${invitation.brand?.name ?? "Vistiq Invitation"}`;
    const description = `Undangan khitan ${invitation.child.name}. Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage,
      },
    };
  }

  if (invitation.category === "birthday") {
    const title = `Ulang Tahun ${invitation.child.name} | ${invitation.brand?.name ?? "Vistiq Invitation"}`;
    const description = `Undangan ulang tahun ke-${invitation.child.age ?? ""} ${invitation.child.name}. Kami mengundang Bapak/Ibu/Saudara/i untuk turut hadir.`;
    return {
      title,
      description,
      openGraph: { title, description, images: ogImage },
      twitter: { card: "summary_large_image", title, description, images: ogImage },
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
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage,
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
    return (
      <WhiteLabelFrame brand={invitation.brand}>
        <SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.baby.name}>
          <Theme invitation={invitation} />
        </SmartCoverRuntime>
      </WhiteLabelFrame>
    );
  }

  if (invitation.category === "khitan") {
    const Theme = khitanThemeRegistry[invitation.theme] || khitanThemeRegistry["khitan-warna"];
    return (
      <WhiteLabelFrame brand={invitation.brand}>
        <SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.child.name}>
          <Theme invitation={invitation} />
        </SmartCoverRuntime>
      </WhiteLabelFrame>
    );
  }

  if (invitation.category === "birthday") {
    const Theme =
      birthdayThemeRegistry[invitation.theme] ||
      birthdayThemeRegistry["princess-fairytale"];
    return (
      <WhiteLabelFrame brand={invitation.brand}>
        <SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.child.name}>
          <Theme invitation={invitation} />
        </SmartCoverRuntime>
      </WhiteLabelFrame>
    );
  }

  const Theme = themeRegistry[invitation.theme] || themeRegistry["luxury-gold"];
  return (
    <WhiteLabelFrame brand={invitation.brand}>
      <SmartCoverRuntime
        coverImage={invitation.coverImage}
        title={`${invitation.groom.name} & ${invitation.bride.name}`}
      >
        <Theme invitation={invitation} />
      </SmartCoverRuntime>
    </WhiteLabelFrame>
  );
}
