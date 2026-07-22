import type { Brand, GiftAccount, OpeningText } from "@/types/invitation";

export type AqiqahInvitationData = {
  id: number;
  slug: string;
  theme: string;
  status: string;
  category: "aqiqah";

  brand: Brand;

  coverImage: string | null;
  musicUrl: string | null;
  videoUrl: string | null;

  mapsUrl: string | null;
  mapsEmbedUrl: string | null;

  opening: OpeningText;

  baby: {
    name: string;
    gender: "L" | "P" | null;
    photo: string | null;
    birthDate: string | null;
    birthPlace: string | null;
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
