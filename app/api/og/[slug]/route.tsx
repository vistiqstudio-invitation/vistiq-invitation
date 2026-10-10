import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function titleFromSlug(slug: string) {
  try {
    return decodeURIComponent(slug)
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" & ");
  } catch {
    return "Undangan Digital";
  }
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const displayName = titleFromSlug(slug) || "Undangan Digital";
  const fontSize = displayName.length > 45 ? 58 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f2e9 0%, #d8c7ae 100%)",
          color: "#40342b",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 27, fontWeight: 600, letterSpacing: 5, marginBottom: 55 }}>
          THE WEDDING INVITATION
        </div>
        <div style={{ display: "flex", fontSize, fontWeight: 700, textAlign: "center", padding: "0 70px" }}>
          {displayName}
        </div>
        <div style={{ display: "flex", width: 110, height: 3, background: "#8a725d", marginTop: 45, marginBottom: 38 }} />
        <div style={{ display: "flex", fontSize: 25, fontWeight: 500 }}>Vistiq Invitation</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
      },
    }
  );
}
