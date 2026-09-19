import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const PHOTO_ROOT = "/photos";
const OPENING_VIDEO = "/video/adat-minang-opening.mp4";

const coverPhoto = `${PHOTO_ROOT}/luxury-cover.webp`;
const bridePhoto = `${PHOTO_ROOT}/luxury-bride.webp`;
const groomPhoto = `${PHOTO_ROOT}/luxury-groom.webp`;

const gallery = [
  `${PHOTO_ROOT}/luxury-gallery-1.webp`,
  `${PHOTO_ROOT}/luxury-gallery-2.webp`,
  `${PHOTO_ROOT}/luxury-gallery-3.webp`,
  `${PHOTO_ROOT}/luxury-gallery-4.webp`,
  `${PHOTO_ROOT}/luxury-gallery-5.webp`,
  `${PHOTO_ROOT}/luxury-gallery-6.webp`,
];

export function withAdatMinangMotionDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "adat-minang-motion") return invitation;

  return {
    ...invitation,
    coverImage: coverPhoto,
    musicUrl: WEDDING_VOCAL_TRACKS.minangWedding,
    // The opening video is the Minang motion asset supplied for Vistiq.
    videoUrl: OPENING_VIDEO,
    liveStreamingUrl: "https://instagram.com/vistiqinvitation",
    opening: {
      ...invitation.opening,
      greeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
      description:
        "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk berkenan hadir pada pernikahan kami.",
      quote:
        "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
      quoteSource: "QS. Ar-Rum: 21",
    },
    bride: {
      ...invitation.bride,
      name: "Nabila Putri",
      nickname: "Nabila",
      parents: "Bapak Ahmad & Ibu Siti",
      instagram: "nabilaputri",
      photo: bridePhoto,
    },
    groom: {
      ...invitation.groom,
      name: "Rizky Pratama",
      nickname: "Rizky",
      parents: "Bapak Yusuf & Ibu Fatimah",
      instagram: "rizkypratama",
      photo: groomPhoto,
    },
    events: [
      {
        name: "Akad Nikah",
        date: "Minggu, 20 September 2026",
        rawDate: "2026-09-20T08:00:00+07:00",
        time: "08.00 WIB",
        location: "Gedung Serbaguna Vistiq, Jakarta",
      },
      {
        name: "Resepsi",
        date: "Minggu, 20 September 2026",
        rawDate: "2026-09-20T11:00:00+07:00",
        time: "11.00 WIB",
        location: "Gedung Serbaguna Vistiq, Jakarta",
      },
    ],
    coverEvent: {
      name: "Resepsi",
      date: "Minggu, 20 September 2026",
      rawDate: "2026-09-20T11:00:00+07:00",
      time: "11.00 WIB",
      location: "Gedung Serbaguna Vistiq, Jakarta",
    },
    story: [
      {
        year: "",
        title: "Awal Bertemu",
        description:
          "Tak ada yang kebetulan di dunia ini. Kami dipertemukan pada waktu yang sederhana, namun sejak itu semesta perlahan menyatukan dua cerita yang berbeda.",
      },
      {
        year: "",
        title: "Hubungan",
        description:
          "Seiring waktu, kebersamaan tumbuh menjadi rasa. Dalam tawa dan perbedaan, kami belajar saling memahami, menguatkan, dan memilih untuk berjalan bersama.",
      },
      {
        year: "",
        title: "Lamaran",
        description:
          "Dengan niat yang tulus dan keyakinan di hati, sebuah janji diucapkan. Bukan hanya tentang hari ini, tetapi tentang masa depan yang ingin kami bangun berdua.",
      },
      {
        year: "",
        title: "Menikah",
        description:
          "Kini, dengan penuh syukur dan cinta, kami memulai perjalanan baru. Mengikat janji suci untuk saling mencintai, menghormati, dan bersama hingga akhir hayat.",
      },
    ],
    gallery,
    gifts: [
      {
        owner: "Mempelai Pria",
        bankName: "BCA",
        accountNumber: "1234567890",
        accountName: "Rizky Pratama",
      },
      {
        owner: "Mempelai Wanita",
        bankName: "Mandiri",
        accountNumber: "0987654321",
        accountName: "Nabila Putri",
      },
    ],
  };
}
