import type { Brand, GiftAccount, OpeningText } from "@/types/invitation";

export type BirthdayInvitationData = {
  id: number;
  slug: string;
  theme: string;
  status: string;
  category: "birthday";
  brand: Brand;
  coverImage: string | null;
  musicUrl: string | null;
  videoUrl: string | null;
  mapsUrl: string | null;
  mapsEmbedUrl: string | null;
  opening: OpeningText;
  child: {
    name: string;
    photo: string | null;
    age: number | null;
    birthDate: string | null;
  };
  parents: {
    father: string;
    mother: string;
  };
  event: {
    date: string;
    rawDate: string | null;
    time: string;
    location: string;
  } | null;
  gallery: string[];
  gifts: GiftAccount[];
};
