export const WEDDING_COVER_BY_THEME: Record<string, string> = {
  "princess-fairytale": "/photos/romance-cover.png",
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
  "adat-minang": "/photos/luxury-gallery-1.png",
  "adat-bugis": "/photos/lantern-cover.png",
  "menara-cahaya": "/photos/imperial-cover.png",
  santorini: "/photos/white-cover.png",
  "jawa-merah": "/photos/jawa-gallery-1.png",
  "royal-java": "/photos/jawa-cover.png",
  "luxury-art-java-heritage": "/photos/luxury-sage-cover.webp",
  "luxury-art-sakura": "/photos/sakura-cover.png",
  "luxury-art-champagne-romance": "/theme-previews/wedding/luxury-art-champagne-romance.jpg",
  "luxury-art-soft": "/themes/luxury-art-soft/ai-cover.jpg",
  "3d-motion": "/photos/luxury-art-love-paradise/couple-cover.webp",
  "3d-montion-1": "/photos/luxury-art-love-paradise/couple-cover.webp",
  "jawa-coklat": "/photos/jawa-gallery-4.png",
  "jawa-sepia": "/photos/jawa-cover.png",
  "sage-green": "/photos/floral-cover.png",
  sahara: "/photos/rustic-cover.png",
  "adat-bali": "/photos/adat-bali-cover.png",
  "adat-sunda": "/photos/adat-sunda-cover.png",
  "midnight-aurora": "/photos/black-cover.png",
  "luxury-art-garden": "/photos/floral-cover.png",
  "porcelain-bloom": "/photos/floral-cover.png",
  "love-chronicle": "/photos/modern-cover.png",
  "velvet-cinema": "/photos/deco-cover.png",
  "prismatic-vows": "/photos/pastel-cover.png",
  "pearl-tide": "/photos/white-cover.png",
  "fizan-islamic-motion": "/themes/fizan-islamic-motion/poster.jpg",
};

export const THEME_CARD_PREVIEW_BY_THEME: Record<string, string> = {
  "lavender-garden-motion": "/theme-previews/wedding/lavender-garden-motion-card.jpg",
  "luxury-gold": "/theme-previews/wedding/luxury-gold-card.jpg",
};

const KHITAN_COVER = "/photos/khitan-warna-cover.jpg";

export const KHITAN_COVER_BY_THEME: Record<string, string> = Object.fromEntries(
  ["khitan-warna","khitan-ksatria","khitan-raja","khitan-berani","khitan-petualang","khitan-elang"].map((theme) => [theme, KHITAN_COVER]),
);

export const AQIQAH_COVER_BY_THEME: Record<string, string> = {
  "akikah-nur": "/photos/akikah-nur-demo.webp",
  "akikah-zaitun": "/photos/akikah-zaitun-cover.jpg",
  "akikah-ceria": "/photos/akikah-ceria-demo.webp",
  "akikah-anugerah": "/photos/akikah-anugerah-demo.webp",
  "akikah-safir": "/photos/akikah-safir-demo.webp",
  "akikah-kasih": "/photos/akikah-kasih-demo.webp",
  "akikah-damai": "/photos/akikah-damai-cover.jpg",
};

export const BIRTHDAY_COVER_BY_THEME: Record<string, string> = {
  "princess-fairytale": "/photos/princess-fairytale/cover.webp",
  "space-explorer": "/photos/space-explorer/cover.webp",
  "dinosaur-adventure": "/photos/dinosaur-adventure/cover.webp",
  "superhero-city": "/photos/superhero-city/cover.webp",
};

export function getThemeCoverImage(themeKey: string, demoPath: string): string | null {
  if (demoPath === "/demo-khitan") return KHITAN_COVER_BY_THEME[themeKey] ? `/theme-previews/khitan/${themeKey}.jpg` : null;
  if (demoPath === "/demo-akikah") return AQIQAH_COVER_BY_THEME[themeKey] ? `/theme-previews/akikah/${themeKey}.jpg` : null;
  if (demoPath === "/demo-ulang-tahun") return BIRTHDAY_COVER_BY_THEME[themeKey] ? `/theme-previews/birthday/${themeKey}.jpg` : null;
  return WEDDING_COVER_BY_THEME[themeKey] ? `/theme-previews/wedding/${themeKey}.jpg` : null;
}

export function getThemeCardPreviewImage(themeKey: string, demoPath: string): string | null {
  if (demoPath !== "/demo") return null;
  return THEME_CARD_PREVIEW_BY_THEME[themeKey] ?? null;
}
