import type { BirthdayInvitationData } from "@/types/birthday";

export const COVER_BY_THEME: Record<string, string> = {
  "princess-fairytale": "/photos/princess-fairytale/cover.webp",
};

const CHILD_PHOTO_BY_THEME: Record<string, string> = {
  "princess-fairytale": "/photos/princess-fairytale/profile.webp",
};

const GALLERY_BY_THEME: Record<string, string[]> = {
  "princess-fairytale": [
    "/photos/princess-fairytale/gallery-1.webp",
    "/photos/princess-fairytale/gallery-2.webp",
    "/photos/princess-fairytale/castle.webp",
  ],
};

export function getDemoBirthdayInvitation(theme: string): BirthdayInvitationData {
  return {
    id: 0,
    slug: `demo-birthday-${theme}`,
    theme,
    status: "active",
    category: "birthday",
    brand: null,
    coverImage: COVER_BY_THEME[theme] || null,
    musicUrl: null,
    videoUrl: null,
    mapsUrl: "https://maps.google.com",
    mapsEmbedUrl: "https://www.google.com/maps?q=Jakarta&output=embed",
    opening: {
      greeting: "Dengan penuh kebahagiaan",
      title: "A Royal Birthday Celebration",
      description: "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan berbagi keceriaan di hari ulang tahun putri kecil kami.",
      quote: "Setiap anak adalah hadiah, dan hari ini kami merayakan satu tahun indah dalam perjalanannya.",
      quoteSource: "Keluarga",
    },
    child: {
      name: "Putri Kecil",
      photo: CHILD_PHOTO_BY_THEME[theme] || null,
      age: 7,
      birthDate: null,
    },
    parents: {
      father: "Ayah",
      mother: "Ibu",
    },
    event: {
      date: "Minggu, 20 September 2026",
      rawDate: "2026-09-20T10:00:00",
      time: "10.00 WIB",
      location: "Royal Garden Hall, Jakarta",
    },
    gallery: GALLERY_BY_THEME[theme] || [],
    gifts: [],
  };
}
