"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "./paymentNotifications.module.css";

type Job = { id: string; order_id: string; customer_name: string; amount: number; status: string; created_at: string; last_error: string | null };
type Settings = { enabled: boolean; credentialsReady: boolean; sender: string; recipient: string; template: string; jobs: Job[] };
const labels: Record<string, string> = { queued: "Menunggu dikirim", processing: "Sedang dikirim", accepted: "Diterima sistem WhatsApp", failed: "Gagal dikirim", unknown: "Perlu diperiksa" };
const phone = (number: string) => number.startsWith("62") ? `0${number.slice(2)}` : number;

export default function PaymentNotificationSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/payment-whatsapp", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pengaturan belum dapat dimuat.");
      setSettings(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Pengaturan belum dapat dimuat."); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function action(actionName: string, id?: string) {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/payment-whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: actionName, id }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Permintaan belum berhasil.");
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Permintaan belum berhasil."); }
    finally { setBusy(false); }
  }

  return <>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {!settings ? <p>{error ? "Silakan muat ulang halaman." : "Memuat pengaturan…"}</p> : <>
      <section className={styles.card}>
        <div className={styles.heading}><h2>Koneksi WhatsApp</h2><span className={settings.enabled ? styles.active : styles.inactive}>{settings.enabled ? "Diaktifkan" : "Belum aktif"}</span></div>
        <div className={styles.numbers}><div><span>Nomor pengirim</span><strong>{phone(settings.sender)}</strong></div><div><span>Nomor penerima</span><strong>{phone(settings.recipient)}</strong></div></div>
        {!settings.credentialsReady && <p className={styles.notice}>Nomor pengirim belum terhubung ke WhatsApp API. Selesaikan koneksi nomor dan persetujuan template pesan terlebih dahulu. WhatsApp Business yang sekarang memerlukan koneksi yang mendukung pemakaian aplikasi dan API bersamaan.</p>}
        <p>Setelah diaktifkan, pembayaran baru yang berhasil akan memicu notifikasi. Pembayaran lama tidak dikirim ulang.</p>
        <div className={styles.actions}>
          <button disabled={busy || (!settings.enabled && !settings.credentialsReady)} onClick={() => action(settings.enabled ? "disable" : "enable")}>{busy ? "Memproses…" : settings.enabled ? "Nonaktifkan notifikasi" : "Periksa koneksi & aktifkan"}</button>
          <button className={styles.secondary} disabled={busy} onClick={() => { setError(""); void load(); }}>Perbarui status</button>
        </div>
      </section>
      <section className={styles.card}><h2>Isi pesan</h2><pre className={styles.preview}>{settings.template.replace("{{1}}", "Nama pelanggan").replace("{{2}}", "Rp 100.000").replace("{{3}}", "Nomor pesanan").replace("{{4}}", "Metode pembayaran")}</pre></section>
      <section className={styles.card}>
        <div className={styles.heading}><h2>Riwayat notifikasi</h2><button className={styles.secondary} disabled={busy || !settings.enabled} onClick={() => action("process")}>Proses antrean</button></div>
        <p>“Diterima sistem WhatsApp” berarti permintaan pengiriman sudah diterima, belum merupakan konfirmasi pesan sampai di HP. Pesan berstatus “Perlu diperiksa” tidak dikirim ulang otomatis agar tidak berulang.</p>
        {settings.jobs.length === 0 ? <p>Belum ada notifikasi pembayaran.</p> : <ul className={styles.history}>{settings.jobs.map(job => <li key={job.id}>
          <div><strong>{job.customer_name} · Rp {Number(job.amount).toLocaleString("id-ID")}</strong><p>{job.order_id}</p><small>{new Date(job.created_at).toLocaleString("id-ID")}</small></div>
          <div><span>{labels[job.status] || job.status}</span>{job.status === "failed" && <button disabled={busy || !settings.enabled} onClick={() => action("retry", job.id)}>Coba kirim lagi</button>}</div>
        </li>)}</ul>}
      </section>
    </>}
  </>;
}
