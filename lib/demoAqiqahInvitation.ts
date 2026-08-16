import type { AqiqahInvitationData } from "@/types/aqiqah";

const MUSIC_BY_THEME: Record<string, string> = {
  "akikah-nur": "/music/akikah-nur.mp3",
  "akikah-zaitun": "/music/akikah-zaitun.mp3",
  // Both dedicated aqiqah tracks are already used above - this one reuses
  // the next unused numbered wedding track (see reference_wedding_music_bank
  // memory), same as any new wedding theme would.
  "akikah-ceria": "/music/akikah-ceria.mp3",
  "akikah-anugerah": "/music/akikah-anugerah.mp3",
  "akikah-safir": "/music/akikah-safir.mp3",
  "akikah-kasih": "/music/akikah-kasih.mp3",
  "akikah-damai": "/music/akikah-damai.mp3",
};

// Every aqiqah demo theme gets its own baby photo so previews are visually
// distinct. Zaitun and Damai keep their existing photo sets; the other five
// use the new dedicated demo assets.
export const COVER_BY_THEME: Record<string, string> = {
  "akikah-nur": "/photos/akikah-nur-demo.webp",
  "akikah-zaitun": "/photos/akikah-zaitun-cover.jpg",
  "akikah-ceria": "/photos/akikah-ceria-demo.webp",
  "akikah-anugerah": "/photos/akikah-anugerah-demo.webp",
  "akikah-safir": "/photos/akikah-safir-demo.webp",
  "akikah-kasih": "/photos/akikah-kasih-demo.webp",
  "akikah-damai": "/photos/akikah-damai-cover.jpg",
};

const BABY_PHOTO_BY_THEME: Record<string, string> = {
  "akikah-nur": "/photos/akikah-nur-demo.webp",
  "akikah-zaitun": "/photos/akikah-zaitun-baby.jpg",
  "akikah-ceria": "/photos/akikah-ceria-demo.webp",
  "akikah-anugerah": "/photos/akikah-anugerah-demo.webp",
  "akikah-safir": "/photos/akikah-safir-demo.webp",
  "akikah-kasih": "/photos/akikah-kasih-demo.webp",
  "akikah-damai": "/photos/akikah-damai-baby.jpg",
};

const GALLERY_BY_THEME: Record<string, string[]> = {
  "akikah-nur": ["/photos/akikah-nur-demo.webp"],
  "akikah-zaitun": [
    "/photos/akikah-zaitun-gallery-1.jpg",
    "/photos/akikah-zaitun-gallery-2.jpg",
    "/photos/akikah-zaitun-gallery-3.jpg",
    "/photos/akikah-zaitun-gallery-4.jpg",
    "/photos/akikah-zaitun-gallery-5.jpg",
    "/photos/akikah-zaitun-gallery-6.jpg",
  ],
  "akikah-ceria": ["/photos/akikah-ceria-demo.webp"],
  "akikah-anugerah": ["/photos/akikah-anugerah-demo.webp"],
  "akikah-safir": ["/photos/akikah-safir-demo.webp"],
  "akikah-kasih": ["/photos/akikah-kasih-demo.webp"],
  "akikah-damai": [
    "/photos/akikah-damai-gallery-1.jpg",
    "/photos/akikah-damai-gallery-2.jpg",
    "/photos/akikah-damai-gallery-3.jpg",
    "/photos/akikah-damai-gallery-4.jpg",
    "/photos/akikah-damai-gallery-5.jpg",
    "/photos/akikah-damai-gallery-6.jpg",
  ],
};

// One shared sample aqiqah invitation used to demo every akikah theme, the
// same "identical data, only theme/cover/photo/music differ" pattern as
// getDemoInvitation() for weddings.
export function getDemoAqiqahInvitation(theme: string): AqiqahInvitationData {
  return {
    id: 0,
    slug: `demo-akikah-${theme}`,
    theme,
    status: "active",
    category: "aqiqah",

    brand: null,

    coverImage: COVER_BY_THEME[theme] || null,
    musicUrl: MUSIC_BY_THEME[theme] || null,
    videoUrl: null,

    mapsUrl: "https://maps.google.com",
    mapsEmbedUrl: "https://www.google.com/maps?q=Jakarta&output=embed",

    opening: { greeting: null, title: null, description: null, quote: null, quoteSource: null },

    baby: {
      name: "Muhammad Rayyan Athallah",
      gender: "L",
      photo: BABY_PHOTO_BY_THEME[theme] || null,
      birthDate: "Senin, 12 Mei 2026",
      birthPlace: "Jakarta",
    },

    parents: {
      father: "Rizky Pratama",
      mother: "Nabila Putri",
    },

    event: {
      date: "Minggu, 20 September 2026",
      rawDate: "2026-09-20T10:00:00",
      time: "10.00 WIB",
      location: "Kediaman Keluarga, Jl. Melati No. 12, Jakarta",
    },

    gallery: GALLERY_BY_THEME[theme] || [],

    gifts: [
      {
        owner: "Orang Tua Bayi",
        bankName: "BCA",
        accountNumber: "1234567890",
        accountName: "Rizky Pratama",
      },
    ],
  };
}
