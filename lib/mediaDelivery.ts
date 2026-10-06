const SUPABASE_INVITATION_ASSETS_BASE =
  "https://tvjifuzhakaymzottdyf.supabase.co/storage/v1/object/public/invitation-assets/";
const LEGACY_MEDIA_BASE =
  "https://media.vistiqinvitation.com/legacy/invitation-assets/";

function splitFragment(value: string) {
  const hashIndex = value.indexOf("#");
  if (hashIndex < 0) return { url: value, fragment: "" };
  return {
    url: value.slice(0, hashIndex),
    fragment: value.slice(hashIndex),
  };
}

function encodeObjectPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join("/");
}

/**
 * Convert invitation asset URLs to the stable first-party media endpoint.
 *
 * The database remains the source of truth and keeps the original Supabase
 * object URL. The delivery endpoint can prefer a CDN/R2 origin at runtime and
 * automatically fall back to Supabase without rewriting client rows again.
 */
export function toMediaDeliveryUrl(value: string): string {
  const { url, fragment } = splitFragment(value);

  let objectPath: string | null = null;
  if (url.startsWith(SUPABASE_INVITATION_ASSETS_BASE)) {
    objectPath = url.slice(SUPABASE_INVITATION_ASSETS_BASE.length);
  } else if (url.startsWith(LEGACY_MEDIA_BASE)) {
    // Backward-compatible safety for any old row or fallback snapshot that
    // still contains the previous media domain.
    objectPath = url.slice(LEGACY_MEDIA_BASE.length);
  }

  if (!objectPath) return value;

  return `/api/media/invitation-assets/${encodeObjectPath(objectPath)}${fragment}`;
}

export function withMediaDelivery<T>(value: T): T {
  if (typeof value === "string") {
    return toMediaDeliveryUrl(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => withMediaDelivery(item)) as T;
  }

  if (value && typeof value === "object") {
    const transformed = Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        withMediaDelivery(item),
      ])
    );
    return transformed as T;
  }

  return value;
}
