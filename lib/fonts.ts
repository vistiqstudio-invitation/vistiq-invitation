import { Cormorant_Garamond, Playfair_Display, Inter, Alex_Brush, Suranna, Readex_Pro } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const suranna = Suranna({
  variable: "--font-suranna",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const readexPro = Readex_Pro({
  variable: "--font-readex-pro",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});
