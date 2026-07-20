import type { InvitationData } from "@/types/invitation";

const PRISMATIC_GALLERY = [
  "/photos/pastel-gallery-1.png",
  "/photos/pastel-gallery-2.png",
  "/photos/pastel-gallery-3.png",
  "/photos/pastel-gallery-4.png",
  "/photos/pastel-gallery-5.png",
  "/photos/pastel-gallery-6.png",
];

export function withPrismaticVowsDemoAssets(theme:string,invitation:InvitationData):InvitationData {
  if(theme!=="prismatic-vows") return invitation;
  return {...invitation,coverImage:"/photos/pastel-cover.png",musicUrl:"/music/pastel-studio.mp3",groom:{...invitation.groom,photo:"/photos/pastel-groom.png"},bride:{...invitation.bride,photo:"/photos/pastel-bride.png"},gallery:PRISMATIC_GALLERY};
}
