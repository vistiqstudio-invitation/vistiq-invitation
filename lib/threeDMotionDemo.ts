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

export function withThreeDMotionDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "3d-motion" && theme !== "3d-montion-1") return invitation;

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
      name: "Aurelia Maheswari Putri",
      nickname: "Aurelia",
      parents: "Putri Pertama dari Bapak H. Armand Wijaya & Ibu Hj. Melati Sari",
      instagram: "aureliamaheswari",
      photo: "/photos/luxury-art-love-paradise/bride.webp",
    },
    groom: {
      ...invitation.groom,
      name: "Damar Aditya Pranata",
      nickname: "Damar",
      parents: "Putra Kedua dari Bapak H. Pranoto & Ibu Rini Maharani",
      instagram: "damaraditya",
      photo: "/photos/luxury-art-love-paradise/groom.webp",
    },
    events: [
      {
        name: "Akad Nikah",
        date: "Sabtu, 24 Oktober 2026",
        rawDate: "2026-10-24T09:00:00",
        time: "09.00 WIB - Selesai",
        location: "The Garden Pavilion, Jl. Merdeka No. 18, Samarinda",
      },
      {
        name: "Resepsi",
        date: "Sabtu, 24 Oktober 2026",
        rawDate: "2026-10-24T11:00:00",
        time: "11.00 WIB - Selesai",
        location: "The Garden Pavilion, Jl. Merdeka No. 18, Samarinda",
      },
    ],
    story: [
      {
        year: "2019",
        title: "A Serendipitous Hello",
        description:
          "Satu pertemuan sederhana mempertemukan dua langkah yang sebelumnya berjalan sendiri-sendiri.",
      },
      {
        year: "2021",
        title: "Growing Together",
        description:
          "Kami belajar untuk saling mendengar, merayakan hal-hal kecil, dan bertumbuh dalam doa yang sama.",
      },
      {
        year: "2025",
        title: "A Promise Made",
        description:
          "Dengan restu keluarga, kami memilih untuk menulis bab baru sebagai pasangan dan sahabat seumur hidup.",
      },
      {
        year: "2026",
        title: "Our Forever Begins",
        description:
          "Hari bahagia ini menjadi awal dari perjalanan yang ingin kami jalani dengan penuh syukur.",
      },
    ],
    gallery: GALLERY,
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Damar Aditya Pranata" }
        : account.owner === "Mempelai Wanita"
          ? { ...account, accountName: "Aurelia Maheswari Putri" }
          : account,
    ),
  };
}
