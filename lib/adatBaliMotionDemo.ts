import type { InvitationData } from "@/types/invitation";

const ASSET_ROOT = "/themes/adat-bali-motion/reference/Tema 3d Adat Bali 2_files";
const REFERENCE_MEDIA_ROOT = "https://hallomoment.my.id/wp-content/uploads/2026/05";

const coverPhoto = `${ASSET_ROOT}/01_aDAT_BALI-3.jpg`;
const bridePhoto = `${ASSET_ROOT}/01_aDAT_BALI-1.jpg`;
const groomPhoto = `${ASSET_ROOT}/01_aDAT_BALI-2.jpg`;

const gallery = [
  `${ASSET_ROOT}/01_aDAT_BALI-10.jpg`,
  `${REFERENCE_MEDIA_ROOT}/01_aDAT_BALI-9.jpg`,
  `${REFERENCE_MEDIA_ROOT}/01_aDAT_BALI-8.jpg`,
  `${ASSET_ROOT}/01_aDAT_BALI-7.jpg`,
  `${ASSET_ROOT}/01_aDAT_BALI-6.jpg`,
  `${ASSET_ROOT}/01_aDAT_BALI-3.jpg`,
  `${REFERENCE_MEDIA_ROOT}/01_aDAT_BALI-4.jpg`,
  `${ASSET_ROOT}/01_aDAT_BALI-5.jpg`,
];

export function withAdatBaliMotionDemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "adat-bali-motion") return invitation;

  return {
    ...invitation,
    coverImage: coverPhoto,
    // Keep the reference's Bali opening video in the static reference page.
    // A custom invitation video, when supplied, is still applied by the theme.
    videoUrl: null,
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
