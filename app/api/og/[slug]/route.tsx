export const runtime = "edge";
export const dynamic = "force-dynamic";

const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  }[char] || char));
}

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
  const displayName = escapeXml(titleFromSlug(slug) || "Undangan Digital");
  const fontSize = displayName.length > 45 ? 58 : 76;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8f2e9"/>
      <stop offset="100%" stop-color="#d8c7ae"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="210" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="27" font-weight="600" letter-spacing="5" fill="#40342b">THE WEDDING INVITATION</text>
  <text x="600" y="330" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="700" fill="#40342b">${displayName}</text>
  <rect x="545" y="382" width="110" height="3" fill="#8a725d"/>
  <text x="600" y="450" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="25" font-weight="500" fill="#40342b">Vistiq Invitation</text>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
