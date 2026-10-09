import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const WIDTH = 1200;
const HEIGHT = 630;

function titleFromSlug(slug: string) {
  return decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" & ");
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const displayName = titleFromSlug(slug) || "Undangan Digital";

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: WIDTH,
          height: HEIGHT,
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#f8f2e9,#d8c7ae)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 1000,
            padding: 60,
            textAlign: "center",
            color: "#40342b",
          }}
        >
          <div style={{ display: "flex", fontSize: 27, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase", marginBottom: 28 }}>
            The Wedding Invitation
          </div>
          <div style={{ display: "flex", fontSize: displayName.length > 45 ? 58 : 76, fontWeight: 700, lineHeight: 1.08, justifyContent: "center", marginBottom: 30 }}>
            {displayName}
          </div>
          <div style={{ display: "flex", width: 110, height: 3, background: "#8a725d", marginBottom: 26 }} />
          <div style={{ display: "flex", fontSize: 25, fontWeight: 500 }}>Vistiq Invitation</div>
        </div>
      </div>,
      {
        width: WIDTH,
        height: HEIGHT,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
        },
      },
    );
  } catch {
    return new ImageResponse(
      <div style={{ display: "flex", width: WIDTH, height: HEIGHT, alignItems: "center", justifyContent: "center", background: "#f4ede3", color: "#40342b", fontSize: 64, fontWeight: 700 }}>
        Vistiq Invitation
      </div>,
      { width: WIDTH, height: HEIGHT },
    );
  }
}
