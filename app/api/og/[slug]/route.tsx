import { ImageResponse } from "next/og";
import { getInvitationBySlug } from "@/lib/invitation";
import { parseSmartCoverValue } from "@/lib/smartCover";

const WIDTH = 800;
const HEIGHT = 420;

function getDisplayName(
  invitation: Awaited<ReturnType<typeof getInvitationBySlug>>
) {
  if (!invitation) return "";
  if (invitation.category === "aqiqah") return invitation.baby?.name ?? "";
  if (invitation.category === "khitan") return invitation.child?.name ?? "";
  if (invitation.category === "birthday") return invitation.child?.name ?? "";
  return `${invitation.groom?.name ?? ""} & ${invitation.bride?.name ?? ""}`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return new Response("Not found", { status: 404 });
  }

  const { source: coverImage, config } = parseSmartCoverValue(invitation.coverImage);

  if (!coverImage) {
    return new Response("No cover image", { status: 404 });
  }

  // The desktop/mobile focal points in `config` are tuned for the
  // invitation's own (usually portrait) cover section, not this
  // landscape crop - reusing them here cuts off faces on a typical
  // full-body standing photo. Keep the configured horizontal focal
  // point (there's rarely any horizontal slack to crop anyway, since
  // portrait sources are width-constrained) but bias vertically
  // toward the top third, where faces usually sit.
  const focalX = config.desktop.focalX;
  const focalY = 20;
  const displayName = getDisplayName(invitation);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          position: "relative",
          background: "#0f172a",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt=""
          width={WIDTH}
          height={HEIGHT}
          style={{
            position: "absolute",
            inset: 0,
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            objectFit: "cover",
            objectPosition: `${focalX}% ${focalY}%`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            padding: "32px",
            background:
              "linear-gradient(180deg, rgba(15,23,42,0) 55%, rgba(15,23,42,0.75) 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              color: "#ffffff",
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {displayName}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
