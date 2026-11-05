"use client";

import { useState } from "react";
import styles from "@/styles/dashboard.module.css";

type Status = {
  payment: { ready: boolean; missing: string[]; mode: string };
  adminServer: { configured: boolean };
  media: { configured: boolean; missing: string[] };
};

export default function SystemStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function check() {
    setLoading(true);
    setError("");
    setStatus(null);
    try {
      const response = await fetch("/api/admin/system-status", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Status belum dapat diperiksa.");
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status belum dapat diperiksa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.generatorCard}>
      <h2 className={styles.sectionTitle}>Status Konfigurasi Sistem</h2>
      <p>Periksa konfigurasi setelah perpindahan hosting. Hasil ini belum menggantikan pengujian transaksi dan unggahan.</p>
      <button type="button" className={styles.button} disabled={loading} onClick={check}>
        {loading ? "Memeriksa konfigurasi..." : "Periksa konfigurasi sistem"}
      </button>
      <div role="status" aria-live="polite">
        {error && <p>{error}</p>}
        {status && (
          <>
            <p>Pembayaran: {status.payment.ready ? `konfigurasi tersedia (${status.payment.mode}); perlu uji pembayaran` : `belum lengkap. Isi di Runtime variables Cloudflare: ${status.payment.missing.join(", ")}.`}</p>
            <p>Fungsi admin server: {status.adminServer.configured ? "kunci tersedia; perlu uji fungsi" : "SUPABASE_SERVICE_ROLE_KEY belum tersedia."}</p>
            <p>Media R2: {status.media.configured ? "konfigurasi tersedia; perlu uji unggahan" : `belum lengkap: ${status.media.missing.join(", ")}.`}</p>
            <p>Masukkan kunci rahasia langsung di Cloudflare sebagai Secret. Jangan kirim nilainya melalui chat.</p>
          </>
        )}
      </div>
    </section>
  );
}
