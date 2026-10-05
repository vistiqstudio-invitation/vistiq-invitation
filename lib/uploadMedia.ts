"use client";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_AUDIO_BYTES = 15 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1920;
const WEBP_QUALITY = 0.82;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Gambar tidak dapat dibaca.")); };
    img.src = url;
  });
}

async function optimizeImage(file: File) {
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
  if (!blob || blob.size >= file.size) return file;
  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${base}.webp`, { type: "image/webp", lastModified: Date.now() });
}

async function serverFallback(uploadFile: File, folder: string, scope: string) {
  const form = new FormData();
  form.append("file", uploadFile);
  form.append("folder", folder);
  form.append("scope", scope);
  const response = await fetch("/api/media/presign", { method: "PUT", body: form });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Upload media gagal.");
  return String(payload.publicUrl);
}

export async function uploadMediaToR2(file: File, folder: string, scope: string) {
  const isImage = file.type.startsWith("image/");
  const isAudio = file.type.startsWith("audio/");
  if (!isImage && !isAudio) throw new Error("Jenis file tidak didukung.");
  if (isImage && file.size > MAX_IMAGE_BYTES) throw new Error("Ukuran gambar maksimal 8 MB.");
  if (isAudio && file.size > MAX_AUDIO_BYTES) throw new Error("Ukuran audio maksimal 15 MB.");

  const uploadFile = isImage ? await optimizeImage(file) : file;

  // Logos are small and critical to reseller onboarding. Upload them through
  // our authenticated same-origin endpoint so R2 bucket CORS can never block them.
  if (folder === "logo") return serverFallback(uploadFile, folder, scope);

  const response = await fetch("/api/media/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: uploadFile.name,
      contentType: uploadFile.type || "application/octet-stream",
      fileSize: uploadFile.size,
      folder,
      scope,
    }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Gagal menyiapkan upload.");

  try {
    const upload = await fetch(payload.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": uploadFile.type || "application/octet-stream" },
      body: uploadFile,
    });
    if (upload.ok) return String(payload.publicUrl);
  } catch {
    // Browser-to-R2 can be blocked by bucket CORS. Fall back to authenticated server upload.
  }

  return serverFallback(uploadFile, folder, scope);
}
