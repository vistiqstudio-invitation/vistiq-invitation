import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const GALLERY = [
  "/photos/luxury-art-love-paradise/couple-cover.webp",
  "/photos/luxury-art-love-paradise/hero.webp",
  "/photos/luxury-art-love-paradise/gallery-01.webp",
  "/photos/luxury-art-love-paradise/gallery-02.webp",
  "/photos/luxury-art-love-paradise/gallery-03.webp",
  "/photos/luxury-art-love-paradise/gallery-04.webp",
  "/photos/luxury-art-love-paradise/gallery-05.webp",
  "/photos/luxury-art-love-paradise/gallery-06.webp",
];

export function withAzureBloomDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "azure-bloom") return invitation;

  return {
    ...invitation,
    coverImage: "/photos/luxury-art-love-paradise/couple-cover.webp",
    musicUrl: WEDDING_VOCAL_TRACKS.indonesianBallad,
    videoUrl: null,
    opening: {
      ...invitation.opening,
      greeting: "Assalamu’alaikum Wr. Wb.",
      description:
        "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaa Allah kami akan menyelenggarakan acara pernikahan:",
      quote:
        "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
      quoteSource: "QS. Ar-Rum : 21",
    },
    bride: {
      ...invitation.bride,
      name: "Alya Nirmala",
      nickname: "Alya",
      parents: "Putri Pertama dari Bapak H. Fadli Pranata & Ibu Hj. Rina Maharani",
      instagram: "alyanirmala",
      photo: "/photos/luxury-art-love-paradise/bride.webp",
    },
    groom: {
      ...invitation.groom,
      name: "Raka Mahendra",
      nickname: "Raka",
      parents: "Putra Kedua dari Bapak H. Arief Mahendra & Ibu Sulastri",
      instagram: "rakamahendra",
      photo: "/photos/luxury-art-love-paradise/groom.webp",
    },
    events: [
      {
        name: "Akad Nikah",
        date: "Sabtu, 14 November 2026",
        rawDate: "2026-11-14T09:00:00",
        time: "09.00 WIB - Selesai",
        location: "The Azure Pavilion, Jl. Cendana No. 18, Jakarta",
      },
      {
        name: "Resepsi",
        date: "Sabtu, 14 November 2026",
        rawDate: "2026-11-14T11:00:00",
        time: "11.00 WIB - Selesai",
        location: "The Azure Pavilion, Jl. Cendana No. 18, Jakarta",
      },
    ],
    story: [
      {
        year: "2019",
        title: "Pertama Bertemu",
        description:
          "Sebuah percakapan singkat menjadi awal dari cerita yang terus kami syukuri hingga hari ini.",
      },
      {
        year: "2021",
        title: "Saling Mengenal",
        description:
          "Kami belajar tumbuh bersama, saling mendengar, dan menemukan banyak kesamaan dalam perjalanan.",
      },
      {
        year: "2025",
        title: "Hari Lamaran",
        description:
          "Dengan restu kedua keluarga, kami mantap melangkah menuju janji yang lebih panjang.",
      },
      {
        year: "2026",
        title: "Menuju Pernikahan",
        description:
          "Kini kami siap membuka babak baru sebagai pasangan dengan penuh doa dan rasa syukur.",
      },
    ],
    gallery: GALLERY,
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Raka Mahendra" }
        : account.owner === "Mempelai Wanita"
          ? { ...account, accountName: "Alya Nirmala" }
          : account,
    ),
  };
}
