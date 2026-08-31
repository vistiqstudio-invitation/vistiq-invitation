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
  `${ASSET}ai-footer.jpg`,
  `${ASSET}ai-bride.jpg`,
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
        "Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam perayaan pernikahan kami:",
      quote:
        "Maha Suci Allah yang telah menciptakan semuanya berpasang-pasangan, baik dari apa yang ditumbuhkan oleh bumi dan dari diri mereka maupun dari apa yang tidak mereka ketahui.",
      quoteSource: "QS. Yasin : 36",
    },
    groom: {
      ...invitation.groom,
      name: "Rendra Adinata",
      nickname: "Rendra",
      parents: "Putra kedua dari Bapak Fajar Adinata & Ibu Nirmala Sari",
      photo: `${ASSET}ai-groom.jpg`,
      instagram: "rendraadinata",
    },
    bride: {
      ...invitation.bride,
      name: "Keisya Maharani Putri",
      nickname: "Keisya",
      parents: "Putri pertama dari Bapak Bima Prakoso & Ibu Larasati",
      photo: `${ASSET}ai-bride.jpg`,
      instagram: "keisyamaharani",
    },
    events: [
      {
        name: "Akad Nikah",
        date: "Sabtu, 14 November 2026",
        rawDate: "2026-11-14T09:00:00",
        time: "09.00 WIB",
        location: "Paviliun Arunika, Bandung",
      },
      {
        name: "Resepsi",
        date: "Sabtu, 14 November 2026",
        rawDate: "2026-11-14T11:00:00",
        time: "11.00 WIB - Selesai",
        location: "Paviliun Arunika, Bandung",
      },
    ],
    gallery: GALLERY,
    story: [
      {
        year: "2019",
        title: "Pertemuan Pertama",
        description: "Satu pertemuan singkat menjadi awal dari perjalanan yang tidak pernah kami duga.",
      },
      {
        year: "2021",
        title: "Tumbuh Bersama",
        description: "Kami belajar saling menguatkan, merayakan hal-hal kecil, dan mengenal keluarga masing-masing.",
      },
      {
        year: "2025",
        title: "Hari Lamaran",
        description: "Dengan restu keluarga, kami memilih untuk melangkah pada tujuan yang sama.",
      },
      {
        year: "2026",
        title: "Janji Selamanya",
        description: "Dengan penuh syukur, kami membuka babak baru dan menitipkan doa pada setiap langkah.",
      },
    ],
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Rendra Adinata" }
        : account.owner === "Mempelai Wanita"
          ? { ...account, accountName: "Keisya Maharani Putri" }
          : account,
    ),
  };
}
