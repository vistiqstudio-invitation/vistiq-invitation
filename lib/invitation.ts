import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { EventItem, InvitationData, StoryItem } from "@/types/invitation";

// The invitations table accumulated a few duplicate/renamed columns across
// earlier iterations (e.g. gallery1 vs gallery_1, video_url vs youtube_url).
// This normalizer is the single place that resolves those and hands every
// theme a clean, consistent shape - themes never read raw Supabase columns.
function firstNonEmpty(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (value && value.trim().length > 0) return value;
  }
  return null;
}

function formatDate(value: string | null) {
  if (!value) return "";

  // Already human-written (e.g. "Minggu, 20 September 2026") - leave as is.
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function normalizeInvitation(raw: Record<string, any>): InvitationData {
  const story: StoryItem[] = [1, 2, 3]
    .map((n) => ({
      year: raw[`story_${n}_year`] || "",
      title: raw[`story_${n}_title`],
      description: raw[`story_${n}_desc`],
    }))
    .filter((item): item is StoryItem => Boolean(item.title && item.description));

  const events: EventItem[] = [];

  const akadDate = firstNonEmpty(raw.akad_date, raw.event_date);
  if (akadDate || raw.akad_location || raw.akad_time) {
    events.push({
      name: "Akad Nikah",
      date: formatDate(akadDate),
      time: raw.akad_time || "",
      location: raw.akad_location || "",
    });
  }

  const receptionDate = firstNonEmpty(
    raw.resepsi_date,
    raw.reception_date,
    raw.event_date
  );
  if (receptionDate || raw.reception_location || raw.reception_time) {
    events.push({
      name: "Resepsi",
      date: formatDate(receptionDate),
      time: raw.reception_time || "",
      location: firstNonEmpty(raw.reception_location, raw.resepsi_location) || "",
    });
  }

  const gallery = [
    raw.gallery_1,
    raw.gallery_2,
    raw.gallery_3,
    raw.gallery_4,
    raw.gallery1,
    raw.gallery2,
    raw.gallery3,
    raw.gallery4,
    raw.gallery5,
    raw.gallery6,
    ...(Array.isArray(raw.gallery_photos) ? raw.gallery_photos : []),
  ].filter((url): url is string => Boolean(url));

  const bankName = firstNonEmpty(raw.gift_bank_name, raw.bank_name);
  const accountNumber = firstNonEmpty(raw.gift_account_number, raw.bank_account, raw.account_number);
  const accountName = firstNonEmpty(raw.gift_account_name, raw.bank_holder, raw.account_name);

  return {
    id: raw.id,
    slug: raw.slug,
    theme: raw.theme || "luxury-gold",
    status: raw.status || (raw.is_active ? "active" : "draft"),

    coverImage: firstNonEmpty(raw.cover_image, raw.cover_photo),
    musicUrl: raw.music_url || null,
    videoUrl: firstNonEmpty(raw.video_url, raw.youtube_url),

    mapsUrl: firstNonEmpty(raw.maps_url, raw.location, raw.map_link),
    mapsEmbedUrl: firstNonEmpty(raw.maps_embed, raw.map_embed),

    groom: {
      name: raw.groom_name || "",
      parents: firstNonEmpty(
        raw.groom_parent,
        raw.groom_father && raw.groom_mother
          ? `${raw.groom_father} & ${raw.groom_mother}`
          : null
      ),
      photo: raw.groom_photo || null,
      instagram: raw.groom_instagram || null,
    },

    bride: {
      name: raw.bride_name || "",
      parents: firstNonEmpty(
        raw.bride_parent,
        raw.bride_father && raw.bride_mother
          ? `${raw.bride_father} & ${raw.bride_mother}`
          : null
      ),
      photo: raw.bride_photo || null,
      instagram: raw.bride_instagram || null,
    },

    story,
    events,
    gallery,

    gift: bankName || accountNumber ? { bankName, accountNumber, accountName } : null,
  };
}

export async function getInvitationBySlug(
  slug: string
): Promise<InvitationData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return normalizeInvitation(data);
}
