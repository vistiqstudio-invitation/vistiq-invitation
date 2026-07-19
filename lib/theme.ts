import type { InvitationData } from "@/types/invitation";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import type { KhitanInvitationData } from "@/types/khitan";
import AkikahNur from "@/themes/akikah-nur/AkikahNur";
import AkikahZaitun from "@/themes/akikah-zaitun/AkikahZaitun";
import AkikahCeria from "@/themes/akikah-ceria/AkikahCeria";
import AkikahAnugerah from "@/themes/akikah-anugerah/AkikahAnugerah";
import AkikahSafir from "@/themes/akikah-safir/AkikahSafir";
import AkikahKasih from "@/themes/akikah-kasih/AkikahKasih";
import KhitanWarna from "@/themes/khitan-warna/KhitanWarna";
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
import Santorini from "@/themes/santorini/Santorini";
import VintageBotanical from "@/themes/vintage-botanical/VintageBotanical";
import PastelStudio from "@/themes/pastel-studio/PastelStudio";
import ArtDecoGlam from "@/themes/art-deco-glam/ArtDecoGlam";
import GoldenRomance from "@/themes/golden-romance/GoldenRomance";
import JawaMerah from "@/themes/jawa-merah/JawaMerah";
import JawaCoklat from "@/themes/jawa-coklat/JawaCoklat";
import SageGreen from "@/themes/sage-green/SageGreen";
import Sahara from "@/themes/sahara/Sahara";

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
  santorini: Santorini,
  "vintage-botanical": VintageBotanical,
  "pastel-studio": PastelStudio,
  "art-deco-glam": ArtDecoGlam,
  "golden-romance": GoldenRomance,
  "jawa-merah": JawaMerah,
  "jawa-coklat": JawaCoklat,
  "sage-green": SageGreen,
  sahara: Sahara,
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
    key: "santorini",
    label: "Santorini",
    description: "Biru Aegean & putih, pintu lengkung Cyclades, editorial minimalis",
    swatch: ["#f6fafc", "#1c5583"],
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
  {
    key: "jawa-merah",
    label: "Jawa Merah Premium",
    description: "Krem & merah crimson, kartu lengkung arch, motif batik lattice, joglo",
    swatch: ["#fffbf4", "#ad2940"],
  },
  {
    key: "jawa-coklat",
    label: "Jawa Coklat Premium",
    description: "Krem & coklat tan hangat, kartu pill & arch, motif batik lattice, joglo",
    swatch: ["#fffbf4", "#ac9271"],
  },
  {
    key: "sage-green",
    label: "Sage Green",
    description: "Krem & sage-olive, ring foto ganda, galeri marquee arch, timeline stem",
    swatch: ["#f6f4e9", "#464e2e"],
  },
  {
    key: "sahara",
    label: "Sahara",
    description: "Krem & terracotta pasir, foto arch tinggi, galeri grid lightbox, story dua kolom",
    swatch: ["#fffdf9", "#ae8f7a"],
  },
];

// Separate registry/list for aqiqah invitations - a different occasion
// category with its own data shape (baby/parents/single event, not
// groom/bride/story/two-events), so these themes take AqiqahInvitationData
// instead of InvitationData and can't share the wedding registry above.
export const aqiqahThemeRegistry: Record<
  string,
  (props: { invitation: AqiqahInvitationData }) => React.JSX.Element
> = {
  "akikah-nur": AkikahNur,
  "akikah-zaitun": AkikahZaitun,
  "akikah-ceria": AkikahCeria,
  "akikah-anugerah": AkikahAnugerah,
  "akikah-safir": AkikahSafir,
  "akikah-kasih": AkikahKasih,
};

export const aqiqahThemeList: ThemeMeta[] = [
  {
    key: "akikah-nur",
    label: "Akikah Nur",
    description: "Biru langit lembut, krem & emas madu, medali foto bayi, kartu doa",
    swatch: ["#f7fafc", "#5b8bb0"],
  },
  {
    key: "akikah-zaitun",
    label: "Akikah Zaitun",
    description: "Sage & krem lime, medali foto bulat, kartu acara arch, galeri grid olive",
    swatch: ["#f7ffdc", "#6c7e2f"],
  },
  {
    key: "akikah-ceria",
    label: "Akikah Ceria",
    description: "Krem, coral & sage ceria, garland bunting, balon, medali foto organik",
    swatch: ["#fff8f0", "#e8927c"],
  },
  {
    key: "akikah-anugerah",
    label: "Akikah Anugerah",
    description: "Blush, charcoal & emas antik, aksen line-art halus, bingkai galeri tipis, galeri masonry",
    swatch: ["#faf6f1", "#a9835a"],
  },
  {
    key: "akikah-safir",
    label: "Akikah Safir",
    description: "Navy & emas, motif bintang geometris Islami, bingkai foto heksagon, galeri honeycomb",
    swatch: ["#f6f4ee", "#182a4d"],
  },
  {
    key: "akikah-kasih",
    label: "Akikah Kasih",
    description: "Pastel mint, peach & lavender, ilustrasi beruang & awan, bingkai foto scallop, galeri polaroid",
    swatch: ["#fffaf4", "#e8a795"],
  },
];

// Third occasion category - khitan (circumcision celebration). Reuses the
// exact same data columns as aqiqah under the hood (see 020_add_khitan_
// category.sql) but gets its own type/registry since "baby" framing (with
// a gender field) doesn't fit a khitan child, and mixing categories into
// one registry would break the discriminated-union props contract.
export const khitanThemeRegistry: Record<
  string,
  (props: { invitation: KhitanInvitationData }) => React.JSX.Element
> = {
  "khitan-warna": KhitanWarna,
};

export const khitanThemeList: ThemeMeta[] = [
  {
    key: "khitan-warna",
    label: "Khitan Warna",
    description: "Biru dusty & krem, medali foto bulat, motif daun emas, galeri grid",
    swatch: ["#eef3f9", "#5b89aa"],
  },
];
