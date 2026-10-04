import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { putR2Object, r2PublicUrl } from "@/lib/r2";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
const fields=["cover_image","music_url","gallery_1","gallery_2","gallery_3","gallery_4","groom_photo","bride_photo","cover_photo","gallery_photos","gallery1","gallery2","gallery3","gallery4","gallery5","gallery6","background_photo","story_1_photo","story_2_photo","story_3_photo","story_4_photo","story_5_photo"];
function collect(v:unknown,out=new Set<string>()){if(typeof v==="string"&&v.includes(".supabase.co/storage/v1/object/public/"))out.add(v.split("#")[0].split("?")[0]);else if(Array.isArray(v))v.forEach(x=>collect(x,out));else if(v&&typeof v==="object")Object.values(v).forEach(x=>collect(x,out));return out;}
function keyFor(source:string){const u=new URL(source),m="/storage/v1/object/public/";return "legacy/"+decodeURIComponent(u.pathname.slice(u.pathname.indexOf(m)+m.length));}
export async function GET(){const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});const {data:p}=await s.from("profiles").select("role").eq("id",user.id).single();if(p?.role!=="owner")return NextResponse.json({error:"Forbidden"},{status:403});return NextResponse.json({ok:true,message:"Media migration control is ready."});}
export async function POST(req:Request){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const {data:p}=await s.from("profiles").select("role").eq("id",user.id).single();if(p?.role!=="owner")return NextResponse.json({error:"Forbidden"},{status:403});
 const token=req.headers.get("x-migration-token");if(!token||token!==process.env.MEDIA_MIGRATION_TOKEN)return NextResponse.json({error:"Invalid migration token"},{status:403});
 const {data,error}=await s.from("invitations").select(fields.join(",")).eq("is_active",true);if(error)return NextResponse.json({error:error.message},{status:500});
 const all=[...collect(data)];let copied=0,existing=0;const failed:{source:string,error:string}[]=[];
 for(const source of all){try{const key=keyFor(source),dest=r2PublicUrl(key);const h=await fetch(dest,{method:"HEAD",cache:"no-store"});if(h.ok){existing++;continue;}const src=await fetch(source,{cache:"no-store"});if(!src.ok)throw new Error("source HTTP "+src.status);await putR2Object(key,Buffer.from(await src.arrayBuffer()),src.headers.get("content-type")||"application/octet-stream");const check=await fetch(dest,{method:"HEAD",cache:"no-store"});if(!check.ok)throw new Error("R2 verify HTTP "+check.status);copied++;}catch(e){failed.push({source,error:e instanceof Error?e.message:String(e)});}}
 return NextResponse.json({ok:failed.length===0,total:all.length,copied,existing,failed});
}