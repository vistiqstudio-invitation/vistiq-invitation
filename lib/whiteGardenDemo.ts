import type { InvitationData } from "@/types/invitation";
const base = "/themes/luxury-art-white-garden/";
export function withWhiteGardenDemo(theme: string, invitation: InvitationData): InvitationData {
  if (theme !== "luxury-art-white-garden") return invitation;
  return { ...invitation,
    coverImage: `${base}DLLADE1.jpeg`,
    heroImage: `${base}della-ade-5a.jpg`,
    closingImage: `${base}DLLADE10.jpeg`,
    musicUrl: `${base}reference-music.mp3`,
    bride: { name: "Amalia Della", nickname: "Della", parents: "Bpk. & Ibu", instagram: "instagram", photo: `${base}della-ade-11a.jpg` },
    groom: { name: "Moch Ade", nickname: "Ade", parents: "Bpk. & Ibu", instagram: "instagram", photo: `${base}della-ade-12.jpg` },
    events: [
      { name: "Akad Nikah", date: "Rabu, 02 Oktober 2030", rawDate: "2030-10-02T08:00:00+07:00", time: "Pukul : 08.00 WIB", location: "Kediaman Mempelai Wanita\nJalan Jalan" },
      { name: "Resepsi", date: "Rabu, 02 Oktober 2030", rawDate: "2030-10-02T10:00:00+07:00", time: "Pukul : 10.00 WIB - Selesai", location: "Kediaman Mempelai Wanita\nJalan Jalan" },
    ],
    gallery: ["DLLADE2.jpeg", "DLLADE3.jpeg", "DLLADE4.jpeg", "DLLADE6.jpeg", "DLLADE7.jpeg", "DLLADE8.jpeg"].map(file => base + file),
    story: [
      { year: "1 May 2018", title: "Awal Bertemu", description: "Kami tak sengaja bertemu dalam acara makan bersama di suatu acara yang diselenggarakan kampus." },
      { year: "1 June 2018", title: "Jadian", description: "Setelah kenal beberapa waktu akhirnya kami memutuskan untuk berkomitmen dan saling berjanji untuk setia." },
      { year: "1 July 2018", title: "Lamaran", description: "Di hari itu keluarga kami saling bertemu dan berkenalan. Alhamdulillah berjalan lancar dan kami sepakat menentukan tanggal akad nikah." },
    ],
    gifts: [{ owner: "Mempelai Wanita", bankName: "MANDIRI", accountName: "Nama Mempelai", accountNumber: "0000000000000000" }, { owner: "Mempelai Pria", bankName: "BCA", accountName: "Nama Mempelai", accountNumber: "000000000000" }],
  };
}
