import type { KhitanInvitationData } from "@/types/khitan";
import { KHITAN_COVER_BY_THEME } from "@/lib/themeCoverImages";

const MUSIC_BY_THEME: Record<string, string> = {
  "khitan-warna": "/music/khitan-warna.mp3",
  "khitan-ksatria": "/music/khitan-ksatria.mp3",
  "khitan-raja": "/music/khitan-raja.mp3",
  "khitan-berani": "/music/khitan-berani.mp3",
  "khitan-petualang": "/music/khitan-petualang.mp3",
  "khitan-elang": "/music/khitan-elang.mp3",
};

const KHITAN_THEMES = [
  "khitan-warna",
  "khitan-ksatria",
  "khitan-raja",
  "khitan-berani",
  "khitan-petualang",
  "khitan-elang",
] as const;

const SHARED_CHILD_PHOTO = "/photos/khitan-warna-child.jpg";
const SHARED_GALLERY = [
  "/photos/khitan-warna-gallery-1.jpg",
  "/photos/khitan-warna-gallery-2.jpg",
  "/photos/khitan-warna-gallery-3.jpg",
  "/photos/khitan-warna-gallery-4.jpg",
  "/photos/khitan-warna-gallery-5.jpg",
  "/photos/khitan-warna-gallery-6.jpg",
];

export const COVER_BY_THEME = KHITAN_COVER_BY_THEME;

const CHILD_PHOTO_BY_THEME: Record<string, string> = Object.fromEntries(
  KHITAN_THEMES.map((theme) => [theme, SHARED_CHILD_PHOTO]),
);

const GALLERY_BY_THEME: Record<string, string[]> = Object.fromEntries(
  KHITAN_THEMES.map((theme) => [theme, SHARED_GALLERY]),
);

// One shared sample khitan invitation used to demo every khitan theme, same
// pattern as getDemoInvitation()/getDemoAqiqahInvitation().
export function getDemoKhitanInvitation(theme: string): KhitanInvitationData {
  return {
    id: 0,
    slug: `demo-khitan-${theme}`,
    theme,
    status: "active",
    category: "khitan",

    brand: null,

    coverImage: COVER_BY_THEME[theme] || null,
    musicUrl: MUSIC_BY_THEME[theme] || null,
    videoUrl: null,

    mapsUrl: "https://maps.google.com",
    mapsEmbedUrl: "https://www.google.com/maps?q=Jakarta&output=embed",

    opening: { greeting: null, title: null, description: null, quote: null, quoteSource: null },

    child: {
      name: "Muhammad Rayyan Athallah",
      photo: CHILD_PHOTO_BY_THEME[theme] || null,
      birthDate: "Senin, 12 Mei 2018",
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
        owner: "Orang Tua",
        bankName: "BCA",
        accountNumber: "1234567890",
        accountName: "Rizky Pratama",
      },
    ],
  };
}
