import type { InvitationData } from "@/types/invitation";

// Cover photos vary by theme so the demo picker doesn't show the same
// image eight times over. All photos are either original theme assets or
// free-to-use stock photos (Pexels License - free for commercial use, no
// attribution required); see public/photos/README for sourcing notes.
const COVER_BY_THEME: Record<string, string> = {
  "luxury-gold": "/photos/luxury-cover.png",
  "royal-black": "/photos/black-cover.png",
  "islamic-green": "/photos/green-cover.png",
  "emerald-lantern": "/photos/lantern-cover.png",
  "minimal-white": "/photos/white-cover.png",
  "floral-garden": "/photos/floral-cover.png",
  sakura: "/photos/sakura-cover.png",
  rustic: "/photos/rustic-cover.png",
  bohemian: "/photos/boho-cover.png",
  "modern-elegant": "/photos/modern-cover.png",
  "royal-imperial": "/photos/imperial-cover.png",
  "vintage-botanical": "/photos/botanical-cover.png",
  "pastel-studio": "/photos/pastel-cover.png",
  "art-deco-glam": "/photos/deco-cover.png",
  "golden-romance": "/photos/romance-cover.png",
  "adat-jawa": "/photos/jawa-cover.png",
  // Reuses one of luxury-gold's own gallery shots (not luxury-cover.png,
  // which luxury-gold already uses as its own cover) so the two themes
  // don't show an identical cover photo side by side in the demo grid.
  // The luxury-* photos happen to be genuine Minang wedding photography
  // (suntiang headdress, marun-gold songket), a perfect match for this
  // theme even though luxury-gold itself is styled as a generic glam
  // theme rather than an adat one.
  "adat-minang": "/photos/luxury-gallery-1.png",
  // Placeholder only - no owner-supplied Bugis photography yet. Reuses
  // emerald-lantern's real jade-and-gold night garden photoshoot since
  // it's a reasonable palette match for this theme's teal-and-gold
  // colors. Replace once real Adat Bugis photos are supplied.
  "adat-bugis": "/photos/lantern-cover.png",
  // Reuses royal-imperial's real cover shot (maroon-and-gold palace
  // court attire) since its formal dark-and-gold mood is a reasonable
  // match for this theme too - no dedicated mosque-architecture photos
  // supplied yet.
  "menara-cahaya": "/photos/imperial-cover.png",
  // Placeholder only - no owner-supplied photography for this theme
  // yet. Reuses minimal-white's cover (white studio backdrop) since its
  // light, airy tone is the closest match to this theme's white-and-blue
  // palette among the current photo set. Replace once real photos exist.
  santorini: "/photos/white-cover.png",
  // Placeholder only - no owner-supplied photography for this theme yet.
  // Reuses one of adat-jawa's own gallery shots (not jawa-cover.png,
  // which adat-jawa already uses as its own cover) since both themes
  // share a Javanese setting. Replace once real photos exist.
  "jawa-merah": "/photos/jawa-gallery-1.png",
  // Placeholder only - no owner-supplied photography for this theme yet.
  // Same Javanese photoshoot as jawa-merah above (it's the only
  // Javanese-styled real photography in the set), just a different
  // gallery shot as the cover so the two don't show an identical
  // thumbnail side by side in the demo picker. Replace once real
  // photos exist.
  "jawa-coklat": "/photos/jawa-gallery-4.png",
};

