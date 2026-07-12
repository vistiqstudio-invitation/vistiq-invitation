import type { InvitationData } from "@/types/invitation";

// Cover photos vary by theme so the demo picker doesn't show the same
// image eight times over. All photos are either original theme assets or
// free-to-use stock photos (Pexels License - free for commercial use, no
// attribution required); see public/photos/README for sourcing notes.
const COVER_BY_THEME: Record<string, string> = {
  "luxury-gold": "/photos/luxury-cover.png",
  "royal-black": "/photos/black-cover.png",
  "islamic-green": "/photos/green-cover.png",
  "emerald-lantern": "/photos/lantern-cover.jpg",
  "minimal-white": "/photos/white-cover.png",
  "floral-garden": "/photos/floral-cover.png",
  sakura: "/photos/garden-carry.jpg",
  rustic: "/photos/rustic-cover.jpg",
  bohemian: "/photos/boho-cover.jpg",
  "modern-elegant": "/photos/modern-bride.jpg",
  "royal-imperial": "/photos/imperial-cover.jpg",
  // Reuses an existing floral-garden gallery shot (still the old stock
  // floral-gallery-1.jpg, untouched - floral-garden itself now uses a
  // dedicated floral-cover.png) so the two themes don't show an identical
  // cover photo side by side in the demo grid.
  "vintage-botanical": "/photos/floral-gallery-1.jpg",
  // Reuses an existing minimal-white shot, different from the one
  // minimal-white uses as its own cover, so the two don't look identical
  // side by side in the demo grid.
  "pastel-studio": "/photos/white-gallery-1.jpg",
  // Reuses royal-black's old stock cover shot (royal-black itself now
  // uses its own dedicated black-cover.png) so the two dark/gold themes
  // don't show an identical cover photo side by side in the demo grid.
  "art-deco-glam": "/photos/black-gallery-1.jpg",
  // Reuses bohemian's groom portrait (a solo golden-hour field shot) as
  // the cover instead of bohemian's own boho-cover.jpg, so the two
  // golden-hour themes don't show an identical cover photo in the demo
  // grid. Matches the existing convention (several themes already reuse
  // their own bride/groom portrait as the cover image).
  "golden-romance": "/photos/boho-groom.jpg",
  // Reuses one of luxury-gold's own gallery shots (not luxury-cover.png,
  // which luxury-gold already uses as its own cover) so the two themes
  // don't show an identical cover photo side by side in the demo grid.
  // The luxury-* photos happen to be genuine Minang wedding photography
  // (suntiang headdress, marun-gold songket), a perfect match for this
  // theme even though luxury-gold itself is styled as a generic glam
  // theme rather than an adat one.
  "adat-minang": "/photos/luxury-gallery-1.png",
  // Placeholder only - no owner-supplied Bugis photography yet. Reuses
  // emerald-lantern's cool jade-toned night garden shots (not yet a
  // donor for any other theme) since they're a reasonable palette match
  // for this theme's teal-and-gold colors. Replace once real Adat Bugis
  // photos are supplied.
  "adat-bugis": "/photos/lantern-cover.jpg",
};

// Couple portrait photos also vary by theme - the default luxury-gold
// portraits are dark with a gold ornate frame baked into the image, which
// clashes with lighter/pastel themes. Themes not listed here fall back to
// the luxury-gold portraits.
const GROOM_PHOTO_BY_THEME: Record<string, string> = {
  sakura: "/photos/sakura-groom.jpg",
  "luxury-gold": "/photos/luxury-groom.png",
  "islamic-green": "/photos/green-groom.png",
  "royal-black": "/photos/black-groom.png",
  "floral-garden": "/photos/floral-groom.png",
  "emerald-lantern": "/photos/lantern-groom.jpg",
  "minimal-white": "/photos/white-groom.png",
  rustic: "/photos/rustic-groom.jpg",
  bohemian: "/photos/boho-groom.jpg",
  "modern-elegant": "/photos/modern-groom.jpg",
  "royal-imperial": "/photos/imperial-groom.jpg",
  "vintage-botanical": "/photos/floral-groom.png",
  "pastel-studio": "/photos/white-groom.png",
  "art-deco-glam": "/photos/black-groom.png",
  "golden-romance": "/photos/boho-groom.jpg",
  "adat-minang": "/photos/luxury-groom.png",
  "adat-bugis": "/photos/lantern-groom.jpg",
};

