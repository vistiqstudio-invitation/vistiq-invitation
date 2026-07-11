import type { InvitationData } from "@/types/invitation";

// Cover photos vary by theme so the demo picker doesn't show the same
// image eight times over. All photos are either original theme assets or
// free-to-use stock photos (Pexels License - free for commercial use, no
// attribution required); see public/photos/README for sourcing notes.
const COVER_BY_THEME: Record<string, string> = {
  "luxury-gold": "/photos/luxury-bride.jpg",
  "royal-black": "/photos/black-bride.jpg",
  "islamic-green": "/photos/green-cover.jpg",
  "emerald-lantern": "/photos/lantern-cover.jpg",
  "minimal-white": "/photos/white-cover.jpg",
  "floral-garden": "/photos/garden-tree.jpg",
  sakura: "/photos/garden-carry.jpg",
  rustic: "/photos/rustic-cover.jpg",
  bohemian: "/photos/boho-cover.jpg",
  "modern-elegant": "/photos/modern-bride.jpg",
  "royal-imperial": "/photos/imperial-cover.jpg",
  // Reuses an existing floral-garden gallery shot (not garden-tree.jpg,
  // which floral-garden already uses as its own cover) so the two themes
  // don't show an identical cover photo side by side in the demo grid.
  "vintage-botanical": "/photos/floral-gallery-1.jpg",
  // Reuses an existing minimal-white shot, different from the one
  // minimal-white uses as its own cover, so the two don't look identical
  // side by side in the demo grid.
  "pastel-studio": "/photos/white-gallery-1.jpg",
  // Reuses an existing royal-black gallery shot (not black-bride.jpg,
  // which royal-black uses as its own cover) so the two dark/gold themes
  // don't show an identical cover photo side by side in the demo grid.
  "art-deco-glam": "/photos/black-gallery-1.jpg",
  // Reuses bohemian's groom portrait (a solo golden-hour field shot) as
  // the cover instead of bohemian's own boho-cover.jpg, so the two
  // golden-hour themes don't show an identical cover photo in the demo
  // grid. Matches the existing convention (several themes already reuse
  // their own bride/groom portrait as the cover image).
  "golden-romance": "/photos/boho-groom.jpg",
};

// Couple portrait photos also vary by theme - the default luxury-gold
// portraits are dark with a gold ornate frame baked into the image, which
// clashes with lighter/pastel themes. Themes not listed here fall back to
// the luxury-gold portraits.
const GROOM_PHOTO_BY_THEME: Record<string, string> = {
  sakura: "/photos/sakura-groom.jpg",
  "luxury-gold": "/photos/luxury-groom.jpg",
  "islamic-green": "/photos/green-groom.jpg",
  "royal-black": "/photos/black-groom.jpg",
  "floral-garden": "/photos/floral-groom.jpg",
  "emerald-lantern": "/photos/lantern-groom.jpg",
  "minimal-white": "/photos/white-groom.jpg",
  rustic: "/photos/rustic-groom.jpg",
  bohemian: "/photos/boho-groom.jpg",
  "modern-elegant": "/photos/modern-groom.jpg",
  "royal-imperial": "/photos/imperial-groom.jpg",
  "vintage-botanical": "/photos/floral-groom.jpg",
  "pastel-studio": "/photos/white-groom.jpg",
  "art-deco-glam": "/photos/black-groom.jpg",
  "golden-romance": "/photos/boho-groom.jpg",
};

const BRIDE_PHOTO_BY_THEME: Record<string, string> = {
  sakura: "/photos/sakura-bride.jpg",
  "luxury-gold": "/photos/luxury-bride.jpg",
  "islamic-green": "/photos/green-bride.jpg",
  "royal-black": "/photos/black-bride.jpg",
  "floral-garden": "/photos/floral-bride.jpg",
  "emerald-lantern": "/photos/lantern-bride.jpg",
  "minimal-white": "/photos/white-bride.jpg",
  rustic: "/photos/rustic-bride.jpg",
  bohemian: "/photos/boho-bride.jpg",
  "modern-elegant": "/photos/modern-bride.jpg",
  "royal-imperial": "/photos/imperial-bride.jpg",
  "vintage-botanical": "/photos/floral-bride.jpg",
  "pastel-studio": "/photos/white-bride.jpg",
  // Uses modern-elegant's bride portrait (a moody dark-blazer studio
  // shot with a gold staircase backdrop) rather than royal-black's, so
  // the bride/groom pairing isn't visually identical to royal-black's.
  "art-deco-glam": "/photos/modern-bride.jpg",
  "golden-romance": "/photos/boho-bride.jpg",
};

