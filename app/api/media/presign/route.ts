import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createR2PresignedPutUrl, putR2Object } from "@/lib/r2";

const ALLOWED_PREFIXES = new Set(["image/", "audio/"]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_AUDIO_BYTES = 15 * 1024 * 1024;

function safeSegment(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

async function authorizedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || !["owner", "reseller", "client"].includes(profile.role)) return null;
  return user;
}

function validateMedia(contentType: string, fileSize: number) {
  if (![...ALLOWED_PREFIXES].some((prefix) => contentType.startsWith(prefix))) return "Jenis file tidak didukung.";
  if (!Number.isFinite(fileSize) || fileSize <= 0) return "Ukuran file tidak valid.";
  const maxBytes = contentType.startsWith("image/") ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
  if (fileSize > maxBytes) return contentType.startsWith("image/") ? "Ukuran gambar maksimal 8 MB." : "Ukuran audio maksimal 15 MB.";
  return null;
}

function mediaKey(userId: string, scopeValue: string, folderValue: string, fileName: string, contentType: string) {
  const scope = safeSegment(scopeValue || userId) || userId;
  const folder = safeSegment(folderValue || "media") || "media";
  const originalName = safeSegment(fileName || "file") || "file";
  const ext = originalName.includes(".") ? originalName.split(".").pop() : (contentType.startsWith("audio/") ? "mp3" : "webp");
  return `invitations/${scope}/${folder}-${Date.now()}-${crypto.randomUUID()}.${ext}`;
}

export async function POST(request: Request) {
  try {
    const user = await authorizedUser();
    if (!user) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

    const body = await request.json();
    const contentType = String(body.contentType || "").toLowerCase();
    const fileSize = Number(body.fileSize || 0);
    const error = validateMedia(contentType, fileSize);
    if (error) return NextResponse.json({ error }, { status: fileSize > MAX_IMAGE_BYTES && contentType.startsWith("image/") || fileSize > MAX_AUDIO_BYTES && contentType.startsWith("audio/") ? 413 : 400 });

    const key = mediaKey(user.id, String(body.scope || ""), String(body.folder || ""), String(body.fileName || ""), contentType);
    return NextResponse.json(createR2PresignedPutUrl(key, contentType));
  } catch (error) {
    console.error("r2-presign:", error);
    return NextResponse.json({ error: "Gagal menyiapkan upload media." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await authorizedUser();
    if (!user) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    const contentType = String(file.type || "").toLowerCase();
    const error = validateMedia(contentType, file.size);
    if (error) return NextResponse.json({ error }, { status: file.size > (contentType.startsWith("image/") ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES) ? 413 : 400 });

    const key = mediaKey(user.id, String(form.get("scope") || ""), String(form.get("folder") || ""), file.name, contentType);
    const publicUrl = await putR2Object(key, Buffer.from(await file.arrayBuffer()), contentType);
    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error("r2-upload-fallback:", error);
    return NextResponse.json({ error: "Upload media gagal." }, { status: 500 });
  }
}
