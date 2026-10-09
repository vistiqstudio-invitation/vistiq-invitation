import { ImageResponse } from "next/og";
import { getInvitationBySlug } from "@/lib/invitation";
import { parseSmartCoverValue } from "@/lib/smartCover";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WIDTH = 1200;
const HEIGHT = 630;

function getDisplayName(invitation: Awaited<ReturnType<typeof getInvitationBySlug>>) {
  if (!invitation) return "Undangan Digital";
  if (invitation.category === "aqiqah") return invitation.baby?.name || "Undangan Aqiqah";
  if (invitation.category === "khitan") return invitation.child?.name || "Undangan Khitan";
  if (invitation.category === "birthday") return invitation.child?.name || "Undangan Ulang Tahun";
  const groom = invitation.groom?.nickname || invitation.groom?.name || "";
  const bride = invitation.bride?.nickname || invitation.bride?.name || "";
  return [groom, bride].filter(Boolean).join(" & ") || "Undangan Pernikahan";
}

const CATEGORY_LABEL: Record<string, string> = {
  aqiqah: "Undangan Aqiqah",
  khitan: "Undangan Khitan",
  birthday: "Undangan Ulang Tahun",
  wedding: "The Wedding Invitation",
};

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const invitation = await getInvitationBySlug(slug);
  if (!invitation) return new Response("Not found", { status: 404 });

  const parsed = parseSmartCoverValue(invitation.coverImage);
  const coverImage = parsed.source?.split("#")[0] || null;
  const displayName = getDisplayName(invitation);
  const categoryLabel = CATEGORY_LABEL[invitation.category] || "Undangan Digital";
  const brandName = invitation.brand?.name || "Vistiq Invitation";

  return new ImageResponse(
    <div style={{display:"flex",position:"relative",alignItems:"center",justifyContent:"center",width:WIDTH,height:HEIGHT,overflow:"hidden",background:"linear-gradient(135deg,#f5efe5,#d9c9b3)",fontFamily:"Arial, sans-serif"}}>
      {coverImage ? <img src={coverImage} alt="" width={WIDTH} height={HEIGHT} style={{position:"absolute",left:0,top:0,width:WIDTH,height:HEIGHT,objectFit:"cover"}} /> : null}
      <div style={{display:"flex",position:"absolute",left:0,top:0,width:WIDTH,height:HEIGHT,background:coverImage?"rgba(0,0,0,.48)":"rgba(255,255,255,.10)"}} />
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:1000,padding:55,textAlign:"center",color:coverImage?"#fff":"#3f332a"}}>
        <div style={{display:"flex",fontSize:26,fontWeight:600,letterSpacing:5,textTransform:"uppercase",marginBottom:25}}>{categoryLabel}</div>
        <div style={{display:"flex",fontSize:displayName.length>45?58:76,fontWeight:700,lineHeight:1.08,justifyContent:"center",marginBottom:28}}>{displayName}</div>
        <div style={{display:"flex",width:100,height:3,background:coverImage?"#fff":"#8a725d",marginBottom:25}} />
        <div style={{display:"flex",fontSize:24,fontWeight:500}}>{brandName}</div>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
    }
  );
}
