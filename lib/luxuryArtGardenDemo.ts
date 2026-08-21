import type { InvitationData } from "@/types/invitation";

const GALLERY = [
  "/photos/floral-gallery-7.png",
  "/photos/floral-gallery-8.png",
  "/photos/floral-gallery-9.png",
  "/photos/floral-gallery-10.png",
  "/photos/floral-gallery-11.png",
  "/photos/floral-gallery-12.png",
];

export function withLuxuryArtGardenDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "luxury-art-garden") return invitation;

  return {
    ...invitation,
    coverImage: "/photos/floral-cover.png",
    musicUrl: "/music-library/acoustic-garden.mp3",
    groom: { ...invitation.groom, photo: "/photos/floral-groom.png" },
    bride: { ...invitation.bride, photo: "/photos/floral-bride.png" },
    gallery: GALLERY,
  };
}
