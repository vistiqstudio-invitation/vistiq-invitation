import "server-only";

import type { EventItem, InvitationData } from "@/types/invitation";

type StoredEvent = {
  name?: unknown;
  date?: unknown;
  time?: unknown;
  location?: unknown;
  mapsUrl?: unknown;
};

type FlexibleEventRow = {
  events?: unknown;
  cover_event_index?: unknown;
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

async function getFlexibleEventRow(invitationId: string): Promise<FlexibleEventRow | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;

  try {
    const url = new URL("/rest/v1/invitations", supabaseUrl);
    url.searchParams.set("id", `eq.${invitationId}`);
    url.searchParams.set("select", "events,cover_event_index");
    url.searchParams.set("limit", "1");

    const response = await fetch(url, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: "application/json",
      },
      next: {
        // These values rarely change while guests are opening an invitation.
        // A short shared cache removes a database round-trip on every page view
        // while keeping client edits visible within roughly half a minute.
        revalidate: 30,
        tags: [`invitation-events-${invitationId}`],
      },
    });

    if (!response.ok) return null;
    const rows = (await response.json()) as FlexibleEventRow[];
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function applyFlexibleWeddingEvents(invitation: InvitationData) {
  const data = await getFlexibleEventRow(invitation.id);

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