// Couple portrait photos also vary by theme - the default luxury-gold
// portraits are dark with a gold ornate frame baked into the image, which
// clashes with lighter/pastel themes. Themes not listed here fall back to
// the luxury-gold portraits.
const GROOM_PHOTO_BY_THEME: Record<string, string> = {
  sakura: "/photos/sakura-groom.png",
  "luxury-gold": "/photos/luxury-groom.png",
  "islamic-green": "/photos/green-groom.png",
  "royal-black": "/photos/black-groom.png",
  "floral-garden": "/photos/floral-groom.png",
  "emerald-lantern": "/photos/lantern-groom.png",
  "minimal-white": "/photos/white-groom.png",
  rustic: "/photos/rustic-groom.png",
  bohemian: "/photos/boho-groom.png",
  "modern-elegant": "/photos/modern-groom.png",
  "royal-imperial": "/photos/imperial-groom.png",
  "vintage-botanical": "/photos/botanical-groom.png",
  "pastel-studio": "/photos/pastel-groom.png",
  "art-deco-glam": "/photos/deco-groom.png",
  "golden-romance": "/photos/romance-groom.png",
  "adat-jawa": "/photos/jawa-groom.png",
  "adat-minang": "/photos/luxury-groom.png",
  "adat-bugis": "/photos/lantern-groom.png",
  "menara-cahaya": "/photos/imperial-groom.png",
  santorini: "/photos/white-groom.png",
  "jawa-merah": "/photos/jawa-groom.png",
  "jawa-coklat": "/photos/jawa-groom.png",
};

