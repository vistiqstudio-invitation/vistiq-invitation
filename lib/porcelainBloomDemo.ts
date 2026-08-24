import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const PORCELAIN_GALLERY = [
  "/photos/floral-gallery-7.png",
  "/photos/floral-gallery-8.png",
  "/photos/floral-gallery-9.png",
  "/photos/floral-gallery-10.png",
  "/photos/floral-gallery-11.png",
  "/photos/floral-gallery-12.png",
];

export function withPorcelainBloomDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "porcelain-bloom") return invitation;

  return {
    ...invitation,
    coverImage: "/photos/floral-cover.png",
    musicUrl: WEDDING_VOCAL_TRACKS.indonesianBallad,
    groom: {
      ...invitation.groom,
      photo: "/photos/floral-groom.png",
    },
    bride: {
      ...invitation.bride,
      photo: "/photos/floral-bride.png",
    },
    gallery: PORCELAIN_GALLERY,
  };
}
