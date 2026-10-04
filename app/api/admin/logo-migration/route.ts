import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { putR2Object, r2PublicUrl } from "@/lib/r2";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function normalize(source: string) { return source.split("#")[0].split("?")[0]; }
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

export async function POST() {
  const { s, error } = await ownerClient();
  if (error) return error;
  try {
    const { data, error: dbError } = await s.from("resellers").select("id,logo_url").not("logo_url","is",null);
    if (dbError) throw new Error(dbError.message);
    const rows = (data || []).filter((x: any) => typeof x.logo_url === "string" && x.logo_url.includes(".supabase.co/storage/v1/object/public/"));
    let copied = 0, existing = 0, updated = 0;
    const failed: any[] = [];
    for (const row of rows) {
      try {
        const source = normalize(row.logo_url);
        const key = keyFor(source);
        const dest = r2PublicUrl(key);
        let check = await fetch(dest, { method: "HEAD", cache: "no-store" });
        if (check.ok) existing++;
        else {
          const src = await fetch(source, { cache: "no-store" });
          if (!src.ok) throw new Error("source HTTP " + src.status);
          await putR2Object(key, Buffer.from(await src.arrayBuffer()), src.headers.get("content-type") || "application/octet-stream");
          check = await fetch(dest, { method: "HEAD", cache: "no-store" });
          if (!check.ok) throw new Error("R2 verify HTTP " + check.status);
          copied++;
        }
        const suffix = row.logo_url.slice(source.length);
        const { error: updateError } = await s.from("resellers").update({ logo_url: dest + suffix }).eq("id", row.id);
        if (updateError) throw new Error(updateError.message);
        updated++;
      } catch (e) {
        failed.push({ id: row.id, error: e instanceof Error ? e.message : String(e) });
      }
    }
    return NextResponse.json({ ok: failed.length === 0, total: rows.length, copied, existing, updated, failed });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
