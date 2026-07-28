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

const CATEGORY_LABEL: Record<string, string> = {
  aqiqah: "Undangan Aqiqah",
  khitan: "Undangan Khitan",
  birthday: "Undangan Ulang Tahun",
  wedding: "Undangan Pernikahan",
};

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
  const cacheHeaders = {
    "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  };

  // No cover photo uploaded yet - fall back to a branded text card so
  // the share link always has some preview image instead of none at all.
  if (!coverImage) {
    const displayName = getDisplayName(invitation);
    const categoryLabel = CATEGORY_LABEL[invitation.category] ?? CATEGORY_LABEL.wedding;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            background: "linear-gradient(135deg, #0a1230 0%, #1167b2 100%)",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: 4,
              color: "#a8c8e8",
            }}
          >
            {categoryLabel.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              padding: "0 60px",
              fontSize: 42,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 3,
              color: "#a8c8e8",
            }}
          >
            VISTIQ INVITATION
          </div>
        </div>
      ),
      { width: WIDTH, height: HEIGHT, headers: cacheHeaders }
    );
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
            top: 0,
            left: 0,
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            objectFit: "cover",
            objectPosition: `${focalX}% ${focalY}%`,
          }}
        />
      </div>
    ),
    { width: WIDTH, height: HEIGHT, headers: cacheHeaders }
  );
}
