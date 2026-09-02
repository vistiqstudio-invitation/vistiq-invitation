import type { InvitationData } from "@/types/invitation";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import type { KhitanInvitationData } from "@/types/khitan";
import type { BirthdayInvitationData } from "@/types/birthday";
import AkikahNur from "@/themes/akikah-nur/AkikahNur";
import AkikahZaitun from "@/themes/akikah-zaitun/AkikahZaitun";
import AkikahCeria from "@/themes/akikah-ceria/AkikahCeria";
import AkikahAnugerah from "@/themes/akikah-anugerah/AkikahAnugerah";
import AkikahSafir from "@/themes/akikah-safir/AkikahSafir";
import AkikahKasih from "@/themes/akikah-kasih/AkikahKasih";
import AkikahDamai from "@/themes/akikah-damai/AkikahDamai";
import KhitanWarna from "@/themes/khitan-warna/KhitanWarna";
import KhitanKsatria from "@/themes/khitan-ksatria/KhitanKsatria";
import KhitanRaja from "@/themes/khitan-raja/KhitanRaja";
import KhitanBerani from "@/themes/khitan-berani/KhitanBerani";
import KhitanPetualang from "@/themes/khitan-petualang/KhitanPetualang";
import KhitanElang from "@/themes/khitan-elang/KhitanElang";
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
import AdatBali from "@/themes/adat-bali/AdatBali";
import AdatSunda from "@/themes/adat-sunda/AdatSunda";
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
import MidnightAurora from "@/themes/midnight-aurora/MidnightAurora";
import PorcelainBloom from "@/themes/porcelain-bloom/PorcelainBloom";
import LuxuryArtGarden from "@/themes/luxury-art-garden/LuxuryArtGarden";
import LuxuryArtLoveParadise from "@/themes/luxury-art-love-paradise/LuxuryArtLoveParadise";
import LuxuryArtJavaHeritage from "@/themes/luxury-art-java-heritage/LuxuryArtJavaHeritage";
import LuxuryArtSakura from "@/themes/luxury-art-sakura/LuxuryArtSakura";
import ChampagneRomance from "@/themes/luxury-art-champagne-romance/ChampagneRomance";
import LuxuryArtSoft from "@/themes/luxury-art-soft/LuxuryArtSoft";
import ThreeDMotion from "@/themes/3d-motion/ThreeDMotion";
import LoveChronicle from "@/themes/love-chronicle/LoveChronicle";
import VelvetCinema from "@/themes/velvet-cinema/VelvetCinema";
import PrismaticVows from "@/themes/prismatic-vows/PrismaticVows";
import PearlTide from "@/themes/pearl-tide/PearlTide";
import JawaSepia from "@/themes/jawa-sepia/JawaSepia";
import RoyalJava from "@/themes/royal-java/RoyalJava";
import PrincessBirthday from "@/themes/princess-fairytale/PrincessBirthday";
import SpaceBirthday from "@/themes/space-explorer/SpaceBirthday";
import DinoBirthday from "@/themes/dinosaur-adventure/DinoBirthday";
import SuperheroBirthday from "@/themes/superhero-city/SuperheroBirthday";

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
  "adat-bali": AdatBali,
  "adat-sunda": AdatSunda,
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
  "midnight-aurora": MidnightAurora,
  "porcelain-bloom": PorcelainBloom,
  "luxury-art-garden": LuxuryArtGarden,
  "luxury-art-love-paradise": LuxuryArtLoveParadise,
  "luxury-art-java-heritage": LuxuryArtJavaHeritage,
  "luxury-art-sakura": LuxuryArtSakura,
  "luxury-art-champagne-romance": ChampagneRomance,
  "luxury-art-soft": LuxuryArtSoft,
  "3d-motion": ThreeDMotion,
  "3d-montion-1": ThreeDMotion,
  "love-chronicle": LoveChronicle,
  "velvet-cinema": VelvetCinema,
  "prismatic-vows": PrismaticVows,
  "pearl-tide": PearlTide,
  "jawa-sepia": JawaSepia,
  "royal-java": RoyalJava,
};

