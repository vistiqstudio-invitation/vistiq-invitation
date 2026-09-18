import type { InvitationData } from "@/types/invitation";

const PHOTO_ROOT = "/photos";
const OPENING_VIDEO = "/video/adat-bali-opening.mp4";

const coverPhoto = `${PHOTO_ROOT}/adat-bali-cover.webp`;
const bridePhoto = `${PHOTO_ROOT}/adat-bali-bride.webp`;
const groomPhoto = `${PHOTO_ROOT}/adat-bali-groom.webp`;

const gallery = [
  `${PHOTO_ROOT}/adat-bali-gallery-1.webp`,
  `${PHOTO_ROOT}/adat-bali-gallery-2.webp`,
  `${PHOTO_ROOT}/adat-bali-gallery-3.webp`,
  `${PHOTO_ROOT}/adat-bali-gallery-4.webp`,
  `${PHOTO_ROOT}/adat-bali-gallery-5.webp`,
  `${PHOTO_ROOT}/adat-bali-gallery-6.webp`,
];

export function withAdatBaliMotionDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "adat-bali-motion") return invitation;

  return {
    ...invitation,
    coverImage: coverPhoto,
        // Use Vistiq's own Adat Bali opening video instead of the reference video's asset.
    videoUrl: OPENING_VIDEO,
    opening: {
      ...invitation.opening,
      greeting: "Om Swastyastu",
      description:
        "Dengan memohon anugerah Ida Sang Hyang Widhi Wasa, kami mengaturkan undangan kepada Bapak/Ibu/Saudara/i untuk berkenan hadir pada Resepsi Pernikahan (Pawiwahan) kami.",
      quote:
        "Wahai pasangan suami-istri, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan, tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.",
      quoteSource: "RG VEDA X.85.42.",
    },
    bride: {
      ...invitation.bride,
      name: "Elyana Azkiya Nur",
      nickname: "Elyana",
      parents: "Bapak Sukirmanan & Ibu Tarsemin",
      instagram: "elyanaa",
      photo: bridePhoto,
    },
    groom: {
      ...invitation.groom,
      name: "Syahril Rendra Backhtiar",
      nickname: "Syahril",
      parents: "Bpk.Iwan Setiawan & Ibu Saprah Hayati",
      instagram: "syahril",
      photo: groomPhoto,
    },
    events: [
      {
        name: "Pawiwahan",
        date: "Sabtu, 26 Mei 2026",
        rawDate: "2026-05-26T11:00:00+07:00",
        time: "11.00 WIB",
        location: "Kediaman Mempelai Wanita, Jl. Mawar Melati Merah Muda",
      },
      {
        name: "Resepsi",
        date: "Sabtu, 26 Oktober 2026",
        rawDate: "2026-10-26T11:00:00+07:00",
        time: "11.00 WIB",
        location: "Kediaman mempelai wanita, Jl. Mawar Melati Merah Muda",
      },
    ],
    coverEvent: {
      name: "Resepsi",
      date: "Minggu, 14 September 2026",
      rawDate: "2026-09-14T11:00:00+07:00",
      time: "11.00 WIB",
      location: "Kediaman mempelai wanita, Jl. Mawar Melati Merah Muda",
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
        owner: "Elyana",
        bankName: null,
        accountNumber: "123124234123",
        accountName: "Elyana",
      },
      {
        owner: "Syahril",
        bankName: null,
        accountNumber: "9273778324823",
        accountName: "Syahril",
      },
      {
        owner: "Syahril",
        bankName: null,
        accountNumber: "892835732423452",
        accountName: "Syahril",
      },
    ],
  };
}
