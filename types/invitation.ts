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

export type InvitationData = {
  id: number;
  slug: string;
  theme: string;
  status: string;

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

  gift: {
    bankName: string | null;
    accountNumber: string | null;
    accountName: string | null;
  } | null;
};
