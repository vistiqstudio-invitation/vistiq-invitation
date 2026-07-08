import type { InvitationData } from "@/types/invitation";

// Cover photos vary by theme so the demo picker doesn't show the same
// image eight times over. All photos are either original theme assets or
// free-to-use stock photos (Pexels License - free for commercial use, no
// attribution required); see public/photos/README for sourcing notes.
const COVER_BY_THEME: Record<string, string> = {
  "luxury-gold": "/themes/luxury-gold/cover.png",
  "royal-black": "/themes/luxury-gold/cover.png",
  "islamic-green": "/themes/luxury-gold/cover.png",
  "emerald-lantern": "/photos/garden-tree.jpg",
  "minimal-white": "/photos/garden-carry.jpg",
  "floral-garden": "/photos/garden-tree.jpg",
  sakura: "/photos/garden-carry.jpg",
};

// One shared sample invitation used to demo every theme. Only the `theme`,
// `slug`, and `coverImage` fields change per theme - the rest is identical
// on purpose, so switching themes in the picker is an apples-to-apples
// comparison.
export function getDemoInvitation(theme: string): InvitationData {
  return {
    id: 0,
    slug: `demo-${theme}`,
    theme,
    status: "active",

    coverImage: COVER_BY_THEME[theme] || "/themes/luxury-gold/cover.png",
    musicUrl: "/music/wedding2.mp3",
    videoUrl: null,

    mapsUrl: "https://maps.google.com",
    mapsEmbedUrl: "https://www.google.com/maps?q=Jakarta&output=embed",

    groom: {
      name: "Rizky Pratama",
      parents: "Bapak Yusuf & Ibu Fatimah",
      photo: "/themes/luxury-gold/groom.png",
      instagram: "rizkypratama",
    },

    bride: {
      name: "Nabila Putri",
      parents: "Bapak Ahmad & Ibu Siti",
      photo: "/themes/luxury-gold/bride.png",
      instagram: "nabilaputri",
    },

    story: [
      {
        year: "2021",
        title: "Pertama Bertemu",
        description:
          "Kami dipertemukan dalam sebuah kesempatan yang tidak pernah kami sangka sebelumnya.",
      },
      {
        year: "2023",
        title: "Menjalin Hubungan",
        description:
          "Setelah saling mengenal lebih dekat, kami memutuskan untuk berjalan bersama.",
      },
      {
        year: "2026",
        title: "Menuju Pernikahan",
        description:
          "Dengan restu kedua orang tua, kami memutuskan mengikat janji suci pernikahan.",
      },
    ],

    events: [
      {
        name: "Akad Nikah",
        date: "Minggu, 20 September 2026",
        rawDate: "2026-09-20T08:00:00",
        time: "08.00 WIB",
        location: "Gedung Serbaguna Vistiq, Jakarta",
      },
      {
        name: "Resepsi",
        date: "Minggu, 20 September 2026",
        rawDate: "2026-09-20T11:00:00",
        time: "11.00 WIB",
        location: "Gedung Serbaguna Vistiq, Jakarta",
      },
    ],

    gallery: [
      "/gallery/1.jpg",
      "/gallery/2.jpg",
      "/gallery/3.jpg",
      "/gallery/4.jpg",
      "/gallery/5.jpg",
      "/gallery/6.jpg",
    ],

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
