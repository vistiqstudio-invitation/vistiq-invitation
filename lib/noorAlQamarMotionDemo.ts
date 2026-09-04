import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const THEME = "noor-al-qamar-motion";
const GALLERY = [
  "/photos/green-gallery-1.png",
  "/photos/green-gallery-2.png",
  "/photos/green-gallery-3.png",
  "/photos/green-gallery-4.png",
  "/photos/green-gallery-5.png",
  "/photos/green-gallery-6.png",
];

export function withNoorAlQamarMotionDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== THEME) return invitation;

  return {
    ...invitation,
    coverImage: "/photos/green-gallery-2.png",
    musicUrl: WEDDING_VOCAL_TRACKS.islamicPrayer,
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
      name: "Alya Humaira",
      nickname: "Alya",
      parents: "Putri pertama dari Bapak H. Fajar Ramadhan & Ibu Hj. Nur Aini",
      photo: "/photos/green-bride.png",
      instagram: "alyahumaira",
    },
    groom: {
      ...invitation.groom,
      name: "Zaid Alfarizi",
      nickname: "Zaid",
      parents: "Putra kedua dari Bapak H. Salman & Ibu Hj. Maryam",
      photo: "/photos/green-groom.png",
      instagram: "zaidalfarizi",
    },
    events: [
      {
        name: "Akad Nikah",
        date: "Ahad, 18 Oktober 2026",
        rawDate: "2026-10-18T08:00:00",
        time: "08.00 WIB - Selesai",
        location: "Masjid Al-Hikmah, Jl. Cendana No. 8, Bandung",
      },
      {
        name: "Resepsi Pernikahan",
        date: "Ahad, 18 Oktober 2026",
        rawDate: "2026-10-18T11:00:00",
        time: "11.00 WIB - Selesai",
        location: "The Noor Garden, Jl. Cendana No. 8, Bandung",
      },
    ],
    story: [
      {
        year: "2021",
        title: "Pertama Berjumpa",
        description:
          "Sebuah pertemuan sederhana mempertemukan dua hati yang sama-sama belajar menjaga niat dalam doa.",
      },
      {
        year: "2023",
        title: "Memantapkan Niat",
        description:
          "Dengan restu keluarga, kami memilih untuk saling mengenal lebih dekat dan melangkah dalam kebaikan.",
      },
      {
        year: "2026",
        title: "Janji Suci",
        description:
          "Insyaa Allah, kami akan memulai perjalanan baru sebagai pasangan dalam naungan ridho Allah SWT.",
      },
    ],
    gallery: GALLERY,
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Zaid Alfarizi" }
        : account.owner === "Mempelai Wanita"
          ? { ...account, accountName: "Alya Humaira" }
          : account,
    ),
  };
}
