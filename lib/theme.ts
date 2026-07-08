import type { InvitationData } from "@/types/invitation";
import LuxuryGold from "@/themes/luxury-gold/LuxuryGold";
import MinimalWhite from "@/themes/minimal-white/MinimalWhite";
import IslamicGreen from "@/themes/islamic-green/IslamicGreen";
import RoyalBlack from "@/themes/royal-black/RoyalBlack";
import FloralGarden from "@/themes/floral-garden/FloralGarden";
import EmeraldLantern from "@/themes/emerald-lantern/EmeraldLantern";
import Sakura from "@/themes/sakura/Sakura";

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
];
