import { NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/requestOrigin";
import { createClient } from "@/lib/supabase/server";
import { r2PublicUrl } from "@/lib/r2";
import { VERIFIED_LEGACY_MEDIA } from "@/lib/verifiedLegacyMedia";

export const dynamic = "force-dynamic";
const BUCKET = "invitation-assets";
const BATCH_SIZE = 5;
const SOURCE_ROOT = "https://tvjifuzhakaymzottdyf.supabase.co/storage/v1/object/public/invitation-assets/";

export async function POST(request: Request) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Origin tidak diizinkan." }, { status: 403 });
    }
    const db = await createClient();
    const { data: { user } } = await db.auth.getUser();
    if (!user) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    const { data: profile } = await db.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "owner") return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

    const body = await request.json();
    const offset = Number(body.offset ?? 0);
    const remove = body.action === "delete";
    if (!["check", "delete"].includes(body.action) || !Number.isSafeInteger(offset) || offset < 0 || offset > VERIFIED_LEGACY_MEDIA.length) {
      return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
    }
    if (remove && body.confirmation !== "DELETE_VERIFIED_SUPABASE_COPIES") {
      return NextResponse.json({ error: "Konfirmasi pembersihan diperlukan." }, { status: 400 });
    }

    const { data: references, error: referenceError } = await db.rpc("get_verified_media_cleanup_status");
    if (referenceError || !Array.isArray(references)) throw new Error("Pemeriksaan referensi database gagal.");
    const referenceMap = new Map<string, { referenced: boolean; bytes: number; source_exists: boolean }>(
      references.map((row: { name: string; referenced: boolean; bytes: number; source_exists: boolean }) => [row.name, row]),
    );
    const batch = VERIFIED_LEGACY_MEDIA.slice(offset, offset + BATCH_SIZE);
    const eligible: string[] = [];
    const blocked: { name: string; reason: string }[] = [];
    let bytes = 0;
    let alreadyRemoved = 0;
    for (const file of batch) {
      const source = SOURCE_ROOT + file.name;
      const reference = referenceMap.get(file.name);
      if (!reference || Number(reference.bytes) !== file.bytes || reference.referenced) {
        blocked.push({ name: file.name, reason: "File masih dirujuk database." });
        continue;
      }
      if (reference.source_exists === false) {
        alreadyRemoved += 1;
        continue;
      }
      const destination = r2PublicUrl(`legacy/${BUCKET}/${file.name}`);
      const copy = await fetch(destination, { method: "HEAD", cache: "no-store" });
      if (!copy.ok || Number(copy.headers.get("content-length")) !== file.bytes) {
        blocked.push({ name: file.name, reason: "Ukuran salinan R2 belum terverifikasi." });
        continue;
      }
      const original = await fetch(source, { method: "HEAD", cache: "no-store" });
      if (original.status === 404) {
        alreadyRemoved += 1;
        continue;
      }
      if (!original.ok || Number(original.headers.get("content-length")) !== file.bytes) {
        blocked.push({ name: file.name, reason: "File sumber berubah atau tidak dapat diperiksa." });
        continue;
      }
      eligible.push(file.name);
      bytes += file.bytes;
    }
    let removed = 0;
    if (remove && eligible.length) {
      const { data, error } = await db.storage.from(BUCKET).remove(eligible);
      if (error) throw new Error(`Pembersihan gagal: ${error.message}`);
      removed = data?.length || 0;
      if (removed !== eligible.length) throw new Error("Sebagian file belum terhapus. Periksa kebijakan Storage lalu jalankan ulang.");
    }
    const nextOffset = offset + batch.length;
    return NextResponse.json({
      total: VERIFIED_LEGACY_MEDIA.length, eligible: eligible.length, bytes, removed,
      alreadyRemoved, blocked, nextOffset, done: nextOffset >= VERIFIED_LEGACY_MEDIA.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Pembersihan gagal." }, { status: 500 });
  }
}
