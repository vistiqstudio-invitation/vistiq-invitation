import type { InvitationData } from "@/types/invitation";

const GALLERY = [
  "/photos/luxury-gallery-1.png",
  "/photos/luxury-gallery-2.png",
  "/photos/luxury-gallery-3.png",
  "/photos/luxury-gallery-4.png",
  "/photos/luxury-gallery-5.png",
  "/photos/luxury-gallery-6.png",
];

export function withLuxuryArtGardenDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "luxury-art-garden") return invitation;

  return {
    ...invitation,
    coverImage: "/photos/luxury-cover.png",
    musicUrl: "/music-library/elegant-waltz.mp3",
    groom: { ...invitation.groom, photo: "/photos/luxury-groom.png" },
    bride: { ...invitation.bride, photo: "/photos/luxury-bride.png" },
    gallery: GALLERY,
  };
}
