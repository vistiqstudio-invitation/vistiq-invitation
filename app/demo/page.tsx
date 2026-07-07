import LuxuryGold from "@/themes/luxury-gold/LuxuryGold";

const invitation = {
  groom_name: "Rizky Pratama",
  bride_name: "Nabila Putri",

  story:
    "Kami dipertemukan dalam sebuah perjalanan yang indah hingga akhirnya memutuskan untuk menikah.",

  akad_date: "20 September 2026",
  akad_time: "08.00 WIB",

  resepsi_date: "20 September 2026",
  resepsi_time: "11.00 WIB",

  location: "Grand Ballroom Vistiq",

  maps: "https://maps.google.com",

  gallery: [],

  video: "",

  bank_name: "BCA",
  bank_number: "123456789",
  bank_holder: "Rizky Pratama",
};

export default function DemoPage() {
  return <LuxuryGold invitation={invitation} />;
}