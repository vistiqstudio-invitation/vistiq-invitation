import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const GALLERY = [
  "/photos/luxury-art-love-paradise/gallery-01.webp",
  "/photos/luxury-art-love-paradise/gallery-02.webp",
  "/photos/luxury-art-love-paradise/gallery-03.webp",
  "/photos/luxury-art-love-paradise/gallery-04.webp",
  "/photos/luxury-art-love-paradise/gallery-05.webp",
  "/photos/luxury-art-love-paradise/gallery-06.webp",
];

export function withLuxuryArtLoveParadiseDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "luxury-art-love-paradise") return invitation;

  return {
    ...invitation,
    coverImage: "/photos/luxury-art-love-paradise/couple-cover.webp",
    musicUrl: WEDDING_VOCAL_TRACKS.indonesianBallad,
    bride: {
      ...invitation.bride,
      name: "Nabila Putri",
      nickname: "Nabila",
      instagram: "nabilaputri",
      photo: "/photos/luxury-art-love-paradise/bride.webp",
    },
    groom: {
      ...invitation.groom,
      name: "Rizky Pratama",
      nickname: "Rizky",
      instagram: "rizkypratama",
      photo: "/photos/luxury-art-love-paradise/groom.webp",
    },
    gallery: GALLERY,
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Rizky Pratama" }
        : account,
    ),
  };
}
