import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const CINEMA_GALLERY = [
  "/photos/deco-gallery-1.webp",
  "/photos/deco-gallery-2.webp",
  "/photos/deco-gallery-3.webp",
  "/photos/deco-gallery-4.webp",
  "/photos/deco-gallery-5.webp",
  "/photos/deco-gallery-6.webp",
];

export function withVelvetCinemaDemoAssets(theme:string,invitation:InvitationData):InvitationData {
  if(theme!=="velvet-cinema") return invitation;
  return {...invitation,coverImage:"/photos/deco-cover.webp",musicUrl:WEDDING_VOCAL_TRACKS.englishBallad,groom:{...invitation.groom,photo:"/photos/deco-groom.webp"},bride:{...invitation.bride,photo:"/photos/deco-bride.webp"},gallery:CINEMA_GALLERY};
}
