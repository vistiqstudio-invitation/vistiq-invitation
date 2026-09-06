import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const PORCELAIN_GALLERY = [
  "/photos/floral-gallery-7.webp",
  "/photos/floral-gallery-8.webp",
  "/photos/floral-gallery-9.webp",
  "/photos/floral-gallery-10.webp",
  "/photos/floral-gallery-11.webp",
  "/photos/floral-gallery-12.webp",
];

export function withPorcelainBloomDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "porcelain-bloom") return invitation;

  return {
    ...invitation,
    coverImage: "/photos/floral-cover.webp",
    musicUrl: WEDDING_VOCAL_TRACKS.indonesianBallad,
    groom: {
      ...invitation.groom,
      photo: "/photos/floral-groom.webp",
    },
    bride: {
      ...invitation.bride,
      photo: "/photos/floral-bride.webp",
    },
    gallery: PORCELAIN_GALLERY,
  };
}