export type ThemeMeta = {
  key: string;
  label: string;
  description: string;
  swatch: [string, string];
  tags?: string[];
  addedAt?: string;
};

const NEW_BADGE_WINDOW_DAYS = 30;

export function isThemeNew(theme: ThemeMeta): boolean {
  if (!theme.addedAt) return false;
  const days = (Date.now() - new Date(theme.addedAt).getTime()) / 86400000;
  return days >= 0 && days <= NEW_BADGE_WINDOW_DAYS;
}

export const themeList: ThemeMeta[] = [
  { key: "luxury-gold", label: "Luxury Gold", description: "Dark & glamorous, aksen gold, glassmorphism", swatch: ["#0b0b0b", "#d4af37"], tags: ["premium"] },
  { key: "minimal-white", label: "Minimal White", description: "Putih bersih, editorial, elegan minimalis", swatch: ["#ffffff", "#96742a"], tags: ["reguler"] },
  { key: "islamic-green", label: "Islamic Green", description: "Krem hangat, hijau emerald & emas, motif islami", swatch: ["#faf6ec", "#0b5d42"], tags: ["adat"] },
  { key: "royal-black", label: "Royal Black", description: "Hitam pekat & emas, formal, bingkai crest kerajaan", swatch: ["#000000", "#d4af37"], tags: ["premium"] },
  { key: "floral-garden", label: "Floral Garden", description: "Krem lembut, sage & blush, motif bunga natural", swatch: ["#fdf9f3", "#8a9a7e"], tags: ["reguler"] },
  { key: "emerald-lantern", label: "Emerald Lantern", description: "Nuansa malam taman, awan lembut & lampion hijau jade", swatch: ["#fbfaf6", "#5b8266"], tags: ["reguler"] },
  { key: "sakura", label: "Sakura", description: "Pink lembut, bunga sakura melayang, soft & feminin", swatch: ["#fffaf9", "#c2607a"], tags: ["reguler"] },
  { key: "rustic", label: "Rustic", description: "Kraft & terracotta, gandum kering, hangat & earthy", swatch: ["#faf3e6", "#c17a54"], tags: ["reguler"] },
  { key: "bohemian", label: "Bohemian", description: "Terracotta & pasir, pampas grass, free-spirited & artsy", swatch: ["#f7ede1", "#b5603a"], tags: ["reguler"] },
  { key: "modern-elegant", label: "Modern Elegant", description: "Split-screen, tipografi bold, layout & animasi editorial modern", swatch: ["#ffffff", "#b5482a"], tags: ["premium"] },
  { key: "royal-imperial", label: "Royal Imperial", description: "Maroon & emas keraton, medali foto, dial melingkar", swatch: ["#2a0f0f", "#d4af37"], tags: ["premium"] },
  { key: "adat-jawa", label: "Adat Jawa", description: "Soga & emas antik, motif batik, timeline zigzag, foto bersusun", swatch: ["#241811", "#c9a24a"], tags: ["adat"] },
  { key: "royal-java", label: "Royal Java – Maroon Heritage", description: "Opening sinematik pendopo, bunga marun berlapis, batik & emas keraton", swatch: ["#250608", "#d7ad55"], tags: ["premium", "adat"], addedAt: "2026-07-26" },
  { key: "adat-minang", label: "Adat Minang", description: "Marun & emas songket, motif gonjong rumah gadang, suntiang", swatch: ["#4a0e14", "#d1a13a"], tags: ["adat"] },
  { key: "adat-bugis", label: "Adat Bugis", description: "Teal & emas, motif atap timpalaja, ombak Bugis-Makassar", swatch: ["#0d3438", "#cfa23c"], tags: ["adat"] },
  { key: "adat-bali", label: "Adat Bali", description: "Hitam batu & emas prada, gapura candi bentar, medali foto bulat, aksara Bali", swatch: ["#16110d", "#c9a227"], tags: ["adat"] },
  { key: "adat-sunda", label: "Adat Sunda", description: "Hijau hutan Parahyangan & emas antik, motif awan Mega Mendung, bingkai foto arch, kartu Akad & Resepsi berdampingan", swatch: ["#1a3626", "#c9a24a"], tags: ["adat"], addedAt: "2026-07-25" },
  { key: "menara-cahaya", label: "Menara Cahaya", description: "Navy malam & emas, siluet kubah-menara masjid, bintang islami", swatch: ["#0d1b3d", "#cda15a"], tags: ["adat"] },
  { key: "santorini", label: "Santorini", description: "Biru Aegean & putih, pintu lengkung Cyclades, editorial minimalis", swatch: ["#f6fafc", "#1c5583"], tags: ["reguler"] },
  { key: "vintage-botanical", label: "Vintage Botanical", description: "Kertas usang, sage & maroon pudar, plakat botani, galeri masonry", swatch: ["#f6efe0", "#7d3f3a"], tags: ["reguler"] },
  { key: "pastel-studio", label: "Pastel Studio", description: "Lilac, peach & mint, ala studio foto Korea, minim ornamen", swatch: ["#faf7f2", "#d998a0"], tags: ["reguler"] },
  { key: "art-deco-glam", label: "Art Deco Glam", description: "Onyx, emerald & emas geometris ala 1920-an, bingkai heksagon", swatch: ["#0d0d0f", "#c9a648"], tags: ["premium"] },
  { key: "golden-romance", label: "Golden Romance", description: "Blush & emas senja keemasan, bingkai bulat glow, carousel galeri", swatch: ["#fbf5ee", "#c9a15a"], tags: ["premium"] },
  { key: "jawa-merah", label: "Jawa Merah Premium", description: "Krem & merah crimson, kartu lengkung arch, motif batik lattice, joglo", swatch: ["#fffbf4", "#ad2940"], tags: ["adat"] },
  { key: "jawa-coklat", label: "Jawa Coklat Premium", description: "Krem & coklat tan hangat, kartu pill & arch, motif batik lattice, joglo", swatch: ["#fffbf4", "#ac9271"], tags: ["adat"] },
  { key: "jawa-sepia", label: "Javanese Sepia Motion", description: "Coklat sepia sinematik, bingkai ukir Jawa, grain film, Ken Burns & reveal berlapis", swatch: ["#160e0a", "#c7a46a"], tags: ["adat"] },
  { key: "sage-green", label: "Sage Green", description: "Krem & sage-olive, ring foto ganda, galeri marquee arch, timeline stem", swatch: ["#f6f4e9", "#464e2e"], tags: ["reguler"] },
  { key: "sahara", label: "Sahara", description: "Krem & terracotta pasir, foto arch tinggi, galeri grid lightbox, story dua kolom", swatch: ["#fffdf9", "#ae8f7a"], tags: ["reguler"] },
  { key: "midnight-aurora", label: "Midnight Aurora", description: "Navy-ungu malam, aurora bergerak, orbit perak & aksen konstelasi", swatch: ["#071126", "#a88bff"], tags: ["premium"] },
  { key: "luxury-art-garden", label: "Luxury Art — Garden Valley", description: "Luxury art bernuansa midnight blue, botanical relief, bingkai galeri & aksen antique gold", swatch: ["#e8eef5", "#173f67"], tags: ["luxury-art", "premium"], addedAt: "2026-08-21" },
  { key: "luxury-art-love-paradise", label: "Luxury Art — Love Paradise", description: "Ivory, powder blue dan lavender, taman lembah watercolor, bingkai oval berlapis, floral relief dan animasi kabut yang lembut", swatch: ["#f4f7f4", "#2f7cc8"], tags: ["luxury-art", "premium"], addedAt: "2026-08-25" },
  { key: "luxury-art-champagne-romance", label: "Luxury Art — Champagne Romance", description: "Warm champagne, taupe dan ivory dengan layout editorial, panel organik, tipografi vertikal dan foto wedding dominan", swatch: ["#f7f1e7", "#b9ad98"], tags: ["luxury-art", "premium"], addedAt: "2026-08-27" },
  { key: "luxury-art-java-heritage", label: "Luxury Art — Java Heritage", description: "Ivory, marun dan emas antik, lanskap joglo berlapis, floral Jawa dan transisi sinematik", swatch: ["#eee6d7", "#6f261f"], tags: ["luxury-art", "premium", "adat"], addedAt: "2026-08-24" },
  { key: "luxury-art-sakura", label: "Luxury Art — Sakura Romance", description: "Ivory dan blush Sakura, lanskap watercolor Jepang, foto arch, kelopak jatuh dan transisi floral sinematik", swatch: ["#fff9f4", "#c98382"], tags: ["luxury-art", "premium"], addedAt: "2026-08-25" },
  { key: "luxury-art-soft", label: "Luxury Art — Art Soft", description: "Watercolor garden, frame arch, cover video sinematik, countdown, gift, RSVP dan wishes bergaya editorial", swatch: ["#efe6da", "#6c4435"], tags: ["luxury-art", "premium"], addedAt: "2026-08-30" },
  { key: "3d-motion", label: "Botanical Romance", description: "Sage, ivory dan floral transparan dengan cover sinematik, galeri masonry dan RSVP", swatch: ["#edf1e6", "#85a57a"], tags: ["luxury-art", "premium"], addedAt: "2026-09-02" },
  { key: "porcelain-bloom", label: "Porcelain Bloom", description: "Ivory & powder blue, porselen klasik, mutiara, pita satin & floral biru", swatch: ["#fbfaf6", "#2d638f"], tags: ["premium"] },
  { key: "love-chronicle", label: "Love Chronicle", description: "Champagne & burgundy, wedding newspaper, cap pos, perangko & wax seal", swatch: ["#f4eddf", "#7a2433"], tags: ["premium"] },
  { key: "velvet-cinema", label: "Velvet Cinema", description: "Merah beludru & hitam, premiere film, marquee lights, tiket VIP & filmstrip", swatch: ["#0a0909", "#761423"], tags: ["premium"] },
  { key: "prismatic-vows", label: "Prismatic Vows", description: "Indigo, lilac & cyan, kaca holografik, prisma cahaya & galeri refraksi", swatch: ["#0c0b1d", "#76e7ef"], tags: ["premium"] },
  { key: "pearl-tide", label: "Pearl Tide", description: "Deep ocean & seafoam, kerang, mutiara, riak air & bingkai pesisir organik", swatch: ["#071f29", "#dcebea"], tags: ["reguler"] },
];

