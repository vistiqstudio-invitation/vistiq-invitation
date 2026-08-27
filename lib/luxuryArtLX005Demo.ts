import type { InvitationData } from "@/types/invitation";
import { WEDDING_VOCAL_TRACKS } from "@/lib/weddingMusic";

const GALLERY = [
  "/photos/luxury-art-love-paradise/hero.webp",
  "/photos/luxury-art-love-paradise/gallery-01.webp",
  "/photos/luxury-art-love-paradise/gallery-02.webp",
  "/photos/luxury-art-love-paradise/gallery-03.webp",
  "/photos/luxury-art-love-paradise/gallery-04.webp",
  "/photos/luxury-art-love-paradise/gallery-05.webp",
  "/photos/luxury-art-love-paradise/gallery-06.webp",
];

export function withLuxuryArtLX005DemoAssets(
  theme: string,
  invitation: InvitationData,
): InvitationData {
  if (theme !== "luxury-art-lx005") return invitation;

  return {
    ...invitation,
    coverImage: "/photos/luxury-art-love-paradise/couple-cover.webp",
    musicUrl: WEDDING_VOCAL_TRACKS.indonesianBallad,
    opening: {
      ...invitation.opening,
      greeting: "Assalamu’alaikum Wr. Wb.",
      description:
        "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami.",
      quote:
        "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu merasa tenteram kepadanya.",
      quoteSource: "QS. Ar-Rum : 21",
    },
    bride: {
      ...invitation.bride,
      name: "Alya Maharani",
      nickname: "Alya",
      parents: "Bapak H. Rahmat & Ibu Hj. Sari",
      instagram: "alyamaharani",
      photo: "/photos/luxury-art-love-paradise/bride.webp",
    },
    groom: {
      ...invitation.groom,
      name: "Raka Pratama",
      nickname: "Raka",
      parents: "Bapak H. Ahmad & Ibu Hj. Lina",
      instagram: "rakapratama",
      photo: "/photos/luxury-art-love-paradise/groom.webp",
    },
    gallery: GALLERY,
    story: [
      {
        year: "2022",
        title: "First Meet",
        description:
          "Pertemuan sederhana membawa kami pada obrolan-obrolan panjang dan rasa nyaman yang tumbuh perlahan.",
      },
      {
        year: "2024",
        title: "Engagement",
        description:
          "Setelah saling mengenal dan bertumbuh, kami meminta restu keluarga untuk melangkah lebih serius.",
      },
      {
        year: "2026",
        title: "Forever Begins",
        description:
          "Dengan penuh syukur kami memilih untuk berjalan bersama dan memulai babak baru dalam ikatan pernikahan.",
      },
    ],
    gifts: invitation.gifts.map((account) =>
      account.owner === "Mempelai Pria"
        ? { ...account, accountName: "Raka Pratama" }
        : account.owner === "Mempelai Wanita"
          ? { ...account, accountName: "Alya Maharani" }
          : account,
    ),
  };
}
