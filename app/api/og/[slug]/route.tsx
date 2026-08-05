import { ImageResponse } from "next/og";
import { imageSize } from "image-size";
import { getInvitationBySlug } from "@/lib/invitation";
import { parseSmartCoverValue } from "@/lib/smartCover";

const WIDTH = 800;
const HEIGHT = 420;

// Frame the photo itself instead of a fixed landscape box - a portrait
// cover photo forced into an 800x420 frame either gets cropped (cover) or
// leaves empty bars on the sides (contain). Sizing the frame to the
// photo's own aspect ratio shows the whole photo with neither.
// Target pixel count is tuned lower than WIDTH*HEIGHT because, unlike the
// old letterboxed version, every pixel here is photo detail (no cheap-to-
// compress solid background), so the same pixel budget would encode larger.
const TARGET_PIXELS = 100_000;
const MIN_DIMENSION = 250;
const MAX_DIMENSION = 1000;

async function photoFrameSize(coverImage: string): Promise<{ width: number; height: number }> {
  try {
    const bytes = await fetch(coverImage).then((res) => res.arrayBuffer());
    const { width: naturalWidth, height: naturalHeight } = imageSize(new Uint8Array(bytes));
    if (!naturalWidth || !naturalHeight) return { width: WIDTH, height: HEIGHT };

    const aspectRatio = naturalWidth / naturalHeight;
    let width = Math.round(Math.sqrt(TARGET_PIXELS * aspectRatio));
    let height = Math.round(Math.sqrt(TARGET_PIXELS / aspectRatio));

    const longSide = Math.max(width, height);
    const shortSide = Math.min(width, height);
    if (longSide > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / longSide;
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    } else if (shortSide < MIN_DIMENSION) {
      const scale = MIN_DIMENSION / shortSide;
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    return { width, height };
  } catch {
    return { width: WIDTH, height: HEIGHT };
  }
}

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

  const { source: coverImage } = parseSmartCoverValue(invitation.coverImage);
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

  // Frame sized to the photo's own aspect ratio so the whole photo fills it
  // edge to edge - no crop (like a fixed landscape frame would force) and
  // no empty side bars (like letterboxing a mismatched frame would leave).
  const frame = await photoFrameSize(coverImage);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: `${frame.width}px`,
          height: `${frame.height}px`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt=""
          width={frame.width}
          height={frame.height}
          style={{
            width: `${frame.width}px`,
            height: `${frame.height}px`,
            objectFit: "cover",
          }}
        />
      </div>
    ),
    { width: frame.width, height: frame.height, headers: cacheHeaders }
  );
}