export const aqiqahThemeRegistry: Record<string,(props:{invitation:AqiqahInvitationData})=>React.JSX.Element> = {
  "akikah-nur": AkikahNur,"akikah-zaitun": AkikahZaitun,"akikah-ceria": AkikahCeria,"akikah-anugerah": AkikahAnugerah,"akikah-safir": AkikahSafir,"akikah-kasih": AkikahKasih,"akikah-damai": AkikahDamai,
};
export const aqiqahThemeList: ThemeMeta[] = [
  {key:"akikah-nur",label:"Akikah Nur",description:"Biru langit lembut, krem & emas madu, medali foto bayi, kartu doa",swatch:["#f7fafc","#5b8bb0"]},
  {key:"akikah-zaitun",label:"Akikah Zaitun",description:"Sage & krem lime, medali foto bulat, kartu acara arch, galeri grid olive",swatch:["#f7ffdc","#6c7e2f"]},
  {key:"akikah-ceria",label:"Akikah Ceria",description:"Krem, coral & sage ceria, garland bunting, balon, medali foto organik",swatch:["#fff8f0","#e8927c"]},
  {key:"akikah-anugerah",label:"Akikah Anugerah",description:"Blush, charcoal & emas antik, aksen line-art halus, bingkai galeri tipis, galeri masonry",swatch:["#faf6f1","#a9835a"]},
  {key:"akikah-safir",label:"Akikah Safir",description:"Navy & emas, motif bintang geometris Islami, bingkai foto heksagon, galeri honeycomb",swatch:["#f6f4ee","#182a4d"]},
  {key:"akikah-kasih",label:"Akikah Kasih",description:"Pastel mint, peach & lavender, ilustrasi beruang & awan, bingkai foto scallop, galeri polaroid",swatch:["#fffaf4","#e8a795"]},
  {key:"akikah-damai",label:"Akikah Damai",description:"Terracotta & teal boho, motif gajah & bunting, bingkai foto teepee, foto asli bertema nursery",swatch:["#faf6f0","#c17a52"]},
];

