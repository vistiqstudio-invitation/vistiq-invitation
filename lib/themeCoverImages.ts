export const WEDDING_COVER_BY_THEME: Record<string, string> = {
  "princess-fairytale": "/photos/romance-cover.webp",
  "luxury-gold": "/photos/luxury-cover.webp",
  "islamic-green": "/photos/green-cover.webp",
  "emerald-lantern": "/photos/lantern-cover.webp",
  "minimal-white": "/photos/white-cover.webp",
  "floral-garden": "/photos/floral-cover.webp",
  sakura: "/photos/sakura-cover.webp",
  rustic: "/photos/rustic-cover.webp",
  bohemian: "/photos/boho-cover.webp",
  "modern-elegant": "/photos/modern-cover.webp",
  "royal-imperial": "/photos/imperial-cover.webp",
  "vintage-botanical": "/photos/botanical-cover.webp",
  "pastel-studio": "/photos/pastel-cover.webp",
  "art-deco-glam": "/photos/deco-cover.webp",
  "golden-romance": "/photos/romance-cover.webp",
  "adat-jawa": "/photos/jawa-cover.webp",
  "adat-minang": "/photos/luxury-gallery-1.webp",
  "adat-bugis": "/photos/lantern-cover.webp",
  "menara-cahaya": "/photos/imperial-cover.webp",
  santorini: "/photos/white-cover.webp",
  "jawa-merah": "/photos/jawa-gallery-1.webp",
  "royal-java": "/photos/jawa-cover.webp",
  "luxury-art-java-heritage": "/photos/luxury-sage-cover.webp",
  "luxury-art-sakura": "/photos/sakura-cover.webp",
  "luxury-art-champagne-romance": "/theme-previews/wedding/luxury-art-champagne-romance.jpg",
  "luxury-art-soft": "/themes/luxury-art-soft/ai-cover.jpg",
  "velora-editorial": "/themes/velora-editorial/ai-cover.jpg",
  "3d-motion": "/photos/luxury-art-love-paradise/couple-cover.webp",
  "3d-montion-1": "/photos/luxury-art-love-paradise/couple-cover.webp",
  "jawa-coklat": "/photos/jawa-gallery-4.webp",
  "jawa-sepia": "/photos/jawa-cover.webp",
  "sage-green": "/photos/floral-cover.webp",
  sahara: "/photos/rustic-cover.webp",
  "adat-bali": "/photos/adat-bali-cover.webp",
  "adat-sunda": "/photos/adat-sunda-cover.webp",
  "midnight-aurora": "/photos/black-cover.webp",
  "luxury-art-garden": "/photos/floral-cover.webp",
  "porcelain-bloom": "/photos/floral-cover.webp",
  "love-chronicle": "/photos/modern-cover.webp",
  "velvet-cinema": "/photos/deco-cover.webp",
  "prismatic-vows": "/photos/pastel-cover.webp",
  "pearl-tide": "/photos/white-cover.webp",
  "fizan-islamic-motion": "/themes/fizan-islamic-motion/poster.jpg",
};

export const THEME_CARD_PREVIEW_BY_THEME: Record<string, string> = {
  "lavender-garden-motion": "/theme-previews/wedding/lavender-garden-motion-card.jpg",
  "luxury-gold": "/theme-previews/wedding/luxury-gold-card.jpg",
  "minimal-white": "/theme-previews/wedding/minimal-white-card.jpg",
  "islamic-green": "/theme-previews/wedding/islamic-green-card.jpg",
  "velora-editorial": "/theme-previews/wedding/velora-editorial.jpg",
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
