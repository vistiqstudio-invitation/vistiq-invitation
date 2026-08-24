import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const CHRONICLE_GALLERY = [
  "/photos/modern-gallery-1.png",
  "/photos/modern-gallery-2.png",
  "/photos/modern-gallery-3.png",
  "/photos/modern-gallery-4.png",
  "/photos/modern-gallery-5.png",
  "/photos/modern-gallery-6.png",
];

export function withLoveChronicleDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "love-chronicle") return invitation;
  return {
    ...invitation,
    coverImage: "/photos/modern-cover.png",
    musicUrl: WEDDING_VOCAL_TRACKS.indonesianBallad,
    groom: { ...invitation.groom, photo: "/photos/modern-groom.png" },
    bride: { ...invitation.bride, photo: "/photos/modern-bride.png" },
    gallery: CHRONICLE_GALLERY,
  };
}
