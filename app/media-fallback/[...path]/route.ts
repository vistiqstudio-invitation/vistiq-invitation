import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_MEDIA_BASE =
  "https://tvjifuzhakaymzottdyf.supabase.co/storage/v1/object/public/invitation-assets/";
const R2_LEGACY_PREFIX = "legacy/invitation-assets";

function encodePath(parts: string[]) {
  return parts.map((part) => encodeURIComponent(part)).join("/");
}

function safeParts(parts: string[]) {
  return parts.length > 0 && parts.every((part) => {
    const decoded = decodeURIComponent(part);
    return decoded.length > 0 && decoded !== "." && decoded !== ".." && !decoded.includes("\\");
  });
}

async function fetchOrigin(url: string, range: string | null, timeoutMs?: number) {
  const headers = new Headers();
  if (range) headers.set("range", range);

  return fetch(url, {
    headers,
    redirect: "follow",
    signal: timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined,
    ...(range
      ? { cache: "no-store" as const }
      : { next: { revalidate: 60 * 60 * 24 * 30 } }),
  });
}

async function serve(request: NextRequest, parts: string[]) {
  if (!safeParts(parts)) {
    return new NextResponse("Invalid media path", { status: 400 });
  }

  const encodedPath = encodePath(parts.map((part) => decodeURIComponent(part)));
  const range = request.headers.get("range");
  const r2Base = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "") || null;

  let upstream: Response | null = null;
  let source = "supabase";

  // Old migration copies invitation assets to:
  // legacy/invitation-assets/<original Supabase object path>.
  // Prefer R2 when healthy, but fail over quickly if its public domain/DNS
  // is unavailable. The canonical database URL remains Supabase, so no client
  // row needs to be rewritten during CDN incidents or future migrations.
  if (r2Base) {
    try {
      const r2 = await fetchOrigin(
        `${r2Base}/${R2_LEGACY_PREFIX}/${encodedPath}`,
        range,
        1800
      );
      if (r2.ok || r2.status === 206) {
        upstream = r2;
        source = "r2";
      }
    } catch {
      // Guaranteed Supabase fallback below.
    }
  }

  if (!upstream) {
    try {
      upstream = await fetchOrigin(`${SUPABASE_MEDIA_BASE}${encodedPath}`, range);
      source = "supabase";
    } catch {
      return new NextResponse("Media temporarily unavailable", { status: 503 });
    }
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new NextResponse("Media unavailable", {
      status: upstream.status,
      headers: {
        "cache-control": "public, max-age=60, s-maxage=60",
        "x-vistiq-media-source": source,
      },
    });
  }

  const responseHeaders = new Headers();
  for (const name of [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified",
  ]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  responseHeaders.set(
    "cache-control",
    range
      ? "public, max-age=3600, s-maxage=3600"
      : "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400, immutable"
  );
  responseHeaders.set("cdn-cache-control", "public, max-age=2592000");
  responseHeaders.set("vary", "range");
  responseHeaders.set("x-vistiq-media-source", source);
  responseHeaders.set("x-content-type-options", "nosniff");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
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
