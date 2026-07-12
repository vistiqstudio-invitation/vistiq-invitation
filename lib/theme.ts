import type { InvitationData } from "@/types/invitation";
import LuxuryGold from "@/themes/luxury-gold/LuxuryGold";
import MinimalWhite from "@/themes/minimal-white/MinimalWhite";
import IslamicGreen from "@/themes/islamic-green/IslamicGreen";
import RoyalBlack from "@/themes/royal-black/RoyalBlack";
import FloralGarden from "@/themes/floral-garden/FloralGarden";
import EmeraldLantern from "@/themes/emerald-lantern/EmeraldLantern";
import Sakura from "@/themes/sakura/Sakura";
import Rustic from "@/themes/rustic/Rustic";
import Bohemian from "@/themes/bohemian/Bohemian";
import ModernElegant from "@/themes/modern-elegant/ModernElegant";
import RoyalImperial from "@/themes/royal-imperial/RoyalImperial";
import AdatJawa from "@/themes/adat-jawa/AdatJawa";
import AdatMinang from "@/themes/adat-minang/AdatMinang";
import AdatBugis from "@/themes/adat-bugis/AdatBugis";
import MenaraCahaya from "@/themes/menara-cahaya/MenaraCahaya";
import VintageBotanical from "@/themes/vintage-botanical/VintageBotanical";
import PastelStudio from "@/themes/pastel-studio/PastelStudio";
import ArtDecoGlam from "@/themes/art-deco-glam/ArtDecoGlam";
import GoldenRomance from "@/themes/golden-romance/GoldenRomance";

export const themeRegistry: Record<
  string,
  (props: { invitation: InvitationData }) => React.JSX.Element
> = {
  "luxury-gold": LuxuryGold,
  "minimal-white": MinimalWhite,
  "islamic-green": IslamicGreen,
  "royal-black": RoyalBlack,
  "floral-garden": FloralGarden,
  "emerald-lantern": EmeraldLantern,
  sakura: Sakura,
  rustic: Rustic,
  bohemian: Bohemian,
  "modern-elegant": ModernElegant,
  "royal-imperial": RoyalImperial,
  "adat-jawa": AdatJawa,
  "adat-minang": AdatMinang,
  "adat-bugis": AdatBugis,
  "menara-cahaya": MenaraCahaya,
  "vintage-botanical": VintageBotanical,
  "pastel-studio": PastelStudio,
  "art-deco-glam": ArtDecoGlam,
  "golden-romance": GoldenRomance,
};

export type ThemeMeta = {
  key: string;
  label: string;
  description: string;
  swatch: [string, string];
};

export const themeList: ThemeMeta[] = [
  {
    key: "luxury-gold",
    label: "Luxury Gold",
    description: "Dark & glamorous, aksen gold, glassmorphism",
    swatch: ["#0b0b0b", "#d4af37"],
  },
  {
    key: "minimal-white",
    label: "Minimal White",
    description: "Putih bersih, editorial, elegan minimalis",
    swatch: ["#ffffff", "#96742a"],
  },
  {
    key: "islamic-green",
    label: "Islamic Green",
    description: "Krem hangat, hijau emerald & emas, motif islami",
    swatch: ["#faf6ec", "#0b5d42"],
  },
  {
    key: "royal-black",
    label: "Royal Black",
    description: "Hitam pekat & emas, formal, bingkai crest kerajaan",
    swatch: ["#000000", "#d4af37"],
  },
  {
    key: "floral-garden",
    label: "Floral Garden",
    description: "Krem lembut, sage & blush, motif bunga natural",
    swatch: ["#fdf9f3", "#8a9a7e"],
  },
  {
    key: "emerald-lantern",
    label: "Emerald Lantern",
    description: "Nuansa malam taman, awan lembut & lampion hijau jade",
    swatch: ["#fbfaf6", "#5b8266"],
  },
  {
    key: "sakura",
    label: "Sakura",
    description: "Pink lembut, bunga sakura melayang, soft & feminin",
    swatch: ["#fffaf9", "#c2607a"],
  },
  {
    key: "rustic",
    label: "Rustic",
    description: "Kraft & terracotta, gandum kering, hangat & earthy",
    swatch: ["#faf3e6", "#c17a54"],
  },
  {
    key: "bohemian",
    label: "Bohemian",
    description: "Terracotta & pasir, pampas grass, free-spirited & artsy",
    swatch: ["#f7ede1", "#b5603a"],
  },
  {
    key: "modern-elegant",
    label: "Modern Elegant",
    description: "Split-screen, tipografi bold, layout & animasi editorial modern",
    swatch: ["#ffffff", "#b5482a"],
  },
  {
    key: "royal-imperial",
    label: "Royal Imperial",
    description: "Maroon & emas keraton, medali foto, dial melingkar",
    swatch: ["#2a0f0f", "#d4af37"],
  },
  {
    key: "adat-jawa",
    label: "Adat Jawa",
    description: "Soga & emas antik, motif batik, timeline zigzag, foto bersusun",
    swatch: ["#241811", "#c9a24a"],
  },
  {
    key: "adat-minang",
    label: "Adat Minang",
    description: "Marun & emas songket, motif gonjong rumah gadang, suntiang",
    swatch: ["#4a0e14", "#d1a13a"],
  },
  {
    key: "adat-bugis",
    label: "Adat Bugis",
    description: "Teal & emas, motif atap timpalaja, ombak Bugis-Makassar",
    swatch: ["#0d3438", "#cfa23c"],
  },
  {
    key: "menara-cahaya",
    label: "Menara Cahaya",
    description: "Navy malam & emas, siluet kubah-menara masjid, bintang islami",
    swatch: ["#0d1b3d", "#cda15a"],
  },
  {
    key: "vintage-botanical",
    label: "Vintage Botanical",
    description: "Kertas usang, sage & maroon pudar, plakat botani, galeri masonry",
    swatch: ["#f6efe0", "#7d3f3a"],
  },
  {
    key: "pastel-studio",
    label: "Pastel Studio",
    description: "Lilac, peach & mint, ala studio foto Korea, minim ornamen",
    swatch: ["#faf7f2", "#d998a0"],
  },
  {
    key: "art-deco-glam",
    label: "Art Deco Glam",
    description: "Onyx, emerald & emas geometris ala 1920-an, bingkai heksagon",
    swatch: ["#0d0d0f", "#c9a648"],
  },
  {
    key: "golden-romance",
    label: "Golden Romance",
    description: "Blush & emas senja keemasan, bingkai bulat glow, carousel galeri",
    swatch: ["#fbf5ee", "#c9a15a"],
  },
];
