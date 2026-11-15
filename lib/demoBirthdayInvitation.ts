import type { BirthdayInvitationData } from "@/types/birthday";
import { BIRTHDAY_COVER_BY_THEME } from "@/lib/themeCoverImages";

export const COVER_BY_THEME = BIRTHDAY_COVER_BY_THEME;

const melonPhotoBase = "/photos/rainbow-melon-party";
const butterflyPhotoBase = "/photos/pink-butterfly-bow-party";
const astronautPhotoBase = "/photos/little-astronaut-party";

const CHILD_PHOTO_BY_THEME: Record<string, string> = {
  "rainbow-melon-party": `${melonPhotoBase}/demo-profile.webp`,
  "pink-butterfly-bow-party": `${butterflyPhotoBase}/demo-profile.webp`,
  "little-astronaut-party": `${astronautPhotoBase}/demo-profile.webp`,
  "little-safari-party": "/photos/little-safari-party/demo-profile.webp",
  "teddy-bear-party": "/photos/teddy-bear-party/demo-profile.webp",
  "princess-fairytale": "/photos/princess-fairytale/profile.webp",
  "space-explorer": "/photos/space-explorer/profile.webp",
  "dinosaur-adventure": "/photos/dinosaur-adventure/profile.webp",
  "superhero-city": "/photos/superhero-city/profile.webp",
};

const GALLERY_BY_THEME: Record<string, string[]> = {
  "rainbow-melon-party": [`${melonPhotoBase}/demo-profile.webp`, `${melonPhotoBase}/demo-gallery-2.webp`],
  "pink-butterfly-bow-party": [`${butterflyPhotoBase}/demo-profile.webp`, `${butterflyPhotoBase}/demo-gallery-2.webp`],
  "little-astronaut-party": [`${astronautPhotoBase}/demo-profile.webp`, `${astronautPhotoBase}/demo-gallery-2.webp`],
  "little-safari-party": ["/photos/little-safari-party/demo-profile.webp", "/photos/little-safari-party/demo-gallery-2.webp"],
  "teddy-bear-party": [1, 2, 3].map(index => `/photos/teddy-bear-party/demo-gallery-${index}.webp`),
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
  "rainbow-melon-party": {
    childName: "Aiden",
    opening: { greeting: "", title: "Birthday Party", description: "Yuk, bernyanyi, bermain, tertawa, dan berbagi kebahagiaan bersama di hari spesialku!", quote: "", quoteSource: "" },
    location: "Rumah Kami",
  },
  "pink-butterfly-bow-party": {
    childName: "Alya",
    opening: { greeting: "", title: "Birthday Party", description: "Yuk, datang dan rayakan hari spesialku bersama dengan penuh tawa, warna, dan kebahagiaan!", quote: "", quoteSource: "" },
    location: "Rumah Kami",
  },
  "little-astronaut-party": {
    childName: "Aiden",
    opening: { greeting: "", title: "Birthday Party", description: "Yuk, terbang bersamaku menuju hari penuh tawa, permainan, dan kebahagiaan di pesta ulang tahunku!", quote: "", quoteSource: "" },
    location: "Rumah Kami",
  },
  "little-safari-party": {
    childName: "Aiden",
    opening: { greeting: "", title: "Birthday Party", description: "Yuk, bermain, tertawa, dan berbagi kebahagiaan bersama di hari spesialku!", quote: "", quoteSource: "" },
    location: "Rumah Kami — Jl. Rimba Ceria No. 3, Kota Contoh",
  },
  "teddy-bear-party": {
    childName: "Aiden",
    opening: { greeting: "", title: "Birthday Party", description: "Yuk, tiup lilin, bermain, dan berbagi kue bersama di hari spesialku!", quote: "", quoteSource: "" },
    location: "Taman Menteng, Jl. HOS Cokroaminoto, Jakarta Pusat",
  },
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

  const safari = theme === "little-safari-party";
  const astronaut = theme === "little-astronaut-party";
  const butterfly = theme === "pink-butterfly-bow-party";
  const melon = theme === "rainbow-melon-party";
  const decemberParty = safari || astronaut || butterfly || melon;
  const giftName = `Keluarga ${copy.childName} (Contoh)`;
  const teddy = theme === "teddy-bear-party";
  return {
    id: 0,
    slug: `demo-birthday-${theme}`,
    theme,
    status: "active",
    category: "birthday",
    brand: null,
    coverImage: decemberParty ? CHILD_PHOTO_BY_THEME[theme] : teddy ? GALLERY_BY_THEME[theme][1] : COVER_BY_THEME[theme] || null,
    musicUrl: teddy || decemberParty ? "/music-library/acoustic-garden.mp3" : null,
    videoUrl: null,
    mapsUrl: decemberParty ? "https://www.google.com/maps/search/?api=1&query=Jakarta" : teddy ? "https://www.google.com/maps/search/?api=1&query=Taman+Menteng+Jakarta" : "https://maps.google.com",
    mapsEmbedUrl: "https://www.google.com/maps?q=Jakarta&output=embed",
    opening: copy.opening,
    child: {
      name: copy.childName,
      photo: CHILD_PHOTO_BY_THEME[theme] || null,
      age: teddy || decemberParty ? 3 : 7,
      birthDate: null,
    },
    parents: {
      father: "Ayah",
      mother: "Ibu",
    },
    event: {
      date: teddy || decemberParty ? "Minggu, 20 Desember 2026" : "Minggu, 20 September 2026",
      rawDate: decemberParty ? "2026-12-20T15:00:00+07:00" : teddy ? "2026-12-20T10:00:00+07:00" : "2026-09-20T10:00:00",
      time: decemberParty ? "15.00 WIB" : "10.00 WIB",
      location: copy.location,
      ...(melon ? { address: "Jl. Pelangi Ceria No. 3, Kota Contoh" } : butterfly ? { address: "Jl. Taman Kupu-Kupu No. 3, Kota Contoh" } : astronaut ? { address: "Jl. Bintang Kecil No. 3, Kota Contoh" } : {}),
    },
    gallery: GALLERY_BY_THEME[theme] || [],
    gifts: teddy || decemberParty ? [{ owner: "Keluarga", bankName: "Bank Contoh", accountNumber: "0000 0000 00", accountName: giftName }] : [],
    giftShipping: melon ? { recipient: giftName, address: "Jl. Pelangi Ceria No. 3, Kota Contoh 00000" } : butterfly ? { recipient: giftName, address: "Jl. Taman Kupu-Kupu No. 3, Kota Contoh 00000" } : astronaut ? { recipient: "Keluarga Aiden (Contoh)", address: "Jl. Bintang Kecil No. 3, Kota Contoh 00000" } : safari ? { recipient: "Keluarga Aiden (Contoh)", address: "Jl. Rimba Ceria No. 3, Kota Contoh 00000" } : teddy ? { recipient: "Keluarga Aiden (Contoh)", address: "Jl. Pesta Teddy No. 3, Kota Contoh 00000" } : null,
  };
}
