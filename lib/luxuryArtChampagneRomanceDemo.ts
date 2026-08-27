import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const GALLERY = [
  "/photos/luxury-art-love-paradise/couple-cover.webp",
  "/photos/luxury-art-love-paradise/gallery-01.webp",
  "/photos/luxury-art-love-paradise/gallery-02.webp",
  "/photos/luxury-art-love-paradise/gallery-03.webp",
  "/photos/luxury-art-love-paradise/gallery-04.webp",
  "/photos/luxury-art-love-paradise/gallery-05.webp",
  "/photos/luxury-art-love-paradise/gallery-06.webp",
  "/photos/luxury-art-love-paradise/hero.webp",
];

export function withLuxuryArtChampagneRomanceDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "luxury-art-champagne-romance") return invitation;

  return {
    ...invitation,
    coverImage: "/photos/luxury-art-love-paradise/couple-cover.webp",
    musicUrl: WEDDING_VOCAL_TRACKS.indonesianBallad,
    videoUrl: null,
    opening: {
      ...invitation.opening,
      greeting: "Assalamu’alaikum Wr. Wb.",
      description:
        "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaaAllah kami akan menyelenggarakan acara pernikahan:",
      quote:
        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
      quoteSource: "QS. Ar-Rum : 21",
    },
    bride: {
      ...invitation.bride,
      name: "Anisa Salsafira Rahma",
      nickname: "Anisa",
      parents: "Putri Kedua dari Bapak H. Sriyanto & Ibu Hj. Siti Aminah (Almh)",
      photo: "/photos/luxury-art-love-paradise/bride.webp",
    },
    groom: {
      ...invitation.groom,
      name: "Muhammad Haris Akbar",
      nickname: "Haris",
      parents: "Putra Kedua dari Bapak H. Sriyanto & Ibu Hj. Siti Aminah (Almh)",
      photo: "/photos/luxury-art-love-paradise/groom.webp",
    },
    events: [
      {
        name: "Akad Nikah",
        date: "Minggu, 24 Desember 2023",
        rawDate: "2026-12-24T12:00:00",
        time: "12.00 WIB",
        location: "Jl. KH. Agus Salim Pertokoan No. 105 Rt. 06, Kel. Berbas Pantai, Bontang Selatan, Kalimantan Timur",
      },
      {
        name: "Resepsi",
        date: "Minggu, 7 Desember 2023",
        rawDate: "2026-12-07T12:00:00",
        time: "12.00 WIB",
        location: "Jl. KH. Agus Salim Pertokoan No. 105 Rt. 06, Kel. Berbas Pantai, Bontang Selatan, Kalimantan Timur",
      },
    ],
    gallery: GALLERY,
    story: [
      {
        year: "2015",
        title: "Perkenalan",
        description: "Tahun 2015 kami dipertemukan saat menjadi mahasiswa baru. Berawal sebagai teman biasa, kisah kami perlahan tumbuh.",
      },
      {
        year: "2016",
        title: "Awal Hubungan",
        description: "Setahun kemudian kami menjadi sahabat dekat, hingga akhirnya perasaan yang sama membuat kami memulai hubungan yang lebih serius.",
      },
      {
        year: "2021",
        title: "Lamaran",
        description: "Setelah perjalanan panjang, kami mengajak kedua keluarga bertemu dan memantapkan langkah menuju pernikahan.",
      },
      {
        year: "2023",
        title: "Pernikahan",
        description: "Dengan penuh syukur, kami memilih melangkah bersama dan memulai babak baru sebagai pasangan suami istri.",
      },
    ],
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Muhammad Haris Akbar" }
        : account.owner === "Mempelai Wanita"
          ? { ...account, accountName: "Anisa Salsafira Rahma" }
          : account,
    ),
  };
}
