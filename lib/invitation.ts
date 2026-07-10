import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Brand,
  EventItem,
  GiftAccount,
  InvitationData,
  StoryItem,
} from "@/types/invitation";

function resolveBrand(raw: Record<string, any>): Brand {
  const reseller = raw.clients?.resellers;
  if (!reseller || !reseller.brand_active || !reseller.brand_name) return null;

  return {
    name: reseller.brand_name,
    logoUrl: reseller.logo_url || null,
    color: reseller.brand_color || null,
  };
}

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

function toRawDate(value: string | null, time: string) {
  if (!value) return null;

  const isoMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
  if (!isoMatch) return null;

  const timeMatch = time.match(/(\d{1,2})[.:](\d{2})/);
  const [hours, minutes] = timeMatch
    ? [timeMatch[1].padStart(2, "0"), timeMatch[2]]
    : ["00", "00"];

  return `${isoMatch[0]}T${hours}:${minutes}:00`;
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
      rawDate: toRawDate(akadDate, raw.akad_time || ""),
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
      rawDate: toRawDate(receptionDate, raw.reception_time || ""),
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

  // The gift_*/bank_*/account_* columns predate per-person accounts and
  // aren't tied to either side - treat them as the groom's account unless
  // he already has a dedicated one.
  const groomBankName = firstNonEmpty(
    raw.groom_bank_name,
    raw.gift_bank_name,
    raw.bank_name
  );
  const groomAccountNumber = firstNonEmpty(
    raw.groom_bank_account,
    raw.gift_account_number,
    raw.bank_account,
    raw.account_number
  );
  const groomAccountName = firstNonEmpty(
    raw.groom_bank_holder,
    raw.gift_account_name,
    raw.bank_holder,
    raw.account_name
  );

  const brideBankName = firstNonEmpty(raw.bride_bank_name);
  const brideAccountNumber = firstNonEmpty(raw.bride_bank_account);
  const brideAccountName = firstNonEmpty(raw.bride_bank_holder);

  const gifts: GiftAccount[] = [];

  if (groomBankName || groomAccountNumber) {
    gifts.push({
      owner: "Mempelai Pria",
      bankName: groomBankName,
      accountNumber: groomAccountNumber,
      accountName: groomAccountName,
    });
  }

  if (brideBankName || brideAccountNumber) {
    gifts.push({
      owner: "Mempelai Wanita",
      bankName: brideBankName,
      accountNumber: brideAccountNumber,
      accountName: brideAccountName,
    });
  }

  return {
    id: raw.id,
    slug: raw.slug,
    theme: raw.theme || "luxury-gold",
    status: raw.status || (raw.is_active ? "active" : "draft"),

    brand: resolveBrand(raw),

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

    gifts,
  };
}

export async function getInvitationBySlug(
  slug: string
): Promise<InvitationData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invitations")
    .select(
      "*, clients:client_id(resellers:reseller_id(brand_name, logo_url, brand_color, brand_active))"
    )
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return normalizeInvitation(data);
}
