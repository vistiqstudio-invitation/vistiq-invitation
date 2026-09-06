import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const PRISMATIC_GALLERY = [
  "/photos/pastel-gallery-1.webp",
  "/photos/pastel-gallery-2.webp",
  "/photos/pastel-gallery-3.webp",
  "/photos/pastel-gallery-4.webp",
  "/photos/pastel-gallery-5.webp",
  "/photos/pastel-gallery-6.webp",
];

export function withPrismaticVowsDemoAssets(theme:string,invitation:InvitationData):InvitationData {
  if(theme!=="prismatic-vows") return invitation;
  return {...invitation,coverImage:"/photos/pastel-cover.webp",musicUrl:WEDDING_VOCAL_TRACKS.englishBallad,groom:{...invitation.groom,photo:"/photos/pastel-groom.webp"},bride:{...invitation.bride,photo:"/photos/pastel-bride.webp"},gallery:PRISMATIC_GALLERY};
}
