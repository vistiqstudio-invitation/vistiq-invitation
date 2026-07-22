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

// The opening greeting block (eyebrow, title paragraph, courtesy text,
// verse/quote+citation) shown near the top of most themes. Every field is
// nullable - null means "use this theme's own hardcoded default text".
// Shared across all 3 categories since it's the same editable block.
export type OpeningText = {
  greeting: string | null;
  title: string | null;
  description: string | null;
  quote: string | null;
  quoteSource: string | null;
};

export type InvitationData = {
  id: number;
  slug: string;
  theme: string;
  status: string;
  category: "wedding";

  // Reseller white-label branding, if this invitation's client belongs to
  // a reseller with an active branding package. Null means "show the
  // default Vistiq Invitation branding".
  brand: Brand;

  coverImage: string | null;
  musicUrl: string | null;
  videoUrl: string | null;

  mapsUrl: string | null;
  mapsEmbedUrl: string | null;

  opening: OpeningText;

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
  // "Mempelai Pria"/"Mempelai Wanita" for wedding invitations, "Orang Tua
  // Bayi" for aqiqah - kept as a plain string since gift accounts are
  // shared across both invitation categories.
  owner: string;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
};
