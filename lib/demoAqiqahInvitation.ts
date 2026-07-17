import type { AqiqahInvitationData } from "@/types/aqiqah";

// No owner-supplied baby/aqiqah photography exists yet - unlike the wedding
// demo set (lib/demoInvitation.ts), there's no reasonable placeholder among
// the existing assets (they're all adult couple photos, which would
// misrepresent this as a baby photo). Cover/gallery stay empty until real
// photos are supplied; every akikah theme's Cover/Baby/Gallery components
// already render gracefully with no photo.
const MUSIC_BY_THEME: Record<string, string> = {
  "akikah-nur": "/music/akikah-nur.mp3",
};

// One shared sample aqiqah invitation used to demo every akikah theme, the
// same "identical data, only theme/cover/music differ" pattern as
// getDemoInvitation() for weddings.
export function getDemoAqiqahInvitation(theme: string): AqiqahInvitationData {
  return {
    id: 0,
    slug: `demo-akikah-${theme}`,
    theme,
    status: "active",
    category: "aqiqah",

    brand: null,

    coverImage: null,
    musicUrl: MUSIC_BY_THEME[theme] || null,
    videoUrl: null,

    mapsUrl: "https://maps.google.com",
    mapsEmbedUrl: "https://www.google.com/maps?q=Jakarta&output=embed",

    baby: {
      name: "Muhammad Rayyan Athallah",
      gender: "L",
      photo: null,
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

    gallery: [],

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
