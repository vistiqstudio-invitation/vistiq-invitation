import type { InvitationData } from "@/types/invitation";
import { DEFAULT_WEDDING_VOCAL_TRACK, WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";
import { WEDDING_COVER_BY_THEME } from "@/lib/themeCoverImages";
import { optimizedDemoImage, optimizedDemoImages } from "@/lib/optimizedDemoImage";

export const COVER_BY_THEME = Object.fromEntries(
  Object.entries(WEDDING_COVER_BY_THEME).map(([theme, source]) => [theme, optimizedDemoImage(source)]),
);

// Couple portrait photos also vary by theme - the default luxury-gold
// portraits are dark with a gold ornate frame baked into the image, which
// clashes with lighter/pastel themes. Themes not listed here fall back to
// the luxury-gold portraits.
const GROOM_PHOTO_BY_THEME: Record<string, string> = {
  "princess-fairytale": "/photos/romance-groom.webp",
  sakura: "/photos/sakura-groom.webp",
  "luxury-gold": "/photos/luxury-groom.webp",
  "islamic-green": "/photos/green-groom.webp",
  "velora-editorial": "/themes/velora-editorial/ai-groom.jpg",
  "floral-garden": "/photos/floral-groom.webp",
  "emerald-lantern": "/photos/lantern-groom.webp",
  "minimal-white": "/photos/white-groom.webp",
  rustic: "/photos/rustic-groom.webp",
  bohemian: "/photos/boho-groom.webp",
  "modern-elegant": "/photos/modern-groom.webp",
  "royal-imperial": "/photos/imperial-groom.webp",
  "vintage-botanical": "/photos/botanical-groom.webp",
  "pastel-studio": "/photos/pastel-groom.webp",
  "art-deco-glam": "/photos/deco-groom.webp",
  "golden-romance": "/photos/romance-groom.webp",
  "adat-jawa": "/photos/jawa-groom.webp",
  "adat-minang": "/photos/luxury-groom.webp",
  "adat-bugis": "/photos/lantern-groom.webp",
  "menara-cahaya": "/photos/imperial-groom.webp",
  santorini: "/photos/white-groom.webp",
  "jawa-merah": "/photos/jawa-groom.webp",
  "royal-java": "/photos/jawa-groom.webp",
  "luxury-art-java-heritage": "/photos/luxury-sage-groom.webp",
  "luxury-art-sakura": "/photos/sakura-groom.webp",
  "jawa-coklat": "/photos/jawa-groom.webp",
  "jawa-sepia": "/photos/jawa-groom.webp",
  "sage-green": "/photos/floral-groom.webp",
  sahara: "/photos/rustic-groom.webp",
  "adat-bali": "/photos/adat-bali-groom.webp",
  "adat-sunda": "/photos/adat-sunda-groom.webp",
};

const BRIDE_PHOTO_BY_THEME: Record<string, string> = {
  "princess-fairytale": "/photos/romance-bride.webp",
  sakura: "/photos/sakura-bride.webp",
  "luxury-gold": "/photos/luxury-bride.webp",
  "islamic-green": "/photos/green-bride.webp",
  "velora-editorial": "/themes/velora-editorial/ai-bride.jpg",
  "floral-garden": "/photos/floral-bride.webp",
  "emerald-lantern": "/photos/lantern-bride.webp",
  "minimal-white": "/photos/white-bride.webp",
  rustic: "/photos/rustic-bride.webp",
  bohemian: "/photos/boho-bride.webp",
  "modern-elegant": "/photos/modern-bride.webp",
  "royal-imperial": "/photos/imperial-bride.webp",
  "vintage-botanical": "/photos/botanical-bride.webp",
  "pastel-studio": "/photos/pastel-bride.webp",
  "art-deco-glam": "/photos/deco-bride.webp",
  "golden-romance": "/photos/romance-bride.webp",
  "adat-jawa": "/photos/jawa-bride.webp",
  "adat-bali": "/photos/adat-bali-bride.webp",
  "adat-sunda": "/photos/adat-sunda-bride.webp",
  "adat-minang": "/photos/luxury-bride.webp",
  "adat-bugis": "/photos/lantern-bride.webp",
  "menara-cahaya": "/photos/imperial-bride.webp",
  santorini: "/photos/white-bride.webp",
  "jawa-merah": "/photos/jawa-bride.webp",
  "royal-java": "/photos/jawa-bride.webp",
  "luxury-art-java-heritage": "/photos/luxury-sage-bride.webp",
  "luxury-art-sakura": "/photos/sakura-bride.webp",
  "jawa-coklat": "/photos/jawa-bride.webp",
  "jawa-sepia": "/photos/jawa-bride.webp",
  "sage-green": "/photos/floral-bride.webp",
  sahara: "/photos/rustic-bride.webp",
};

// Gallery photos also vary by theme so the "Our Moments" slider matches each
// theme's mood instead of showing the same six generic photos everywhere.
// Themes not listed here fall back to the shared /gallery/*.jpg placeholders.
const GALLERY_BY_THEME: Record<string, string[]> = {
  "princess-fairytale": [
    "/photos/romance-gallery-1.webp",
    "/photos/romance-gallery-2.webp",
    "/photos/romance-gallery-3.webp",
    "/photos/romance-gallery-4.webp",
    "/photos/romance-gallery-5.webp",
    "/photos/romance-gallery-6.webp",
  ],
  "luxury-gold": [
    "/photos/luxury-gallery-1.webp",
    "/photos/luxury-gallery-2.webp",
    "/photos/luxury-gallery-3.webp",
    "/photos/luxury-gallery-4.webp",
    "/photos/luxury-gallery-5.webp",
    "/photos/luxury-gallery-6.webp",
  ],
  // Only 3 real photos were supplied for this theme's gallery (not the
  // usual 6) - numbered 7-9 to avoid colliding with white-gallery-1..6.jpg,
  // which santorini below still depends on as a placeholder.
  "minimal-white": [
    "/photos/white-gallery-7.webp",
    "/photos/white-gallery-8.webp",
    "/photos/white-gallery-9.webp",
  ],
  "islamic-green": [
    "/photos/green-gallery-1.webp",
    "/photos/green-gallery-2.webp",
    "/photos/green-gallery-3.webp",
    "/photos/green-gallery-4.webp",
    "/photos/green-gallery-5.webp",
    "/photos/green-gallery-6.webp",
  ],
  "velora-editorial": [
    "/themes/velora-editorial/ai-gallery-01.jpg",
    "/themes/velora-editorial/ai-gallery-02.jpg",
    "/themes/velora-editorial/ai-gallery-03.jpg",
    "/themes/velora-editorial/ai-gallery-04.jpg",
    "/themes/velora-editorial/ai-gallery-05.jpg",
    "/themes/velora-editorial/ai-footer.jpg",
    "/themes/velora-editorial/ai-cover.jpg",
    "/themes/velora-editorial/ai-groom.jpg",
    "/themes/velora-editorial/ai-bride.jpg",
  ],
  // Numbered 7-12 (not 1-6) - the old floral-gallery-1..6.jpg stock set
  // was deleted once vintage-botanical moved to its own real photography.
  "floral-garden": [
    "/photos/floral-gallery-7.webp",
    "/photos/floral-gallery-8.webp",
    "/photos/floral-gallery-9.webp",
    "/photos/floral-gallery-10.webp",
    "/photos/floral-gallery-11.webp",
    "/photos/floral-gallery-12.webp",
  ],
  "emerald-lantern": [
    "/photos/lantern-gallery-1.webp",
    "/photos/lantern-gallery-2.webp",
    "/photos/lantern-gallery-3.webp",
    "/photos/lantern-gallery-4.webp",
    "/photos/lantern-gallery-5.webp",
    "/photos/lantern-gallery-6.webp",
  ],
  sakura: [
    "/photos/sakura-gallery-1.webp",
    "/photos/sakura-gallery-2.webp",
    "/photos/sakura-gallery-3.webp",
    "/photos/sakura-gallery-4.webp",
    "/photos/sakura-gallery-5.webp",
    "/photos/sakura-gallery-6.webp",
  ],
  // Numbered 7-12 (not 1-6) - the old rustic-gallery-1..6.jpg stock set
  // was deleted once golden-romance moved to its own real photography.
  rustic: [
    "/photos/rustic-gallery-7.webp",
    "/photos/rustic-gallery-8.webp",
    "/photos/rustic-gallery-9.webp",
    "/photos/rustic-gallery-10.webp",
    "/photos/rustic-gallery-11.webp",
    "/photos/rustic-gallery-12.webp",
  ],
  bohemian: [
    "/photos/boho-gallery-1.webp",
    "/photos/boho-gallery-2.webp",
    "/photos/boho-gallery-3.webp",
    "/photos/boho-gallery-4.webp",
    "/photos/boho-gallery-5.webp",
    "/photos/boho-gallery-6.webp",
  ],
  "modern-elegant": [
    "/photos/modern-gallery-1.webp",
    "/photos/modern-gallery-2.webp",
    "/photos/modern-gallery-3.webp",
    "/photos/modern-gallery-4.webp",
    "/photos/modern-gallery-5.webp",
    "/photos/modern-gallery-6.webp",
  ],
  "royal-imperial": [
    "/photos/imperial-gallery-1.webp",
    "/photos/imperial-gallery-2.webp",
    "/photos/imperial-gallery-3.webp",
    "/photos/imperial-gallery-4.webp",
    "/photos/imperial-gallery-5.webp",
    "/photos/imperial-gallery-6.webp",
  ],
  "adat-jawa": [
    "/photos/jawa-gallery-1.webp",
    "/photos/jawa-gallery-2.webp",
    "/photos/jawa-gallery-3.webp",
    "/photos/jawa-gallery-4.webp",
    "/photos/jawa-gallery-5.webp",
    "/photos/jawa-gallery-6.webp",
  ],
  "vintage-botanical": [
    "/photos/botanical-gallery-1.webp",
    "/photos/botanical-gallery-2.webp",
    "/photos/botanical-gallery-3.webp",
    "/photos/botanical-gallery-4.webp",
    "/photos/botanical-gallery-5.webp",
    "/photos/botanical-gallery-6.webp",
  ],
  "pastel-studio": [
    "/photos/pastel-gallery-1.webp",
    "/photos/pastel-gallery-2.webp",
    "/photos/pastel-gallery-3.webp",
    "/photos/pastel-gallery-4.webp",
    "/photos/pastel-gallery-5.webp",
    "/photos/pastel-gallery-6.webp",
  ],
  "art-deco-glam": [
    "/photos/deco-gallery-1.webp",
    "/photos/deco-gallery-2.webp",
    "/photos/deco-gallery-3.webp",
    "/photos/deco-gallery-4.webp",
    "/photos/deco-gallery-5.webp",
    "/photos/deco-gallery-6.webp",
  ],
  "golden-romance": [
    "/photos/romance-gallery-1.webp",
    "/photos/romance-gallery-2.webp",
    "/photos/romance-gallery-3.webp",
    "/photos/romance-gallery-4.webp",
    "/photos/romance-gallery-5.webp",
    "/photos/romance-gallery-6.webp",
  ],
  // Reuses luxury-gold's gallery shots (skipping #1, used as this theme's
  // cover above) plus luxury-gold's own cover photo, so no photo is
  // sourced newly - just the same real Minang photoshoot in a different
  // combination/order.
  "adat-minang": [
    "/photos/luxury-gallery-2.webp",
    "/photos/luxury-cover.webp",
    "/photos/luxury-gallery-3.webp",
    "/photos/luxury-gallery-4.webp",
    "/photos/luxury-gallery-5.webp",
    "/photos/luxury-gallery-6.webp",
  ],
  // Placeholder only, same as the cover/groom/bride entries above -
  // reuses emerald-lantern's gallery until real Adat Bugis photos exist.
  "adat-bugis": [
    "/photos/lantern-gallery-1.webp",
    "/photos/lantern-gallery-2.webp",
    "/photos/lantern-gallery-3.webp",
    "/photos/lantern-gallery-4.webp",
    "/photos/lantern-gallery-5.webp",
    "/photos/lantern-gallery-6.webp",
  ],
  // Reuses royal-imperial's real gallery wholesale, same as the
  // cover/groom/bride entries above - no dedicated mosque-architecture
  // photos supplied yet.
  "menara-cahaya": [
    "/photos/imperial-gallery-1.webp",
    "/photos/imperial-gallery-2.webp",
    "/photos/imperial-gallery-3.webp",
    "/photos/imperial-gallery-4.webp",
    "/photos/imperial-gallery-5.webp",
    "/photos/imperial-gallery-6.webp",
  ],
  // Placeholder only, same as the cover/groom/bride entries above -
  // reuses the old white-gallery-1..6.jpg stock (also used by
  // pastel-studio) until real photos are supplied for this theme.
  santorini: [
    "/photos/white-gallery-1.jpg",
    "/photos/white-gallery-2.jpg",
    "/photos/white-gallery-3.jpg",
    "/photos/white-gallery-4.jpg",
    "/photos/white-gallery-5.jpg",
    "/photos/white-gallery-6.jpg",
  ],
  // Placeholder only, same as the cover/groom/bride entries above -
  // reuses adat-jawa's real gallery (skipping #1, used as this theme's
  // cover above) plus adat-jawa's own cover photo, so no photo is
  // sourced newly - just the same Javanese photoshoot in a different
  // combination/order. Replace once real photos exist.
  "jawa-merah": [
    "/photos/jawa-gallery-2.webp",
    "/photos/jawa-cover.webp",
    "/photos/jawa-gallery-3.webp",
    "/photos/jawa-gallery-4.webp",
    "/photos/jawa-gallery-5.webp",
    "/photos/jawa-gallery-6.webp",
  ],
  "royal-java": [
    "/photos/jawa-gallery-1.webp",
    "/photos/jawa-gallery-2.webp",
    "/photos/jawa-gallery-3.webp",
    "/photos/jawa-gallery-4.webp",
    "/photos/jawa-gallery-5.webp",
    "/photos/jawa-gallery-6.webp",
  ],
  "luxury-art-java-heritage": [
    "/photos/luxury-sage-cover.webp",
    "/photos/luxury-sage-gallery-garden.webp",
    "/photos/luxury-sage-gallery-seated.webp",
    "/photos/luxury-sage-bride.webp",
    "/photos/luxury-sage-gallery-close.webp",
    "/photos/luxury-sage-groom.webp",
    "/photos/luxury-sage-gallery-back.webp",
  ],
  "luxury-art-sakura": [
    "/photos/sakura-gallery-1.webp",
    "/photos/sakura-gallery-2.webp",
    "/photos/sakura-gallery-3.webp",
    "/photos/sakura-gallery-4.webp",
    "/photos/sakura-gallery-5.webp",
    "/photos/sakura-gallery-6.webp",
  ],
  // Placeholder only, same reasoning as jawa-merah above - same
  // Javanese photoshoot, different ordering (skips gallery-4, used as
  // this theme's own cover above) so the picker thumbnails don't match
  // exactly. Replace once real photos exist.
  "jawa-coklat": [
    "/photos/jawa-gallery-1.webp",
    "/photos/jawa-gallery-2.webp",
    "/photos/jawa-cover.webp",
    "/photos/jawa-gallery-3.webp",
    "/photos/jawa-gallery-5.webp",
    "/photos/jawa-gallery-6.webp",
  ],
  "jawa-sepia": [
    "/photos/jawa-gallery-1.webp",
    "/photos/jawa-gallery-2.webp",
    "/photos/jawa-gallery-3.webp",
    "/photos/jawa-gallery-4.webp",
    "/photos/jawa-gallery-5.webp",
    "/photos/jawa-gallery-6.webp",
  ],
  // Placeholder only, same reasoning as the cover/groom/bride entries
  // above - reuses floral-garden's real gallery wholesale until real
  // sage-green photos are supplied.
  "sage-green": [
    "/photos/floral-gallery-7.webp",
    "/photos/floral-gallery-8.webp",
    "/photos/floral-gallery-9.webp",
    "/photos/floral-gallery-10.webp",
    "/photos/floral-gallery-11.webp",
    "/photos/floral-gallery-12.webp",
  ],
  // Placeholder only, same reasoning as the cover/groom/bride entries
  // above - reuses rustic's real gallery wholesale until real sahara
  // photos are supplied.
  sahara: [
    "/photos/rustic-gallery-7.webp",
    "/photos/rustic-gallery-8.webp",
    "/photos/rustic-gallery-9.webp",
    "/photos/rustic-gallery-10.webp",
    "/photos/rustic-gallery-11.webp",
    "/photos/rustic-gallery-12.webp",
  ],
  "adat-bali": [
    "/photos/adat-bali-gallery-1.webp",
    "/photos/adat-bali-gallery-2.webp",
    "/photos/adat-bali-gallery-3.webp",
    "/photos/adat-bali-gallery-4.webp",
    "/photos/adat-bali-gallery-5.webp",
    "/photos/adat-bali-gallery-6.webp",
  ],
  "adat-sunda": [
    "/photos/adat-sunda-gallery-1.webp",
    "/photos/adat-sunda-gallery-2.webp",
    "/photos/adat-sunda-gallery-3.webp",
    "/photos/adat-sunda-gallery-4.webp",
    "/photos/adat-sunda-gallery-5.webp",
    "/photos/adat-sunda-gallery-6.webp",
  ],
};

// Every wedding demo uses a vocal song. Tracks still vary by theme, but the
// allowlist below intentionally excludes instrumental-only music.
const MUSIC_BY_THEME: Record<string, string> = {
  "luxury-gold": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "minimal-white": WEDDING_VOCAL_TRACKS.englishBallad,
  "islamic-green": WEDDING_VOCAL_TRACKS.islamicPrayer,
  "velora-editorial": WEDDING_VOCAL_TRACKS.englishBallad,
  "floral-garden": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "emerald-lantern": WEDDING_VOCAL_TRACKS.englishBallad,
  sakura: WEDDING_VOCAL_TRACKS.englishBallad,
  rustic: WEDDING_VOCAL_TRACKS.indonesianBallad,
  bohemian: WEDDING_VOCAL_TRACKS.englishBallad,
  "modern-elegant": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "royal-imperial": WEDDING_VOCAL_TRACKS.englishBallad,
  "adat-jawa": WEDDING_VOCAL_TRACKS.islamicRomance,
  "royal-java": WEDDING_VOCAL_TRACKS.islamicRomance,
  "luxury-art-java-heritage": WEDDING_VOCAL_TRACKS.islamicRomance,
  "luxury-art-sakura": WEDDING_VOCAL_TRACKS.englishBallad,
  "adat-bali": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "adat-sunda": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "adat-minang": WEDDING_VOCAL_TRACKS.minangWedding,
  "adat-bugis": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "menara-cahaya": WEDDING_VOCAL_TRACKS.islamicPrayer,
  santorini: WEDDING_VOCAL_TRACKS.englishBallad,
  "vintage-botanical": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "pastel-studio": WEDDING_VOCAL_TRACKS.englishBallad,
  "art-deco-glam": WEDDING_VOCAL_TRACKS.englishBallad,
  "golden-romance": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "jawa-merah": WEDDING_VOCAL_TRACKS.islamicRomance,
  "jawa-coklat": WEDDING_VOCAL_TRACKS.islamicRomance,
  "jawa-sepia": WEDDING_VOCAL_TRACKS.islamicRomance,
  "sage-green": WEDDING_VOCAL_TRACKS.indonesianBallad,
  sahara: WEDDING_VOCAL_TRACKS.islamicPrayer,
  "midnight-aurora": WEDDING_VOCAL_TRACKS.englishBallad,
  "luxury-art-garden": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "porcelain-bloom": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "love-chronicle": WEDDING_VOCAL_TRACKS.indonesianBallad,
  "velvet-cinema": WEDDING_VOCAL_TRACKS.englishBallad,
  "prismatic-vows": WEDDING_VOCAL_TRACKS.englishBallad,
  "pearl-tide": WEDDING_VOCAL_TRACKS.englishBallad,
};

// One shared sample invitation used to demo every theme. Only the `theme`,
// `slug`, `coverImage`, and `musicUrl` fields change per theme - the rest is
// identical on purpose, so switching themes in the picker is an
// apples-to-apples comparison.
export function getDemoInvitation(theme: string): InvitationData {
  return {
    id: 0,
    slug: `demo-${theme}`,
    theme,
    status: "active",
    category: "wedding",

    brand: null,

    coverImage: optimizedDemoImage(COVER_BY_THEME[theme] || "/themes/luxury-gold/cover.png"),
    musicUrl: MUSIC_BY_THEME[theme] || DEFAULT_WEDDING_VOCAL_TRACK,
    videoUrl: null,

    mapsUrl: "https://maps.google.com",
    mapsEmbedUrl: "https://www.google.com/maps?q=Jakarta&output=embed",

    opening: { greeting: null, title: null, description: null, quote: null, quoteSource: null },

    groom: {
      name: "Rizky Pratama",
      nickname: "Rizky",
      parents: "Bapak Yusuf & Ibu Fatimah",
      photo: optimizedDemoImage(GROOM_PHOTO_BY_THEME[theme] || "/themes/luxury-gold/groom.png"),
      instagram: "rizkypratama",
    },

    bride: {
      name: "Nabila Putri",
      nickname: "Nabila",
      parents: "Bapak Ahmad & Ibu Siti",
      photo: optimizedDemoImage(BRIDE_PHOTO_BY_THEME[theme] || "/themes/luxury-gold/bride.png"),
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
        year: "2022",
        title: "Mulai Mengenal",
        description:
          "Percakapan sederhana membawa kami untuk saling mengenal, memahami, dan menemukan banyak kesamaan.",
      },
      {
        year: "2023",
        title: "Menjalin Hubungan",
        description:
          "Setelah semakin dekat, kami memutuskan untuk berjalan bersama dan menjaga hubungan ini dengan serius.",
      },
      {
        year: "2025",
        title: "Hari Lamaran",
        description:
          "Dengan restu kedua keluarga, kami melangkah ke tahap baru melalui sebuah lamaran yang hangat dan penuh doa.",
      },
      {
        year: "2026",
        title: "Menuju Pernikahan",
        description:
          "Kini kami siap mengikat janji suci dan memulai perjalanan baru sebagai pasangan seumur hidup.",
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

    gallery: optimizedDemoImages(GALLERY_BY_THEME[theme] || [
      "/gallery/1.jpg",
      "/gallery/2.jpg",
      "/gallery/3.jpg",
      "/gallery/4.jpg",
      "/gallery/5.jpg",
      "/gallery/6.jpg",
    ]),

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
