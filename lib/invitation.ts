import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Brand,
  EventItem,
  GiftAccount,
  InvitationData,
  OpeningText,
  StoryItem,
} from "@/types/invitation";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import type { KhitanInvitationData } from "@/types/khitan";
import type { BirthdayInvitationData } from "@/types/birthday";

function resolveBrand(raw: Record<string, any>): Brand {
  const reseller = raw.clients?.resellers;
  if (!reseller || !reseller.brand_name || reseller.status !== "active") return null;

  if (reseller.package === "reseller") {
    return {
      name: reseller.brand_name,
      logoUrl: reseller.logo_url || null,
      color: reseller.brand_color || null,
    };
  }

  if (reseller.package !== "reseller_brand" || !reseller.brand_active) return null;

  // Reseller Brand is now a Rp99.000/month subscription (grandfathered
  // lifetime resellers have brand_expires_at = null and never hit this).
  // A lapsed subscription falls back to default Vistiq branding until the
  // owner manually extends brand_expires_at after a renewal payment.
  if (reseller.brand_expires_at && new Date(reseller.brand_expires_at) <= new Date()) {
    return null;
  }

  return {
    name: reseller.brand_name,
    logoUrl: reseller.logo_url || null,
    color: reseller.brand_color || null,
  };
}

function resolveOpening(raw: Record<string, any>): OpeningText {
  return {
    greeting: raw.opening_greeting || null,
    title: raw.opening_title || null,
    description: raw.opening_description || null,
    quote: raw.opening_quote || null,
    quoteSource: raw.opening_quote_source || null,
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
  const story: StoryItem[] = [1, 2, 3, 4, 5]
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
    category: "wedding",

    brand: resolveBrand(raw),

    coverImage: firstNonEmpty(raw.cover_image, raw.cover_photo),
    musicUrl: raw.music_url || null,
    videoUrl: firstNonEmpty(raw.video_url, raw.youtube_url),

    mapsUrl: firstNonEmpty(raw.maps_url, raw.location, raw.map_link),
    mapsEmbedUrl: firstNonEmpty(raw.maps_embed, raw.map_embed),

    opening: resolveOpening(raw),

    groom: {
      name: raw.groom_name || "",
      nickname: firstNonEmpty(raw.groom_nickname),
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
      nickname: firstNonEmpty(raw.bride_nickname),
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

function normalizeAqiqahInvitation(raw: Record<string, any>): AqiqahInvitationData {
  const event: AqiqahInvitationData["event"] =
    raw.aqiqah_date || raw.aqiqah_location || raw.aqiqah_time
      ? {
          date: formatDate(raw.aqiqah_date),
          rawDate: toRawDate(raw.aqiqah_date, raw.aqiqah_time || ""),
          time: raw.aqiqah_time || "",
          location: raw.aqiqah_location || "",
        }
      : null;

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

  const giftBankName = firstNonEmpty(raw.gift_bank_name, raw.bank_name);
  const giftAccountNumber = firstNonEmpty(raw.gift_account_number, raw.bank_account);
  const giftAccountName = firstNonEmpty(raw.gift_account_name, raw.bank_holder);

  const gifts: GiftAccount[] = [];
  if (giftBankName || giftAccountNumber) {
    gifts.push({
      owner: "Orang Tua Bayi",
      bankName: giftBankName,
      accountNumber: giftAccountNumber,
      accountName: giftAccountName,
    });
  }

  return {
    id: raw.id,
    slug: raw.slug,
    theme: raw.theme || "akikah-langit",
    status: raw.status || (raw.is_active ? "active" : "draft"),
    category: "aqiqah",

    brand: resolveBrand(raw),

    coverImage: firstNonEmpty(raw.cover_image, raw.cover_photo),
    musicUrl: raw.music_url || null,
    videoUrl: firstNonEmpty(raw.video_url, raw.youtube_url),

    mapsUrl: firstNonEmpty(raw.maps_url, raw.location, raw.map_link),
    mapsEmbedUrl: firstNonEmpty(raw.maps_embed, raw.map_embed),

    opening: resolveOpening(raw),

    baby: {
      name: raw.baby_name || "",
      gender: raw.baby_gender === "L" || raw.baby_gender === "P" ? raw.baby_gender : null,
      photo: firstNonEmpty(raw.cover_image, raw.cover_photo),
      birthDate: raw.birth_date ? formatDate(raw.birth_date) : null,
      birthPlace: raw.birth_place || null,
    },

    parents: {
      father: raw.father_name || "",
      mother: raw.mother_name || "",
    },

    event,

    gallery,

    gifts,
  };
}

function normalizeKhitanInvitation(raw: Record<string, any>): KhitanInvitationData {
  const event: KhitanInvitationData["event"] =
    raw.aqiqah_date || raw.aqiqah_location || raw.aqiqah_time
      ? {
          date: formatDate(raw.aqiqah_date),
          rawDate: toRawDate(raw.aqiqah_date, raw.aqiqah_time || ""),
          time: raw.aqiqah_time || "",
          location: raw.aqiqah_location || "",
        }
      : null;

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

  const giftBankName = firstNonEmpty(raw.gift_bank_name, raw.bank_name);
  const giftAccountNumber = firstNonEmpty(raw.gift_account_number, raw.bank_account);
  const giftAccountName = firstNonEmpty(raw.gift_account_name, raw.bank_holder);

  const gifts: GiftAccount[] = [];
  if (giftBankName || giftAccountNumber) {
    gifts.push({
      owner: "Orang Tua",
      bankName: giftBankName,
      accountNumber: giftAccountNumber,
      accountName: giftAccountName,
    });
  }

  return {
    id: raw.id,
    slug: raw.slug,
    theme: raw.theme || "khitan-warna",
    status: raw.status || (raw.is_active ? "active" : "draft"),
    category: "khitan",

    brand: resolveBrand(raw),

    coverImage: firstNonEmpty(raw.cover_image, raw.cover_photo),
    musicUrl: raw.music_url || null,
    videoUrl: firstNonEmpty(raw.video_url, raw.youtube_url),

    mapsUrl: firstNonEmpty(raw.maps_url, raw.location, raw.map_link),
    mapsEmbedUrl: firstNonEmpty(raw.maps_embed, raw.map_embed),

    opening: resolveOpening(raw),

    child: {
      name: raw.baby_name || "",
      photo: firstNonEmpty(raw.cover_image, raw.cover_photo),
      birthDate: raw.birth_date ? formatDate(raw.birth_date) : null,
      birthPlace: raw.birth_place || null,
    },

    parents: {
      father: raw.father_name || "",
      mother: raw.mother_name || "",
    },

    event,

    gallery,

    gifts,
  };
}

function normalizeBirthdayInvitation(raw: Record<string, any>): BirthdayInvitationData {
  const event: BirthdayInvitationData["event"] =
    raw.aqiqah_date || raw.aqiqah_location || raw.aqiqah_time
      ? {
          date: formatDate(raw.aqiqah_date),
          rawDate: toRawDate(raw.aqiqah_date, raw.aqiqah_time || ""),
          time: raw.aqiqah_time || "",
          location: raw.aqiqah_location || "",
        }
      : null;

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

  const gifts: GiftAccount[] = [];
  const bankName = firstNonEmpty(raw.gift_bank_name, raw.bank_name);
  const accountNumber = firstNonEmpty(raw.gift_account_number, raw.bank_account);
  if (bankName || accountNumber) {
    gifts.push({
      owner: "Orang Tua",
      bankName,
      accountNumber,
      accountName: firstNonEmpty(raw.gift_account_name, raw.bank_holder),
    });
  }

  const parsedAge = Number(firstNonEmpty(raw.child_age, raw.birthday_age, raw.age));

  return {
    id: raw.id,
    slug: raw.slug,
    theme: raw.theme || "princess-fairytale",
    status: raw.status || (raw.is_active ? "active" : "draft"),
    category: "birthday",
    brand: resolveBrand(raw),
    coverImage: firstNonEmpty(raw.cover_image, raw.cover_photo),
    musicUrl: raw.music_url || null,
    videoUrl: firstNonEmpty(raw.video_url, raw.youtube_url),
    mapsUrl: firstNonEmpty(raw.maps_url, raw.location, raw.map_link),
    mapsEmbedUrl: firstNonEmpty(raw.maps_embed, raw.map_embed),
    opening: resolveOpening(raw),
    child: {
      name: raw.baby_name || "",
      photo: firstNonEmpty(raw.cover_image, raw.cover_photo),
      age: Number.isFinite(parsedAge) && parsedAge > 0 ? parsedAge : null,
      birthDate: raw.birth_date ? formatDate(raw.birth_date) : null,
    },
    parents: {
      father: raw.father_name || "",
      mother: raw.mother_name || "",
    },
    event,
    gallery,
    gifts,
  };
}

export async function getInvitationBySlug(
  slug: string
): Promise<
  | InvitationData
  | AqiqahInvitationData
  | KhitanInvitationData
  | BirthdayInvitationData
  | null
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invitations")
    .select(
      "*, clients:client_id(resellers:reseller_id(brand_name, logo_url, brand_color, brand_active, brand_expires_at, package, status))"
    )
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  if (data.category === "aqiqah") return normalizeAqiqahInvitation(data);
  if (data.category === "khitan") return normalizeKhitanInvitation(data);
  if (data.category === "birthday") return normalizeBirthdayInvitation(data);
  return normalizeInvitation(data);
}
