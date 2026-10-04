import { NextRequest, NextResponse } from "next/server";
import { getStorefrontFallbackByKey } from "@/lib/storefrontFallback";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key") || "";
  const store = getStorefrontFallbackByKey(key);
  const brandName = store?.brand_name?.trim() || "Undangan Digital";
  const brandColor = store?.brand_color || "#17324d";

  return NextResponse.json(
    {
      name: brandName,
      short_name: brandName,
      description: `Katalog undangan digital premium dari ${brandName}.`,
      start_url: "/",
      display: "standalone",
      background_color: "#f6faff",
      theme_color: brandColor,
      ...(store?.logo_url
        ? {
            icons: [
              {
                src: store.logo_url,
                sizes: "any",
                type: store.logo_url.endsWith(".svg") ? "image/svg+xml" : "image/png",
                purpose: "any",
              },
            ],
          }
        : {}),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
        "Content-Type": "application/manifest+json",
      },
    }
  );
}
