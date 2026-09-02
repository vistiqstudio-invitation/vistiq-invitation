import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const REFERENCE_COVER =
  "https://undanganqu.net/wp-content/uploads/2025/09/ai-ungu-3.jpg";
const GALLERY = [
  "https://undanganqu.net/wp-content/uploads/2025/09/ai-ungu-4.jpg",
  "https://undanganqu.net/wp-content/uploads/2025/09/ai-ungu-3.jpg",
  "https://undanganqu.net/wp-content/uploads/2025/09/ai-ungu-2.jpg",
  "https://undanganqu.net/wp-content/uploads/2025/09/ai-ungu-1.jpg",
];

export function withPremium3DMotionDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "3d-montion-2" && theme !== "premium-3d-motion") return invitation;

  return {
    ...invitation,
    coverImage: REFERENCE_COVER,
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
      name: "Kirana Larasati",
      nickname: "Kirana",
      parents: "Putri pertama dari Bapak Hadi Pranata & Ibu Sari Wulandari",
      instagram: "kiranalarasati",
      photo: GALLERY[2],
    },
    groom: {
      ...invitation.groom,
      name: "Raka Adinata",
      nickname: "Raka",
      parents: "Putra kedua dari Bapak Bima Adinata & Ibu Ratih Permata",
      instagram: "rakaadinata",
      photo: GALLERY[3],
    },
    events: [
      {
        name: "Akad Nikah",
        date: "Sabtu, 24 Oktober 2026",
        rawDate: "2026-10-24T08:00:00",
        time: "08.00 WIB - 10.00 WIB",
        location: "The Garden Hall, Jl. Merdeka No. 18, Samarinda",
      },
      {
        name: "Resepsi Pernikahan",
        date: "Sabtu, 24 Oktober 2026",
        rawDate: "2026-10-24T11:00:00",
        time: "11.00 WIB - Selesai",
        location: "The Garden Hall, Jl. Merdeka No. 18, Samarinda",
      },
    ],
    story: [
      {
        year: "2021",
        title: "Pertama Bertemu",
        description:
          "Sebuah pertemuan sederhana menjadi awal dari cerita yang tidak pernah kami duga.",
      },
      {
        year: "2022",
        title: "Mulai Mengenal",
        description:
          "Dari percakapan kecil, kami belajar saling memahami dan tumbuh dalam doa yang sama.",
      },
      {
        year: "2024",
        title: "Hari Lamaran",
        description:
          "Dengan restu keluarga, kami memilih untuk melangkah lebih jauh bersama.",
      },
      {
        year: "2026",
        title: "Janji Selamanya",
        description:
          "Hari bahagia ini menjadi awal perjalanan baru sebagai pasangan dan sahabat seumur hidup.",
      },
    ],
    gallery: GALLERY,
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Raka Adinata" }
        : account.owner === "Mempelai Wanita"
          ? { ...account, accountName: "Kirana Larasati" }
          : account,
    ),
  };
}
