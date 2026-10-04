import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createR2PresignedPutUrl } from "@/lib/r2";

const ALLOWED_PREFIXES = new Set(["image/", "audio/"]);

function safeSegment(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (!profile || !["owner", "reseller", "client"].includes(profile.role)) {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
    }

    const body = await request.json();
    const contentType = String(body.contentType || "").toLowerCase();
    if (![...ALLOWED_PREFIXES].some((prefix) => contentType.startsWith(prefix))) {
      return NextResponse.json({ error: "Jenis file tidak didukung." }, { status: 400 });
    }

    const scope = safeSegment(String(body.scope || user.id)) || user.id;
    const folder = safeSegment(String(body.folder || "media")) || "media";
    const originalName = safeSegment(String(body.fileName || "file")) || "file";
    const ext = originalName.includes(".") ? originalName.split(".").pop() : (contentType.startsWith("audio/") ? "mp3" : "webp");
    const key = `invitations/${scope}/${folder}-${Date.now()}-${crypto.randomUUID()}.${ext}`;

    return NextResponse.json(createR2PresignedPutUrl(key, contentType));
  } catch (error) {
    console.error("r2-presign:", error);
    return NextResponse.json({ error: "Gagal menyiapkan upload media." }, { status: 500 });
  }
}
