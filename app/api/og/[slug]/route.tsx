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

  const { source: coverImage } = parseSmartCoverValue(invitation.coverImage);
  const cacheHeaders = {
    "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
  };

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
          <div style={{ display: "flex", fontSize: 16, fontWeight: 600, letterSpacing: 4, color: "#a8c8e8" }}>
            {categoryLabel.toUpperCase()}
          </div>
          <div style={{ display: "flex", marginTop: 20, padding: "0 60px", fontSize: 42, fontWeight: 700, textAlign: "center" }}>
            {displayName}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 14, fontWeight: 600, letterSpacing: 3, color: "#a8c8e8" }}>
            VISTIQ INVITATION
          </div>
        </div>
      ),
      { width: WIDTH, height: HEIGHT, headers: cacheHeaders }
    );
  }

  // Keep the same 800x420 share-card appearance, but let the OG renderer
  // fetch the R2 image directly. Avoiding a separate server-side download
  // just to inspect its dimensions removes one network transfer and image
  // parsing step from every cache miss.
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: `${WIDTH}px`, height: `${HEIGHT}px`, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt=""
          width={WIDTH}
          height={HEIGHT}
          style={{ width: `${WIDTH}px`, height: `${HEIGHT}px`, objectFit: "cover" }}
        />
      </div>
    ),
    { width: WIDTH, height: HEIGHT, headers: cacheHeaders }
  );
}
