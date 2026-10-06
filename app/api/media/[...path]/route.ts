import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_BUCKET = "invitation-assets";
const SUPABASE_BASE =
  "https://tvjifuzhakaymzottdyf.supabase.co/storage/v1/object/public/invitation-assets";

function encodeObjectPath(parts: string[]) {
  return parts.map((part) => encodeURIComponent(part)).join("/");
}

function isSafePath(parts: string[]) {
  return (
    parts.length >= 2 &&
    parts[0] === ALLOWED_BUCKET &&
    parts.slice(1).every((part) => part && part !== "." && part !== ".." && !part.includes("\\"))
  );
}

async function fetchOrigin(url: string, range: string | null) {
  const headers = new Headers();
  if (range) headers.set("range", range);

  return fetch(url, {
    headers,
    redirect: "follow",
    // Immutable uploaded assets benefit from a long server-side fetch cache.
    // Range requests are left uncached because partial-response cache keys are
    // not consistently reusable across browsers/CDNs.
    ...(range
      ? { cache: "no-store" as const }
      : { next: { revalidate: 60 * 60 * 24 * 30 } }),
  });
}

async function serve(request: NextRequest, path: string[]) {
  if (!isSafePath(path)) {
    return NextResponse.json({ error: "Invalid media path" }, { status: 400 });
  }

  const objectPath = encodeObjectPath(path.slice(1));
  const range = request.headers.get("range");
  const cdnBase = process.env.MEDIA_CDN_BASE?.replace(/\/+$/, "") || null;

  let response: Response | null = null;
  let source = "supabase";

  if (cdnBase) {
    try {
      const cdnResponse = await fetchOrigin(`${cdnBase}/${objectPath}`, range);
      if (cdnResponse.ok || cdnResponse.status === 206) {
        response = cdnResponse;
        source = "cdn";
      }
    } catch {
      // A DNS/network/CDN failure must never make a published invitation lose
      // its photos. The Supabase origin below is the guaranteed fallback.
    }
  }

  if (!response) {
    try {
      response = await fetchOrigin(`${SUPABASE_BASE}/${objectPath}`, range);
      source = "supabase";
    } catch {
      return NextResponse.json({ error: "Media origin unavailable" }, { status: 502 });
    }
  }

  if (!response.ok && response.status !== 206) {
    return new NextResponse(null, {
      status: response.status,
      headers: {
        "cache-control": "public, max-age=60, s-maxage=60",
        "x-vistiq-media-source": source,
      },
    });
  }

  const headers = new Headers();
  const passthroughHeaders = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified",
  ];
  for (const name of passthroughHeaders) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }

  headers.set(
    "cache-control",
    range
      ? "public, max-age=3600, s-maxage=3600"
      : "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400, immutable"
  );
  headers.set("x-vistiq-media-source", source);
  headers.set("x-content-type-options", "nosniff");

  return new NextResponse(response.body, {
    status: response.status,
    headers,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return serve(request, path);
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const response = await serve(request, path);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}
