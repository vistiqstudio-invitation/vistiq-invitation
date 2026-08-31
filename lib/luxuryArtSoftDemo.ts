import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const ASSET = "/themes/luxury-art-soft/";

const GALLERY = [
  `${ASSET}ai-gallery-01.jpg`,
  `${ASSET}ai-gallery-02.jpg`,
  `${ASSET}ai-gallery-03.jpg`,
  `${ASSET}ai-gallery-04.jpg`,
  `${ASSET}ai-gallery-05.jpg`,
  `${ASSET}ai-cover.jpg`,
  `${ASSET}ai-rsvp.jpg`,
  `${ASSET}ai-wishes.jpg`,
];

export function withLuxuryArtSoftDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "luxury-art-soft") return invitation;

  return {
    ...invitation,
    coverImage: `${ASSET}ai-cover.jpg`,
    musicUrl: WEDDING_VOCAL_TRACKS.indonesianBallad,
    videoUrl: `${ASSET}cover.mp4`,
    opening: {
      ...invitation.opening,
      greeting: "Assalamu’alaikum Wr. Wb.",
      description:
        "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaaAllah kami akan menyelenggarakan acara pernikahan:",
      quote:
        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.",
      quoteSource: "QS. Ar-Rum : 21",
    },
    groom: {
      ...invitation.groom,
      name: "Saputra Mahendra",
      nickname: "Saputra",
      parents: "Putra pertama dari Bapak H. Mahendra & Ibu Hj. Sulastri",
      photo: `${ASSET}ai-groom.jpg`,
      instagram: "saputramahendra",
    },
    bride: {
      ...invitation.bride,
      name: "Juwita Anggraini",
      nickname: "Juwita",
      parents: "Putri kedua dari Bapak H. Anggraini & Ibu Hj. Ratna",
      photo: `${ASSET}ai-bride.jpg`,
      instagram: "juwitaanggraini",
    },
    events: [
      {
        name: "Akad Nikah",
        date: "Rabu, 30 September 2026",
        rawDate: "2026-09-30T09:00:00",
        time: "09.00 WIB",
        location: "Gedung Serbaguna Vistiq, Jakarta",
      },
      {
        name: "Resepsi",
        date: "Rabu, 30 September 2026",
        rawDate: "2026-09-30T11:00:00",
        time: "11.00 WIB - Selesai",
        location: "Gedung Serbaguna Vistiq, Jakarta",
      },
    ],
    gallery: GALLERY,
    story: [
      {
        year: "2018",
        title: "Awal Bertemu",
        description: "Pertemuan sederhana yang menjadi awal dari cerita indah kami.",
      },
      {
        year: "2020",
        title: "Menjalin Kasih",
        description: "Kami belajar tumbuh, saling mendukung, dan mengenal keluarga masing-masing.",
      },
      {
        year: "2025",
        title: "Lamaran",
        description: "Dengan restu kedua keluarga, kami mantap melangkah menuju jenjang pernikahan.",
      },
      {
        year: "2026",
        title: "Hari Bahagia",
        description: "Dengan penuh syukur, kami memulai babak baru dalam perjalanan bersama.",
      },
    ],
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Saputra Mahendra" }
        : account.owner === "Mempelai Wanita"
          ? { ...account, accountName: "Juwita Anggraini" }
          : account,
    ),
  };
}
