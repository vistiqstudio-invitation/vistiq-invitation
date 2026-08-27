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
      name: "Alya Rahmadani Putri",
      nickname: "Alya",
      parents: "Putri Pertama dari Bapak H. Rahmat Hidayat & Ibu Hj. Nur Aini",
      photo: "/photos/luxury-art-love-paradise/bride.webp",
    },
    groom: {
      ...invitation.groom,
      name: "Raka Pradipta Mahendra",
      nickname: "Raka",
      parents: "Putra Kedua dari Bapak Ir. Dimas Prasetyo & Ibu Ratna Maharani",
      photo: "/photos/luxury-art-love-paradise/groom.webp",
    },
    events: [
      {
        name: "Akad Nikah",
        date: "Sabtu, 18 April 2026",
        rawDate: "2026-04-18T09:00:00",
        time: "09.00 WIB",
        location: "Gedung Serbaguna Taman Prestasi, Jl. Ahmad Yani No. 28, Bontang, Kalimantan Timur",
      },
      {
        name: "Resepsi",
        date: "Minggu, 19 April 2026",
        rawDate: "2026-04-19T11:00:00",
        time: "11.00 WIB - Selesai",
        location: "Ballroom Hotel Bintang Sintuk, Jl. MT Haryono No. 17, Bontang, Kalimantan Timur",
      },
    ],
    gallery: GALLERY,
    story: [
      {
        year: "2018",
        title: "Pertemuan Pertama",
        description: "Kami pertama kali bertemu melalui kegiatan kampus. Dari obrolan sederhana, tumbuh rasa nyaman yang membuat kami semakin dekat.",
      },
      {
        year: "2019",
        title: "Mulai Bersama",
        description: "Persahabatan kami berkembang menjadi hubungan yang lebih serius. Kami belajar tumbuh, saling mendukung, dan mengenal keluarga masing-masing.",
      },
      {
        year: "2025",
        title: "Lamaran",
        description: "Setelah melalui perjalanan panjang bersama, kedua keluarga bertemu dan merestui langkah kami menuju jenjang pernikahan.",
      },
      {
        year: "2026",
        title: "Hari Bahagia",
        description: "Dengan penuh syukur, kami memulai babak baru dan berharap perjalanan ini selalu dipenuhi kasih, keberkahan, dan kebahagiaan.",
      },
    ],
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Raka Pradipta Mahendra" }
        : account.owner === "Mempelai Wanita"
          ? { ...account, accountName: "Alya Rahmadani Putri" }
          : account,
    ),
  };
}