const BRIDE_PHOTO_BY_THEME: Record<string, string> = {
  sakura: "/photos/sakura-bride.png",
  "luxury-gold": "/photos/luxury-bride.png",
  "islamic-green": "/photos/green-bride.png",
  "royal-black": "/photos/black-bride.png",
  "floral-garden": "/photos/floral-bride.png",
  "emerald-lantern": "/photos/lantern-bride.png",
  "minimal-white": "/photos/white-bride.png",
  rustic: "/photos/rustic-bride.png",
  bohemian: "/photos/boho-bride.png",
  "modern-elegant": "/photos/modern-bride.png",
  "royal-imperial": "/photos/imperial-bride.png",
  "vintage-botanical": "/photos/botanical-bride.png",
  "pastel-studio": "/photos/pastel-bride.png",
  "art-deco-glam": "/photos/deco-bride.png",
  "golden-romance": "/photos/romance-bride.png",
  "adat-jawa": "/photos/jawa-bride.png",
  "adat-minang": "/photos/luxury-bride.png",
  "adat-bugis": "/photos/lantern-bride.png",
  "menara-cahaya": "/photos/imperial-bride.png",
  santorini: "/photos/white-bride.png",
  "jawa-merah": "/photos/jawa-bride.png",
  "jawa-coklat": "/photos/jawa-bride.png",
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
  // which santorini below still depends on as a placeholder.
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
  // usual 6) - numbered 7-11. menara-cahaya below still uses the first 5
  // of these as its own placeholder gallery.
  "royal-black": [
    "/photos/black-gallery-7.png",
    "/photos/black-gallery-8.png",
    "/photos/black-gallery-9.png",
    "/photos/black-gallery-10.png",
    "/photos/black-gallery-11.png",
  ],
  // Numbered 7-12 (not 1-6) - the old floral-gallery-1..6.jpg stock set
  // was deleted once vintage-botanical moved to its own real photography.
  "floral-garden": [
    "/photos/floral-gallery-7.png",
    "/photos/floral-gallery-8.png",
    "/photos/floral-gallery-9.png",
    "/photos/floral-gallery-10.png",
    "/photos/floral-gallery-11.png",
    "/photos/floral-gallery-12.png",
  ],
  "emerald-lantern": [
    "/photos/lantern-gallery-1.png",
    "/photos/lantern-gallery-2.png",
    "/photos/lantern-gallery-3.png",
    "/photos/lantern-gallery-4.png",
    "/photos/lantern-gallery-5.png",
    "/photos/lantern-gallery-6.png",
  ],
  sakura: [
    "/photos/sakura-gallery-1.png",
    "/photos/sakura-gallery-2.png",
    "/photos/sakura-gallery-3.png",
    "/photos/sakura-gallery-4.png",
    "/photos/sakura-gallery-5.png",
    "/photos/sakura-gallery-6.png",
  ],
  // Numbered 7-12 (not 1-6) - the old rustic-gallery-1..6.jpg stock set
  // was deleted once golden-romance moved to its own real photography.
  rustic: [
    "/photos/rustic-gallery-7.png",
    "/photos/rustic-gallery-8.png",
    "/photos/rustic-gallery-9.png",
    "/photos/rustic-gallery-10.png",
    "/photos/rustic-gallery-11.png",
    "/photos/rustic-gallery-12.png",
  ],
  bohemian: [
    "/photos/boho-gallery-1.png",
    "/photos/boho-gallery-2.png",
    "/photos/boho-gallery-3.png",
    "/photos/boho-gallery-4.png",
    "/photos/boho-gallery-5.png",
    "/photos/boho-gallery-6.png",
  ],
  "modern-elegant": [
    "/photos/modern-gallery-1.png",
    "/photos/modern-gallery-2.png",
    "/photos/modern-gallery-3.png",
    "/photos/modern-gallery-4.png",
    "/photos/modern-gallery-5.png",
    "/photos/modern-gallery-6.png",
  ],
  "royal-imperial": [
    "/photos/imperial-gallery-1.png",
    "/photos/imperial-gallery-2.png",
    "/photos/imperial-gallery-3.png",
    "/photos/imperial-gallery-4.png",
    "/photos/imperial-gallery-5.png",
    "/photos/imperial-gallery-6.png",
  ],
  "adat-jawa": [
    "/photos/jawa-gallery-1.png",
    "/photos/jawa-gallery-2.png",
    "/photos/jawa-gallery-3.png",
    "/photos/jawa-gallery-4.png",
    "/photos/jawa-gallery-5.png",
    "/photos/jawa-gallery-6.png",
  ],
  "vintage-botanical": [
    "/photos/botanical-gallery-1.png",
    "/photos/botanical-gallery-2.png",
    "/photos/botanical-gallery-3.png",
    "/photos/botanical-gallery-4.png",
    "/photos/botanical-gallery-5.png",
    "/photos/botanical-gallery-6.png",
  ],
  "pastel-studio": [
    "/photos/pastel-gallery-1.png",
    "/photos/pastel-gallery-2.png",
    "/photos/pastel-gallery-3.png",
    "/photos/pastel-gallery-4.png",
    "/photos/pastel-gallery-5.png",
    "/photos/pastel-gallery-6.png",
  ],
  "art-deco-glam": [
    "/photos/deco-gallery-1.png",
    "/photos/deco-gallery-2.png",
    "/photos/deco-gallery-3.png",
    "/photos/deco-gallery-4.png",
    "/photos/deco-gallery-5.png",
    "/photos/deco-gallery-6.png",
  ],
  "golden-romance": [
    "/photos/romance-gallery-1.png",
    "/photos/romance-gallery-2.png",
    "/photos/romance-gallery-3.png",
    "/photos/romance-gallery-4.png",
    "/photos/romance-gallery-5.png",
    "/photos/romance-gallery-6.png",
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
    "/photos/lantern-gallery-1.png",
    "/photos/lantern-gallery-2.png",
    "/photos/lantern-gallery-3.png",
    "/photos/lantern-gallery-4.png",
    "/photos/lantern-gallery-5.png",
    "/photos/lantern-gallery-6.png",
  ],
  // Reuses royal-imperial's real gallery wholesale, same as the
  // cover/groom/bride entries above - no dedicated mosque-architecture
  // photos supplied yet.
  "menara-cahaya": [
    "/photos/imperial-gallery-1.png",
    "/photos/imperial-gallery-2.png",
    "/photos/imperial-gallery-3.png",
    "/photos/imperial-gallery-4.png",
    "/photos/imperial-gallery-5.png",
    "/photos/imperial-gallery-6.png",
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
    "/photos/jawa-gallery-2.png",
    "/photos/jawa-cover.png",
    "/photos/jawa-gallery-3.png",
    "/photos/jawa-gallery-4.png",
    "/photos/jawa-gallery-5.png",
    "/photos/jawa-gallery-6.png",
  ],
  // Placeholder only, same reasoning as jawa-merah above - same
  // Javanese photoshoot, different ordering (skips gallery-4, used as
  // this theme's own cover above) so the picker thumbnails don't match
  // exactly. Replace once real photos exist.
  "jawa-coklat": [
    "/photos/jawa-gallery-1.png",
    "/photos/jawa-gallery-2.png",
    "/photos/jawa-cover.png",
    "/photos/jawa-gallery-3.png",
    "/photos/jawa-gallery-5.png",
    "/photos/jawa-gallery-6.png",
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
