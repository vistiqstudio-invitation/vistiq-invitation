import { Abril_Fatface, Alice, Cormorant_Garamond, Playfair_Display, Inter, Montserrat, Alex_Brush, Suranna, Readex_Pro, Chelsea_Market, Noto_Sans_Balinese, Noto_Serif_Display, Raleway, Orbitron, Baloo_2, Bangers } from "next/font/google";

export const abrilFatface = Abril_Fatface({
  variable: "--font-abril-fatface",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const alice = Alice({
  variable: "--font-alice",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

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

export const chelseaMarket = Chelsea_Market({
  variable: "--font-chelsea-market",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Renders genuine Aksara Bali script (used by adat-bali for the Om
// Swastyastu / Om Shanti Shanti Shanti Om ceremonial flourishes) instead
// of falling back to tofu boxes on devices without the script installed.
export const notoBalinese = Noto_Sans_Balinese({
  variable: "--font-noto-bali",
  subsets: ["balinese", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

// Matches the label/body serif used across the adat-bali reference site
// (nauhin.com/adat-bali-premium-template).
export const notoSerifDisplay = Noto_Serif_Display({
  variable: "--font-noto-serif-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Geometric sci-fi display face used by the space-explorer birthday
// theme for headings and the mission-countdown digits.
export const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Playful rounded display face used by the dinosaur-adventure birthday
// theme for headings.
export const baloo2 = Baloo_2({
  variable: "--font-baloo2",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Comic-book display face used by the superhero-city birthday theme for
// headings and the countdown badges.
export const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
