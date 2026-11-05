"use client";

import { useState } from "react";
import styles from "@/styles/dashboard.module.css";

type BatchResult = {
  error?: string;
  eligible: number;
  bytes: number;
  removed: number;
  alreadyRemoved: number;
  blocked: { name: string; reason: string }[];
  nextOffset: number;
  total: number;
  done: boolean;
};

async function runBatches(action: "check" | "delete", report: (message: string) => void) {
  let offset = 0;
  let eligible = 0;
  let bytes = 0;
  let removed = 0;
  let blocked = 0;
  while (true) {
    const response = await fetch("/api/admin/storage-cleanup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, offset, confirmation: action === "delete" ? "DELETE_VERIFIED_SUPABASE_COPIES" : undefined }),
    });
    const result: BatchResult = await response.json();
    if (!response.ok) throw new Error(result.error || "Pemeriksaan gagal.");
    eligible += result.eligible;
    bytes += result.bytes;
    removed += result.removed;
    blocked += result.blocked.length;
    report(`Diperiksa ${result.nextOffset}/${result.total}. Memenuhi syarat ${eligible}, dihapus ${removed}, ditunda ${blocked}.`);
    if (result.done) return { eligible, bytes, removed, blocked };
    if (result.nextOffset <= offset) throw new Error("Proses terhenti. Jalankan ulang pemeriksaan.");
    offset = result.nextOffset;
  }
}

export default function StorageCleanup({ disabled = false }: { disabled?: boolean }) {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<{ eligible: number; size: string } | null>(null);

  async function clean() {
    if (running) return;
    setRunning(true);
    setPending(null);
    setMessage("Memeriksa referensi database dan ukuran salinan R2...");
    try {
      const checked = await runBatches("check", setMessage);
      if (!checked.eligible) {
        setMessage(`Pemeriksaan selesai. Tidak ada file yang memenuhi syarat. Ditunda ${checked.blocked}.`);
        return;
      }
      const size = (checked.bytes / 1024 / 1024).toFixed(1);
      setPending({ eligible: checked.eligible, size });
      setMessage(`Siap dibersihkan ${checked.eligible} file (${size} MiB). Silakan konfirmasi di bawah.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pembersihan terhenti. Proses bisa dijalankan ulang.");
    } finally {
      setRunning(false);
    }
  }

  async function confirmCleanup() {
    if (running || disabled || !pending) return;
    setRunning(true);
    setPending(null);
    setMessage("Memeriksa ulang salinan R2 dan membersihkan sumber Supabase...");
    try {
      const result = await runBatches("delete", setMessage);
      setMessage(`Pembersihan selesai. Dihapus ${result.removed} file, ditunda ${result.blocked}. Periksa Usage Supabase setelah angkanya diperbarui.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pembersihan terhenti. Proses bisa dijalankan ulang.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className={styles.generatorWrap}>
      <button type="button" className={styles.button} disabled={disabled || running} onClick={clean}>
        {running ? "Memeriksa penyimpanan..." : "Periksa dan bersihkan salinan Supabase"}
      </button>
      {pending && (
        <div className={styles.linkBox} role="group" aria-label="Konfirmasi pembersihan Supabase">
          <p>
            Hapus permanen {pending.eligible} salinan sumber Supabase ({pending.size} MiB)?
            Salinan R2 telah diperiksa dan referensi database telah dipindahkan.
            Penghapusan sumber ini tidak dapat dibatalkan melalui Supabase Storage.
          </p>
          <button type="button" className={styles.button} disabled={disabled || running} onClick={confirmCleanup}>
            Ya, hapus {pending.eligible} salinan Supabase
          </button>
          <button type="button" disabled={running} onClick={() => {
            setPending(null);
            setMessage("Pembersihan dibatalkan. Tidak ada file yang dihapus.");
          }}>
            Batal
          </button>
        </div>
      )}
      {message && <div className={styles.linkBox} role="status">{message}</div>}
    </div>
  );
}
