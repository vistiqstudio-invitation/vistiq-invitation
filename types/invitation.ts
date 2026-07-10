export type StoryItem = {
  year: string;
  title: string;
  description: string;
};

export type EventItem = {
  name: string;
  date: string;
  rawDate: string | null;
  time: string;
  location: string;
};

export type Brand = {
  name: string;
  logoUrl: string | null;
  color: string | null;
} | null;

export type InvitationData = {
  id: number;
  slug: string;
  theme: string;
  status: string;

  // Reseller white-label branding, if this invitation's client belongs to
  // a reseller with an active branding package. Null means "show the
  // default Vistiq Invitation branding".
  brand: Brand;

  coverImage: string | null;
  musicUrl: string | null;
  videoUrl: string | null;

  mapsUrl: string | null;
  mapsEmbedUrl: string | null;

  groom: {
    name: string;
    parents: string | null;
    photo: string | null;
    instagram: string | null;
  };

  bride: {
    name: string;
    parents: string | null;
    photo: string | null;
    instagram: string | null;
  };

  story: StoryItem[];
  events: EventItem[];
  gallery: string[];

  gifts: GiftAccount[];
};

export type GiftAccount = {
  owner: "Mempelai Pria" | "Mempelai Wanita";
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
};
