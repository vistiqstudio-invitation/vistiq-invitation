"use client";

export async function uploadMediaToR2(file: File, folder: string, scope: string) {
  const response = await fetch("/api/media/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      folder,
      scope,
    }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Gagal menyiapkan upload.");

  const upload = await fetch(payload.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body: file,
  });

  if (!upload.ok) throw new Error(`Upload R2 gagal (${upload.status}).`);
  return String(payload.publicUrl);
}
