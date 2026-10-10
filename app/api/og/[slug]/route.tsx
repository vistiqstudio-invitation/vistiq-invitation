import { ImageResponse } from "next/og";
import { getInvitationBySlug } from "@/lib/invitation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIMARY_ORIGIN = "https://www.vistiqinvitation.com";

function absoluteMediaUrl(value?: string | null) {
  if (!value) return null;
  const clean = value.split("#")[0].trim();
  if (!clean) return null;
  if (/^https?:\/\//i.test(clean)) return clean;
  return `${PRIMARY_ORIGIN}${clean.startsWith("/") ? "" : "/"}${clean}`;
}

function fallbackTitle(slug: string) {
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
  const invitation = await getInvitationBySlug(slug);

  let displayName = fallbackTitle(slug) || "Undangan Digital";
  let label = "UNDANGAN DIGITAL";
  let brandName: string | null = null;
  let coverImage: string | null = null;

  if (invitation) {
    brandName = invitation.brand?.name ?? null;
    coverImage = absoluteMediaUrl(invitation.coverImage);

    if (invitation.category === "wedding") {
      displayName = `${invitation.groom.nickname || invitation.groom.name} & ${invitation.bride.nickname || invitation.bride.name}`;
      label = "THE WEDDING INVITATION";
    } else if (invitation.category === "aqiqah") {
      displayName = invitation.baby.name;
      label = "UNDANGAN AQIQAH";
    } else if (invitation.category === "khitan") {
      displayName = invitation.child.name;
      label = "UNDANGAN KHITAN";
    } else if (invitation.category === "birthday") {
      displayName = invitation.child.name;
      label = "UNDANGAN ULANG TAHUN";
    }
  }

  if (coverImage) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#171717" }}>
          <img
            src={coverImage}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "120px 70px 55px",
              color: "white",
              textAlign: "center",
              background: "linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,.72) 100%)",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <div style={{ display: "flex", fontSize: 22, fontWeight: 600, letterSpacing: 4, marginBottom: 16 }}>{label}</div>
            <div style={{ display: "flex", fontSize: displayName.length > 45 ? 50 : 64, fontWeight: 700 }}>{displayName}</div>
            {brandName ? <div style={{ display: "flex", fontSize: 20, marginTop: 18, opacity: .9 }}>{brandName}</div> : null}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: { "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300" },
      }
    );
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f8f2e9 0%, #d8c7ae 100%)", color: "#40342b", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", fontSize: 27, fontWeight: 600, letterSpacing: 5, marginBottom: 55 }}>{label}</div>
        <div style={{ display: "flex", fontSize: displayName.length > 45 ? 58 : 76, fontWeight: 700, textAlign: "center", padding: "0 70px" }}>{displayName}</div>
        {brandName ? <div style={{ display: "flex", fontSize: 25, fontWeight: 500, marginTop: 38 }}>{brandName}</div> : null}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300" },
    }
  );
}