export const khitanThemeRegistry: Record<string,(props:{invitation:KhitanInvitationData})=>React.JSX.Element> = {
  "khitan-warna":KhitanWarna,"khitan-ksatria":KhitanKsatria,"khitan-raja":KhitanRaja,"khitan-berani":KhitanBerani,"khitan-petualang":KhitanPetualang,"khitan-elang":KhitanElang,
};
export const khitanThemeList: ThemeMeta[] = [
  {key:"khitan-warna",label:"Khitan Warna",description:"Biru dusty & krem, medali foto bulat, motif daun emas, galeri grid",swatch:["#eef3f9","#5b89aa"]},
  {key:"khitan-ksatria",label:"Khitan Ksatria",description:"Hijau hutan & emas, bingkai foto perisai heraldik, crest laurel, tema ksatria cilik",swatch:["#f7f4ec","#24402f"]},
  {key:"khitan-raja",label:"Khitan Raja",description:"Merah marun & emas, bingkai foto arch istana, motif mahkota, tema raja sehari",swatch:["#f8f2e9","#5c1a2b"]},
  {key:"khitan-berani",label:"Khitan Berani",description:"Biru langit & kuning cerah, bingkai foto sertifikat garis putus, motif medali pemberani",swatch:["#fffbf0","#4fa8d8"]},
  {key:"khitan-petualang",label:"Khitan Petualang",description:"Khaki olive & terracotta, bingkai foto oktagon, motif kompas si kecil petualang",swatch:["#f7f2e7","#5c6b3f"]},
  {key:"khitan-elang",label:"Khitan Elang",description:"Arang & krem minimalis modern, bingkai foto diamond, motif garis elang, tipografi sans-serif",swatch:["#faf9f5","#2b2b2b"]},
];

