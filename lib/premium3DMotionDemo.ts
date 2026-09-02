import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const ASSET_ROOT = "/themes/premium-3d-motion-2";
const DEMO_COVER = ASSET_ROOT + "/naya-farhan-cover.jpg";
const GALLERY = [
  ASSET_ROOT + "/naya-farhan-gallery-courtyard.jpg",
  ASSET_ROOT + "/naya-farhan-gallery-conservatory.jpg",
  ASSET_ROOT + "/naya-farhan-gallery-staircase.jpg",
  ASSET_ROOT + "/naya-farhan-gallery-flower-studio.jpg",
];

export function withPremium3DMotionDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "3d-montion-2" && theme !== "premium-3d-motion") return invitation;

  return {
    ...invitation,
    coverImage: DEMO_COVER,
    musicUrl: WEDDING_VOCAL_TRACKS.englishBallad,
    videoUrl: null,
    opening: {
      ...invitation.opening,
      greeting: "Assalamu’alaikum Wr. Wb.",
      description:
        "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami:",
      quote:
        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
      quoteSource: "QS. Ar-Rum : 21",
    },
    bride: {
      ...invitation.bride,
      name: "Nayla Azzahra",
      nickname: "Nayla",
      parents: "Putri pertama dari Bapak Arman Wijaya & Ibu Lestari Handayani",
      instagram: "naylaazzahra",
      photo: ASSET_ROOT + "/naya-farhan-bride.jpg",
    },
    groom: {
      ...invitation.groom,
      name: "Farhan Mahesa",
      nickname: "Farhan",
      parents: "Putra kedua dari Bapak Rudi Mahesa & Ibu Sinta Permata",
      instagram: "farhanmahesa",
      photo: ASSET_ROOT + "/naya-farhan-groom.jpg",
    },
    events: [
      {
        name: "Akad Nikah",
        date: "Minggu, 15 November 2026",
        rawDate: "2026-11-15T08:00:00",
        time: "08.00 WIB - 10.00 WIB",
        location: "Pendopo Puspa Arum, Jl. Kenanga No. 27, Bandung",
      },
      {
        name: "Resepsi Pernikahan",
        date: "Sabtu, 24 Oktober 2026",
        rawDate: "2026-11-15T11:30:00",
        time: "11.30 WIB - Selesai",
        location: "Pendopo Puspa Arum, Jl. Kenanga No. 27, Bandung",
      },
    ],
    story: [
      {
        year: "2020",
        title: "Pertama Berjumpa",
        description:
          "Sebuah pertemuan sederhana di sebuah acara keluarga menjadi awal dari cerita yang terus kami syukuri.",
      },
      {
        year: "2022",
        title: "Tumbuh Bersama",
        description:
          "Dari percakapan kecil, kami belajar saling memahami dan mulai menyusun mimpi yang sama.",
      },
      {
        year: "2025",
        title: "Hari Lamaran",
        description:
          "Dengan restu keluarga, kami mengikat niat untuk melangkah lebih jauh bersama.",
      },
      {
        year: "2026",
        title: "Hari Pernikahan",
        description:
          "Dengan doa keluarga, kami memulai perjalanan baru sebagai pasangan dan sahabat seumur hidup.",
      },
    ],
    gallery: GALLERY,
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? {
            ...account,
            bankName: "BRI",
            accountNumber: "861203457788",
            accountName: "Farhan Mahesa",
          }
        : account.owner === "Mempelai Wanita"
          ? {
              ...account,
              bankName: "BCA",
              accountNumber: "19204578631",
              accountName: "Nayla Azzahra",
            }
          : account,
    ),
  };
}
