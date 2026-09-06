import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const CHRONICLE_GALLERY = [
  "/photos/modern-gallery-1.webp",
  "/photos/modern-gallery-2.webp",
  "/photos/modern-gallery-3.webp",
  "/photos/modern-gallery-4.webp",
  "/photos/modern-gallery-5.webp",
  "/photos/modern-gallery-6.webp",
];

export function withLoveChronicleDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "love-chronicle") return invitation;
  return {
    ...invitation,
    coverImage: "/photos/modern-cover.webp",
    musicUrl: WEDDING_VOCAL_TRACKS.indonesianBallad,
    groom: { ...invitation.groom, photo: "/photos/modern-groom.webp" },
    bride: { ...invitation.bride, photo: "/photos/modern-bride.webp" },
    gallery: CHRONICLE_GALLERY,
  };
}