const BRIDE_PHOTO_BY_THEME: Record<string, string> = {
  sakura: "/photos/sakura-bride.jpg",
  "luxury-gold": "/photos/luxury-bride.png",
  "islamic-green": "/photos/green-bride.png",
  "royal-black": "/photos/black-bride.png",
  "floral-garden": "/photos/floral-bride.png",
  "emerald-lantern": "/photos/lantern-bride.jpg",
  "minimal-white": "/photos/white-bride.png",
  rustic: "/photos/rustic-bride.jpg",
  bohemian: "/photos/boho-bride.jpg",
  "modern-elegant": "/photos/modern-bride.jpg",
  "royal-imperial": "/photos/imperial-bride.jpg",
  "vintage-botanical": "/photos/floral-bride.png",
  "pastel-studio": "/photos/white-bride.png",
  // Uses modern-elegant's bride portrait (a moody dark-blazer studio
  // shot with a gold staircase backdrop) rather than royal-black's, so
  // the bride/groom pairing isn't visually identical to royal-black's.
  "art-deco-glam": "/photos/modern-bride.jpg",
  "golden-romance": "/photos/boho-bride.jpg",
  "adat-minang": "/photos/luxury-bride.png",
  "adat-bugis": "/photos/lantern-bride.jpg",
};

// Gallery photos also vary by theme so the "Our Moments" slider matches each
// theme's mood instead of showing the same six generic photos everywhere.
// Themes not listed here fall back to the shared /gallery/*.jpg placeholders.
const GALLERY_BY_THEME: Record<string, string[]> = {
  "luxury-gold": [
    "/photos/luxury-gallery-1.png",
    "/photos/luxury-gallery-2.png",
    "/photos/luxury-gallery-3.png",
    "/photos/luxury-gallery-4.png",
    "/photos/luxury-gallery-5.png",
    "/photos/luxury-gallery-6.png",
  ],
  // Only 3 real photos were supplied for this theme's gallery (not the
  // usual 6) - numbered 7-9 to avoid colliding with white-gallery-1..6.jpg,
  // which pastel-studio below still depends on.
  "minimal-white": [
    "/photos/white-gallery-7.png",
    "/photos/white-gallery-8.png",
    "/photos/white-gallery-9.png",
  ],
  "islamic-green": [
    "/photos/green-gallery-1.png",
    "/photos/green-gallery-2.png",
    "/photos/green-gallery-3.png",
    "/photos/green-gallery-4.png",
    "/photos/green-gallery-5.png",
    "/photos/green-gallery-6.png",
  ],
  // Only 5 real photos were supplied for this theme's gallery (not the
  // usual 6) - numbered 7-11 to avoid colliding with black-gallery-1..6.jpg,
  // which art-deco-glam below still depends on.
  "royal-black": [
    "/photos/black-gallery-7.png",
    "/photos/black-gallery-8.png",
    "/photos/black-gallery-9.png",
    "/photos/black-gallery-10.png",
    "/photos/black-gallery-11.png",
  ],
  // Numbered 7-12 (not 1-6) to avoid colliding with the old
  // floral-gallery-1..6.jpg stock set, which vintage-botanical below
  // still depends on.
  "floral-garden": [
    "/photos/floral-gallery-7.png",
    "/photos/floral-gallery-8.png",
    "/photos/floral-gallery-9.png",
    "/photos/floral-gallery-10.png",
    "/photos/floral-gallery-11.png",
    "/photos/floral-gallery-12.png",
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
  // Reuses minimal-white's old stock gallery shots (skipping #1, used as
  // this theme's cover above) plus its cover photo (now the owner's real
  // photo, since white-cover.jpg was replaced), same reuse pattern as
  // vintage-botanical above.
  "pastel-studio": [
    "/photos/white-gallery-2.jpg",
    "/photos/white-cover.png",
    "/photos/white-gallery-3.jpg",
    "/photos/white-gallery-4.jpg",
    "/photos/white-gallery-5.jpg",
    "/photos/white-gallery-6.jpg",
  ],
  // Reuses royal-black's old stock gallery shots (skipping #1, used as
  // this theme's cover above) plus royal-black's bride shot (now the
  // owner's real photo) standing in for the 6th slot, same reuse
  // pattern as the themes above.
  "art-deco-glam": [
    "/photos/black-gallery-2.jpg",
    "/photos/black-bride.png",
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
  // Reuses luxury-gold's gallery shots (skipping #1, used as this theme's
  // cover above) plus luxury-gold's own cover photo, so no photo is
  // sourced newly - just the same real Minang photoshoot in a different
  // combination/order.
  "adat-minang": [
    "/photos/luxury-gallery-2.png",
    "/photos/luxury-cover.png",
    "/photos/luxury-gallery-3.png",
    "/photos/luxury-gallery-4.png",
    "/photos/luxury-gallery-5.png",
    "/photos/luxury-gallery-6.png",
  ],
  // Placeholder only, same as the cover/groom/bride entries above -
  // reuses emerald-lantern's gallery until real Adat Bugis photos exist.
  "adat-bugis": [
    "/photos/lantern-gallery-1.jpg",
    "/photos/lantern-gallery-2.jpg",
    "/photos/lantern-gallery-3.jpg",
    "/photos/lantern-gallery-4.jpg",
    "/photos/lantern-gallery-5.jpg",
    "/photos/lantern-gallery-6.jpg",
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
