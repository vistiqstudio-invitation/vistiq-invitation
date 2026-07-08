import LuxuryGold from "@/themes/luxury-gold/LuxuryGold";
import type { InvitationData } from "@/types/invitation";

const invitation: InvitationData = {
  id: 0,
  slug: "demo",
  theme: "luxury-gold",
  status: "active",

  coverImage: "/themes/luxury-gold/cover.png",
  musicUrl: "/music/wedding2.mp3",
  videoUrl: null,

  mapsUrl: "https://maps.google.com",
  mapsEmbedUrl: null,

  groom: {
    name: "Rizky Pratama",
    parents: "Bapak Yusuf & Ibu Fatimah",
    photo: "/themes/luxury-gold/groom.png",
    instagram: null,
  },

  bride: {
    name: "Nabila Putri",
    parents: "Bapak Ahmad & Ibu Siti",
    photo: "/themes/luxury-gold/bride.png",
    instagram: null,
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
      time: "08.00 WIB",
      location: "Gedung Serbaguna Vistiq, Jakarta",
    },
    {
      name: "Resepsi",
      date: "Minggu, 20 September 2026",
      time: "11.00 WIB",
      location: "Gedung Serbaguna Vistiq, Jakarta",
    },
  ],

  gallery: [
    "/gallery/1.jpg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.jpg",
    "/gallery/5.jpg",
    "/gallery/6.jpg",
  ],

  gift: {
    bankName: "BCA",
    accountNumber: "1234567890",
    accountName: "Rizky Pratama",
  },
};

export default function DemoPage() {
  return <LuxuryGold invitation={invitation} />;
}
