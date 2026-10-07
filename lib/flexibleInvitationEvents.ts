import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { EventItem, InvitationData } from "@/types/invitation";

type StoredEvent = {
  name?: unknown;
  date?: unknown;
  time?: unknown;
  location?: unknown;
  mapsUrl?: unknown;
};

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function formatDate(value: string) {
  if (!value) return "";
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

function toRawDate(value: string, time: string) {
  if (!value) return null;
  const isoMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
  if (!isoMatch) return null;

  const timeMatch = time.match(/(\d{1,2})[.:](\d{2})/);
  const [hours, minutes] = timeMatch
    ? [timeMatch[1].padStart(2, "0"), timeMatch[2]]
    : ["00", "00"];

  return `${isoMatch[0]}T${hours}:${minutes}:00`;
}

function normalizeStoredEvents(value: unknown): EventItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, 4)
    .map((raw) => {
      const item = (raw && typeof raw === "object" ? raw : {}) as StoredEvent;
      const name = asText(item.name);
      const date = asText(item.date);
      const time = asText(item.time);
      const location = asText(item.location);
      const mapsUrl = asText(item.mapsUrl);

      return {
        name,
        date: formatDate(date),
        rawDate: toRawDate(date, time),
        time,
        location,
        mapsUrl: mapsUrl || null,
      } satisfies EventItem;
    })
    .filter((event) => Boolean(event.name || event.date || event.time || event.location));
}

export async function applyFlexibleWeddingEvents(invitation: InvitationData) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select("events, cover_event_index")
    .eq("id", invitation.id)
    .maybeSingle();

  const events = normalizeStoredEvents(data?.events);
  if (events.length === 0) return invitation;

  const requestedIndex =
    typeof data?.cover_event_index === "number" ? data.cover_event_index : 0;
  const coverIndex = Math.min(Math.max(requestedIndex, 0), events.length - 1);
  const coverEvent = events[coverIndex] || events[0] || null;
  const mapsUrl =
    coverEvent?.mapsUrl ||
    events.find((event) => event.mapsUrl)?.mapsUrl ||
    invitation.mapsUrl;

  return {
    ...invitation,
    events,
    coverEvent,
    mapsUrl: mapsUrl || null,
  } satisfies InvitationData;
}