// Gallery photos also vary by theme so the "Our Moments" slider matches each
// theme's mood instead of showing the same six generic photos everywhere.
// Themes not listed here fall back to the shared /gallery/*.jpg placeholders.
const GALLERY_BY_THEME: Record<string, string[]> = {
  "luxury-gold": [
    "/photos/luxury-gallery-1.jpg",
    "/photos/luxury-gallery-2.jpg",
    "/photos/luxury-gallery-3.jpg",
    "/photos/luxury-gallery-4.jpg",
    "/photos/luxury-gallery-5.jpg",
    "/photos/luxury-gallery-6.jpg",
  ],
  "minimal-white": [
    "/photos/white-gallery-1.jpg",
    "/photos/white-gallery-2.jpg",
    "/photos/white-gallery-3.jpg",
    "/photos/white-gallery-4.jpg",
    "/photos/white-gallery-5.jpg",
    "/photos/white-gallery-6.jpg",
  ],
  "islamic-green": [
    "/photos/green-gallery-1.jpg",
    "/photos/green-gallery-2.jpg",
    "/photos/green-gallery-3.jpg",
    "/photos/green-gallery-4.jpg",
    "/photos/green-gallery-5.jpg",
    "/photos/green-gallery-6.jpg",
  ],
  "royal-black": [
    "/photos/black-gallery-1.jpg",
    "/photos/black-gallery-2.jpg",
    "/photos/black-gallery-3.jpg",
    "/photos/black-gallery-4.jpg",
    "/photos/black-gallery-5.jpg",
    "/photos/black-gallery-6.jpg",
  ],
  "floral-garden": [
    "/photos/floral-gallery-1.jpg",
    "/photos/floral-gallery-2.jpg",
    "/photos/floral-gallery-3.jpg",
    "/photos/floral-gallery-4.jpg",
    "/photos/floral-gallery-5.jpg",
    "/photos/floral-gallery-6.jpg",
  ],
  "emerald-lantern": [
    "/photos/lantern-gallery-1.jpg",
    "/photos/lantern-gallery-2.jpg",
    "/photos/lantern-gallery-3.jpg",
    "/photos/lantern-gallery-4.jpg",
    "/photos/lantern-gallery-5.jpg",
    "/photos/lantern-gallery-6.jpg",
  ],
  sakura: [
    "/photos/sakura-gallery-1.jpg",
    "/photos/sakura-gallery-2.jpg",
    "/photos/sakura-gallery-3.jpg",
    "/photos/sakura-gallery-4.jpg",
    "/photos/sakura-gallery-5.jpg",
    "/photos/sakura-gallery-6.jpg",
  ],
  rustic: [
    "/photos/rustic-gallery-1.jpg",
    "/photos/rustic-gallery-2.jpg",
    "/photos/rustic-gallery-3.jpg",
    "/photos/rustic-gallery-4.jpg",
    "/photos/rustic-gallery-5.jpg",
    "/photos/rustic-gallery-6.jpg",
  ],
  // Reuses floral-garden's gallery shots (skipping #1, used as this
  // theme's cover above) plus its garden-tree cover photo, so no photo
  // is sourced newly - just reused in a different combination/order.
  "vintage-botanical": [
    "/photos/floral-gallery-2.jpg",
    "/photos/garden-tree.jpg",
    "/photos/floral-gallery-3.jpg",
    "/photos/floral-gallery-4.jpg",
    "/photos/floral-gallery-5.jpg",
    "/photos/floral-gallery-6.jpg",
  ],
  // Reuses minimal-white's gallery shots (skipping #1, used as this
  // theme's cover above) plus its white-cover photo, same reuse pattern
  // as vintage-botanical above.
  "pastel-studio": [
    "/photos/white-gallery-2.jpg",
    "/photos/white-cover.jpg",
    "/photos/white-gallery-3.jpg",
    "/photos/white-gallery-4.jpg",
    "/photos/white-gallery-5.jpg",
    "/photos/white-gallery-6.jpg",
  ],
  // Reuses royal-black's gallery shots (skipping #1, used as this
  // theme's cover above) plus one luxury-gold gallery shot standing in
  // for black-bride.jpg, same reuse pattern as the themes above.
  "art-deco-glam": [
    "/photos/black-gallery-2.jpg",
    "/photos/luxury-gallery-1.jpg",
    "/photos/black-gallery-3.jpg",
    "/photos/black-gallery-4.jpg",
    "/photos/black-gallery-5.jpg",
    "/photos/black-gallery-6.jpg",
  ],
  // Bohemian has no dedicated gallery set of its own (falls back to the
  // generic placeholders), so this reuses rustic's warm-toned gallery
  // shots instead - a still-unused-as-a-donor set that fits the same
  // golden-hour warmth without duplicating any other theme's gallery.
  "golden-romance": [
    "/photos/rustic-gallery-1.jpg",
    "/photos/rustic-gallery-2.jpg",
    "/photos/rustic-gallery-3.jpg",
    "/photos/rustic-gallery-4.jpg",
    "/photos/rustic-gallery-5.jpg",
    "/photos/rustic-gallery-6.jpg",
  ],
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

    brand: null,

    coverImage: COVER_BY_THEME[theme] || "/themes/luxury-gold/cover.png",
    musicUrl: "/music/wedding2.mp3",
    videoUrl: null,

    mapsUrl: "https://maps.google.com",
    mapsEmbedUrl: "https://www.google.com/maps?q=Jakarta&output=embed",

    groom: {
      name: "Rizky Pratama",
      parents: "Bapak Yusuf & Ibu Fatimah",
      photo: GROOM_PHOTO_BY_THEME[theme] || "/themes/luxury-gold/groom.png",
      instagram: "rizkypratama",
    },

    bride: {
      name: "Nabila Putri",
      parents: "Bapak Ahmad & Ibu Siti",
      photo: BRIDE_PHOTO_BY_THEME[theme] || "/themes/luxury-gold/bride.png",
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

    gallery: GALLERY_BY_THEME[theme] || [
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
