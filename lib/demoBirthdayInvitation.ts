import type { BirthdayInvitationData } from "@/types/birthday";

export const COVER_BY_THEME: Record<string, string> = {
  "princess-fairytale": "/photos/princess-fairytale/cover.webp",
  "space-explorer": "/photos/space-explorer/cover.webp",
  "dinosaur-adventure": "/photos/dinosaur-adventure/cover.webp",
  "superhero-city": "/photos/superhero-city/cover.webp",
};

const CHILD_PHOTO_BY_THEME: Record<string, string> = {
  "princess-fairytale": "/photos/princess-fairytale/profile.webp",
  "space-explorer": "/photos/space-explorer/profile.webp",
  "dinosaur-adventure": "/photos/dinosaur-adventure/profile.webp",
  "superhero-city": "/photos/superhero-city/profile.webp",
};

const GALLERY_BY_THEME: Record<string, string[]> = {
  "princess-fairytale": [
    "/photos/princess-fairytale/gallery-1.webp",
    "/photos/princess-fairytale/gallery-2.webp",
    "/photos/princess-fairytale/castle.webp",
  ],
  "space-explorer": [
    "/photos/space-explorer/gallery-1.webp",
    "/photos/space-explorer/gallery-2.webp",
    "/photos/space-explorer/rocket.webp",
  ],
  "dinosaur-adventure": [
    "/photos/dinosaur-adventure/gallery-1.webp",
    "/photos/dinosaur-adventure/gallery-2.webp",
    "/photos/dinosaur-adventure/dino-hero.webp",
  ],
  "superhero-city": [
    "/photos/superhero-city/gallery-1.webp",
    "/photos/superhero-city/gallery-2.webp",
    "/photos/superhero-city/action-pose.webp",
  ],
};

type ThemeCopy = {
  childName: string;
  opening: BirthdayInvitationData["opening"];
  location: string;
};

const COPY_BY_THEME: Record<string, ThemeCopy> = {
  "princess-fairytale": {
    childName: "Putri Kecil",
    opening: {
      greeting: "Dengan penuh kebahagiaan",
      title: "A Royal Birthday Celebration",
      description: "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan berbagi keceriaan di hari ulang tahun putri kecil kami.",
      quote: "Setiap anak adalah hadiah, dan hari ini kami merayakan satu tahun indah dalam perjalanannya.",
      quoteSource: "Keluarga",
    },
    location: "Royal Garden Hall, Jakarta",
  },
  "space-explorer": {
    childName: "Kapten Kecil",
    opening: {
      greeting: "Bersiaplah untuk petualangan",
      title: "A Space Explorer Birthday Mission",
      description: "Kami mengundang Bapak/Ibu/Saudara/i untuk ikut serta dalam misi luar angkasa spesial di hari ulang tahun kapten kecil kami.",
      quote: "Setiap petualangan besar dimulai dari satu langkah kecil ke bintang.",
      quoteSource: "Keluarga",
    },
    location: "Mission Control Hall, Jakarta",
  },
  "dinosaur-adventure": {
    childName: "Penjelajah Kecil",
    opening: {
      greeting: "Bersiaplah menjelajah",
      title: "A Dinosaur Adventure Birthday",
      description: "Kami mengundang Bapak/Ibu/Saudara/i untuk ikut menjelajah hutan purba di hari ulang tahun penjelajah kecil kami.",
      quote: "Petualangan terbaik adalah yang dirayakan bersama orang-orang tersayang.",
      quoteSource: "Keluarga",
    },
    location: "Jungle Adventure Park, Jakarta",
  },
  "superhero-city": {
    childName: "Pahlawan Kecil",
    opening: {
      greeting: "Kota membutuhkanmu",
      title: "A Superhero City Birthday Mission",
      description: "Kami mengundang Bapak/Ibu/Saudara/i untuk ikut merayakan misi ulang tahun pahlawan kecil kami di kota ini.",
      quote: "Setiap pahlawan sejati memulai kisahnya dari rumah, dikelilingi orang-orang yang menyayanginya.",
      quoteSource: "Keluarga",
    },
    location: "Metropolitan Hall, Jakarta",
  },
};

export function getDemoBirthdayInvitation(theme: string): BirthdayInvitationData {
  const copy = COPY_BY_THEME[theme] || COPY_BY_THEME["princess-fairytale"];

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
    opening: copy.opening,
    child: {
      name: copy.childName,
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
      location: copy.location,
    },
    gallery: GALLERY_BY_THEME[theme] || [],
    gifts: [],
  };
}
