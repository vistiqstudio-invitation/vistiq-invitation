import type { Brand, GiftAccount, OpeningText } from "@/types/invitation";

export type KhitanInvitationData = {
  id: number;
  slug: string;
  theme: string;
  status: string;
  category: "khitan";

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
