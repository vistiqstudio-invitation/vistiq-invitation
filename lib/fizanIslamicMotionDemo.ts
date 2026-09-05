import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const ASSET_ROOT = "/themes/fizan-islamic-motion";

export function withFizanIslamicMotionDemoAssets(theme: string, invitation: InvitationData): InvitationData {
  if (theme !== "fizan-islamic-motion") return invitation;

  return {
    ...invitation,
    coverImage: ASSET_ROOT + "/gallery-1.jpg",
    musicUrl: WEDDING_VOCAL_TRACKS.islamicPrayer,
    videoUrl: null,
    opening: {
      ...invitation.opening,
      greeting: "Assalamu’alaikum Wr. Wb.",
      description:
        "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon ridho-Nya, kami mengundang Anda untuk hadir di hari bahagia kami.",
      quote:
        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
      quoteSource: "QS. Ar-Rum : 21",
    },
    bride: {
      ...invitation.bride,
      name: "Nabila Putri",
      nickname: "Nabila",
      parents: "Putri pertama dari Bapak Ahmad & Ibu Siti",
      instagram: "nabilaputri",
      photo: ASSET_ROOT + "/nabila-portrait.jpg",
    },
    groom: {
      ...invitation.groom,
      name: "Rizky Pratama",
      nickname: "Rizky",
      parents: "Putra pertama dari Bapak Yusuf & Ibu Fatimah",
      instagram: "rizkypratama",
      photo: ASSET_ROOT + "/rizky-portrait.jpg",
    },
    gallery: [
      ASSET_ROOT + "/gallery-1.jpg",
      ASSET_ROOT + "/gallery-2.jpg",
      ASSET_ROOT + "/gallery-3.jpg",
      ASSET_ROOT + "/gallery-4.jpg",
    ],
  };
}
