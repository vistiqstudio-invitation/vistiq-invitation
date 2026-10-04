import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { r2PublicUrl } from "@/lib/r2";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const fields = ["cover_image","music_url","gallery_1","gallery_2","gallery_3","gallery_4","groom_photo","bride_photo","cover_photo","gallery_photos","gallery1","gallery2","gallery3","gallery4","gallery5","gallery6","background_photo","story_1_photo","story_2_photo","story_3_photo","story_4_photo","story_5_photo"];
const BATCH_SIZE = 25;

function collect(v: unknown, out = new Set<string>()) {
  if (typeof v === "string" && v.includes(".supabase.co/storage/v1/object/public/")) out.add(v.split("#")[0].split("?")[0]);
  else if (Array.isArray(v)) v.forEach((x) => collect(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => collect(x, out));
  return out;
}
function keyFor(source: string) {
  const u = new URL(source), m = "/storage/v1/object/public/";
  return "legacy/" + decodeURIComponent(u.pathname.slice(u.pathname.indexOf(m) + m.length));
}
async function ownerClient() {
  const s = await createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return { s, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { data: p } = await s.from("profiles").select("role").eq("id", user.id).single();
  if (p?.role !== "owner") return { s, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { s, error: null };
}
async function sources(s: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await s.from("invitations").select(fields.join(",")).eq("is_active", true);
  if (error) throw new Error(error.message);
  return [...collect(data)].sort();
}

export async function POST(req: Request) {
  const { s, error } = await ownerClient();
  if (error) return error;
  try {
    const all = await sources(s);
    const body = await req.json().catch(() => ({}));
    const offset = Math.max(0, Number(body?.offset) || 0);
    const batch = all.slice(offset, offset + BATCH_SIZE);
    let verified = 0;
    const failed: { source: string; destination: string; status?: number; error?: string }[] = [];

    await Promise.all(batch.map(async (source) => {
      const destination = r2PublicUrl(keyFor(source));
      try {
        let response = await fetch(destination, { method: "HEAD", cache: "no-store" });
        if (response.ok) { verified++; return; }
        response = await fetch(destination, { method: "GET", headers: { Range: "bytes=0-0" }, cache: "no-store" });
        if (response.ok || response.status === 206) { verified++; return; }
        failed.push({ source, destination, status: response.status });
      } catch (e) {
        failed.push({ source, destination, error: e instanceof Error ? e.message : String(e) });
      }
    }));

    const nextOffset = offset + batch.length;
    return NextResponse.json({
      ok: failed.length === 0,
      total: all.length,
      processed: nextOffset,
      verified,
      failed,
      done: nextOffset >= all.length,
      nextOffset,
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
