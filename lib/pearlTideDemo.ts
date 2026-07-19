import type { InvitationData } from "@/types/invitation";

const PEARL_GALLERY = [
  "/photos/white-gallery-1.jpg",
  "/photos/white-gallery-2.jpg",
  "/photos/white-gallery-3.jpg",
  "/photos/white-gallery-4.jpg",
  "/photos/white-gallery-5.jpg",
  "/photos/white-gallery-6.jpg",
];

export function withPearlTideDemoAssets(theme:string,invitation:InvitationData):InvitationData {
  if(theme!=="pearl-tide") return invitation;
  return {...invitation,coverImage:"/photos/white-cover.png",musicUrl:"/music/santorini.mp3",groom:{...invitation.groom,photo:"/photos/white-groom.png"},bride:{...invitation.bride,photo:"/photos/white-bride.png"},gallery:PEARL_GALLERY};
}
