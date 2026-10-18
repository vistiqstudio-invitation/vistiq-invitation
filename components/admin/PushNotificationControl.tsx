"use client";

import { useEffect, useState } from "react";

function keyBytes(key: string): Uint8Array<ArrayBuffer> {
  const raw = atob(key.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - key.length % 4) % 4));
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

async function pushRequest(method: string, body?: unknown) {
  const response = await fetch("/api/push", { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, cache: "no-store", signal: AbortSignal.timeout(15_000) });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error || "Gagal menghubungi server notifikasi.");
  return result;
}

export default function PushNotificationControl() {
  const [ready, setReady] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setMessage("Notifikasi HP belum didukung browser ini. Pada iPhone, pasang Vistiq ke layar utama lalu buka dari ikon aplikasi.");
        return;
      }
      try {
        const config = await pushRequest("GET");
        const registration = await navigator.serviceWorker.getRegistration("/");
        const subscription = await registration?.pushManager.getSubscription();
        if (cancelled) return;
        setPublicKey(config.publicKey);
        setEnabled(Boolean(subscription && config.endpoints.includes(subscription.endpoint)));
        setReady(true);
      } catch (error) { if (!cancelled) setMessage(error instanceof Error ? error.message : "Pengaturan notifikasi gagal dimuat."); }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const enable = async () => {
    if (busy || !ready) return;
    setBusy(true);
    setMessage("");
    try {
      // Ask only from this button's user gesture, never on page load.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Izinkan notifikasi Vistiq pada pengaturan browser/HP, lalu coba lagi.");
      await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
      const registration = await Promise.race([navigator.serviceWorker.ready, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Layanan notifikasi belum siap. Refresh halaman lalu coba lagi.")), 15_000))]);
      const existing = await registration.pushManager.getSubscription();
      const subscription = existing ?? await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) });
      await pushRequest("POST", { subscription: subscription.toJSON() });
      setEnabled(true);
      setMessage("Notifikasi HP aktif, termasuk saat aplikasi ditutup atau sudah logout.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Gagal mengaktifkan notifikasi HP."); }
    finally { setBusy(false); }
  };

  const disable = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration("/");
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await pushRequest("DELETE", { endpoint: subscription.endpoint });
        await subscription.unsubscribe();
      }
      setEnabled(false);
      setMessage("Notifikasi HP dinonaktifkan untuk perangkat ini.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Gagal menonaktifkan notifikasi HP."); }
    finally { setBusy(false); }
  };

  const test = async (background = false) => {
    if (busy) return;
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration("/");
      const subscription = await registration?.pushManager.getSubscription();
      if (!subscription) throw new Error("Aktifkan notifikasi HP terlebih dahulu.");
      await registration?.update().catch(() => {});
      await pushRequest("POST", { action: "test", endpoint: subscription.endpoint, background });
      setMessage(background ? "Silakan logout dan tutup aplikasi sekarang. Notifikasi tes akan dikirim sekitar satu menit lagi." : "Notifikasi percobaan sedang dikirim ke HP ini.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Percobaan gagal dikirim."); }
    finally { setBusy(false); }
  };

  const buttonStyle = { padding: "8px 10px", border: "1px solid #bfdbfe", borderRadius: 8, background: "#eff6ff", color: "#125a94", fontSize: 12, cursor: "pointer" };
  return (
    <section aria-label="Notifikasi HP" style={{ padding: 12, borderBottom: "1px solid #e2e8f0" }}>
      <strong style={{ fontSize: 13 }}>Notifikasi HP {enabled ? "· Aktif" : ""}</strong>
      <p style={{ margin: "6px 0 10px", fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>Tetap menerima pemberitahuan saat aplikasi ditutup atau sudah logout. Aktifkan hanya pada HP pribadi Anda. Nada mengikuti pengaturan notifikasi HP.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button type="button" style={buttonStyle} disabled={!ready || busy} onClick={enabled ? disable : enable}>{busy ? "Memproses..." : enabled ? "Matikan notifikasi HP" : "Aktifkan notifikasi HP"}</button>
        {enabled && <button type="button" style={buttonStyle} disabled={busy} onClick={() => test()}>Kirim percobaan</button>}
        {enabled && <button type="button" style={buttonStyle} disabled={busy} onClick={() => test(true)}>Tes saat aplikasi ditutup</button>}
      </div>
      {message && <p role="status" style={{ margin: "8px 0 0", fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{message}</p>}
    </section>
  );
}
