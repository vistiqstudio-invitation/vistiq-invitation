import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SUPABASE_MEDIA_BASE =
  "https://tvjifuzhakaymzottdyf.supabase.co/storage/v1/object/public/invitation-assets/";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const cleanPath = path.map((part) => decodeURIComponent(part)).join("/");

  if (!cleanPath || cleanPath.includes("..")) {
    return new NextResponse("Invalid media path", { status: 400 });
  }

  const sourceUrl = SUPABASE_MEDIA_BASE + cleanPath;
  const headers = new Headers();
  const range = request.headers.get("range");
  if (range) headers.set("range", range);

  try {
    const upstream = await fetch(sourceUrl, {
      headers,
      cache: "force-cache",
      next: { revalidate: 31536000 },
    });

    if (!upstream.ok && upstream.status !== 206) {
      return new NextResponse("Media unavailable", { status: upstream.status });
    }

    const responseHeaders = new Headers();
    const contentType = upstream.headers.get("content-type");
    const contentLength = upstream.headers.get("content-length");
    const contentRange = upstream.headers.get("content-range");
    const acceptRanges = upstream.headers.get("accept-ranges");

    if (contentType) responseHeaders.set("content-type", contentType);
    if (contentLength) responseHeaders.set("content-length", contentLength);
    if (contentRange) responseHeaders.set("content-range", contentRange);
    if (acceptRanges) responseHeaders.set("accept-ranges", acceptRanges);

    responseHeaders.set(
      "cache-control",
      "public, max-age=31536000, s-maxage=31536000, immutable"
    );
    responseHeaders.set("cdn-cache-control", "public, max-age=31536000");
    responseHeaders.set("vary", "range");

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return new NextResponse("Media temporarily unavailable", { status: 503 });
  }
}