export const birthdayThemeRegistry: Record<string,(props:{invitation:BirthdayInvitationData})=>React.JSX.Element> = {
  "princess-fairytale":PrincessBirthday,"space-explorer":SpaceBirthday,"dinosaur-adventure":DinoBirthday,"superhero-city":SuperheroBirthday,
};
export const birthdayThemeList: ThemeMeta[] = [
  {key:"princess-fairytale",label:"Princess Fairytale",description:"Pink, ivory & emas dengan kastel, mahkota dan suasana pesta putri kerajaan",swatch:["#fff8fd","#d99abb"],addedAt:"2026-07-27"},
  {key:"space-explorer",label:"Space Explorer",description:"Navy, oranye & cyan dengan roket, planet dan suasana misi luar angkasa",swatch:["#0b1633","#ff8c3d"],addedAt:"2026-07-27"},
  {key:"dinosaur-adventure",label:"Dinosaur Adventure",description:"Hijau hutan, rust & amber dengan dinosaurus, pakis raksasa dan suasana ekspedisi purba",swatch:["#1f3d2e","#e8a33d"],addedAt:"2026-07-28"},
  {key:"superhero-city",label:"Superhero City",description:"Biru, merah & emas bergaya komik dengan kota metropolitan dan suasana misi kepahlawanan",swatch:["#0a1230","#fbbf24"],addedAt:"2026-07-28"},
];
