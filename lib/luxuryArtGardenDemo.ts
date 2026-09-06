import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const GALLERY = [
  "/photos/floral-gallery-7.webp",
  "/photos/floral-gallery-8.webp",
  "/photos/floral-gallery-9.webp",
  "/photos/floral-gallery-10.webp",
  "/photos/floral-gallery-11.webp",
  "/photos/floral-gallery-12.webp",
];

export function withLuxuryArtGardenDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "luxury-art-garden") return invitation;

  return {
    ...invitation,
    coverImage: "/photos/floral-cover.webp",
    musicUrl: WEDDING_VOCAL_TRACKS.indonesianBallad,
    groom: {
      ...invitation.groom,
      name: "Rizki Pratama",
      nickname: "Rizki",
      instagram: "rizkipratama",
      photo: "/photos/floral-groom.webp",
    },
    bride: { ...invitation.bride, nickname: "Nabila", photo: "/photos/floral-bride.webp" },
    gallery: GALLERY,
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Rizki Pratama" }
        : account,
    ),
  };
}
