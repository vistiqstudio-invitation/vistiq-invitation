import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const CINEMA_GALLERY = [
  "/photos/deco-gallery-1.png",
  "/photos/deco-gallery-2.png",
  "/photos/deco-gallery-3.png",
  "/photos/deco-gallery-4.png",
  "/photos/deco-gallery-5.png",
  "/photos/deco-gallery-6.png",
];

export function withVelvetCinemaDemoAssets(theme:string,invitation:InvitationData):InvitationData {
  if(theme!=="velvet-cinema") return invitation;
  return {...invitation,coverImage:"/photos/deco-cover.png",musicUrl:WEDDING_VOCAL_TRACKS.englishBallad,groom:{...invitation.groom,photo:"/photos/deco-groom.png"},bride:{...invitation.bride,photo:"/photos/deco-bride.png"},gallery:CINEMA_GALLERY};
}
