"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PushNotificationControl from "@/components/admin/PushNotificationControl";
import styles from "@/styles/dashboard.module.css";

type NotificationRole = "owner" | "reseller";

type OrderNotice = {
  id: string;
  eventKey?: string;
  title: string;
  detail: string;
  createdAt: string;
  href: string;
};

const LAST_SEEN_PREFIX = "vistiq-order-notifications-seen";
const DISMISSED_PREFIX = "vistiq-order-notifications-dismissed";
const ALERTED_PREFIX = "vistiq-order-notifications-alerted";
const SOUND_PREFIX = "vistiq-order-notifications-sound";
// Keep one browser audio context across dashboard page navigation.
let notificationAudio: AudioContext | null = null;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function OrderNotifications({ role }: { role: NotificationRole }) {
  const supabase = useMemo(() => createClient(), []);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState<OrderNotice[]>([]);
  const [lastSeen, setLastSeen] = useState(0);
  const [storageKey, setStorageKey] = useState("");
  const [dismissedKey, setDismissedKey] = useState("");

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundError, setSoundError] = useState("");
  const audioRef = useRef<AudioContext | null>(notificationAudio);
  const soundRef = useRef(false);
  const soundKeyRef = useRef("");
  const alertedRef = useRef<Set<string> | null>(null);
  const scopeRef = useRef("");
  const loadingRef = useRef(false);

  const playChime = useCallback(() => {
    const context = audioRef.current;
    if (!soundRef.current || !context || context.state !== "running") return;
    [880, 1175].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + index * 0.16;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.3);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  }, []);

  const applyNotices = useCallback((items: OrderNotice[]) => {
    const previous = alertedRef.current;
    // The initial load is a baseline; old orders must not ring on every visit.
    const hasNew = previous !== null && items.some((item) => !previous.has(item.eventKey || item.id));
    const next = new Set([...(previous ?? []), ...items.map((item) => item.eventKey || item.id)].slice(-200));
    alertedRef.current = next;
    try { window.sessionStorage.setItem(scopeRef.current, JSON.stringify([...next])); } catch { /* Keep in-memory deduplication. */ }
    setNotices(items);
    if (hasNew) playChime();
  }, [playChime]);

  const unlockSound = useCallback(async () => {
    if (!soundRef.current || !window.AudioContext) return;
    try {
      const context = audioRef.current ?? new AudioContext();
      audioRef.current = context;
      notificationAudio = context;
      if (context.state === "suspended") await context.resume();
    } catch { /* A later user interaction can unlock audio. */ }
  }, []);

  const toggleSound = async () => {
    setSoundError("");
    if (soundRef.current) {
      soundRef.current = false;
      setSoundEnabled(false);
      try { window.localStorage.setItem(soundKeyRef.current, "off"); } catch { /* Preference stays in memory. */ }
      return;
    }
    if (!window.AudioContext) {
      setSoundError("Browser ini belum mendukung nada notifikasi.");
      return;
    }
    try {
      const context = audioRef.current ?? new AudioContext();
      audioRef.current = context;
      notificationAudio = context;
      await context.resume();
      if (context.state !== "running") throw new Error("Audio unavailable");
      soundRef.current = true;
      setSoundEnabled(true);
      try { window.localStorage.setItem(soundKeyRef.current, "on"); } catch { /* Preference stays in memory. */ }
      playChime();
    } catch {
      setSoundError("Nada belum bisa diaktifkan. Ketuk Aktifkan nada untuk mencoba lagi.");
    }
  };

  useEffect(() => {
    document.addEventListener("pointerdown", unlockSound);
    document.addEventListener("keydown", unlockSound);
    return () => {
      document.removeEventListener("pointerdown", unlockSound);
      document.removeEventListener("keydown", unlockSound);
      // The shared context stays available for the next dashboard page.
    };
  }, [unlockSound]);

  const loadNotifications = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const key = `${LAST_SEEN_PREFIX}:${role}:${user.id}`;
    const hiddenKey = `${DISMISSED_PREFIX}:${role}:${user.id}`;
    setStorageKey(key);
    setDismissedKey(hiddenKey);

    const scope = `${ALERTED_PREFIX}:${role}:${user.id}`;
    if (scopeRef.current !== scope) {
      scopeRef.current = scope;
      alertedRef.current = null;
      soundKeyRef.current = `${SOUND_PREFIX}:${role}:${user.id}`;
      try {
        const stored: unknown = JSON.parse(window.sessionStorage.getItem(scope) || "null");
        if (Array.isArray(stored)) alertedRef.current = new Set(stored.filter((id): id is string => typeof id === "string"));
        soundRef.current = window.localStorage.getItem(soundKeyRef.current) === "on";
        setSoundEnabled(soundRef.current);
      } catch { /* Defaults remain available without browser storage. */ }
    }


    let dismissed = new Set<string>();
    try {
      dismissed = new Set(JSON.parse(window.localStorage.getItem(hiddenKey) || "[]"));
    } catch {
      window.localStorage.removeItem(hiddenKey);
    }

    const saved = window.localStorage.getItem(key);
    const initialSeen = saved ? Number(saved) : Date.now() - 24 * 60 * 60 * 1000;
    setLastSeen(Number.isFinite(initialSeen) ? initialSeen : Date.now());

    if (role === "owner") {
      const [checkoutResult, clientResult] = await Promise.all([
        supabase
          .from("checkout_orders")
          .select("id, order_id, package_name, customer_name, amount, status, created_at")
          .order("created_at", { ascending: false })
          .limit(12),
        supabase
          .from("clients")
          .select("id, name, package_name, created_at, reseller_id")
          .not("reseller_id", "is", null)
          .order("created_at", { ascending: false })
          .limit(12),
      ]);

      if (checkoutResult.error || clientResult.error) throw checkoutResult.error || clientResult.error;

      const checkoutNotices: OrderNotice[] = (checkoutResult.data ?? []).map((order) => ({
        id: `checkout:${order.id}`,
        eventKey: `checkout:${order.id}:${order.status}`,
        title: `${order.status === "paid" ? "Pembayaran sukses" : "Order baru"}: ${order.customer_name}`,
        detail: `${order.package_name} · Rp ${Number(order.amount || 0).toLocaleString("id-ID")} · ${order.status}`,
        createdAt: order.created_at,
        href: "/admin/transactions",
      }));

      const resellerNotices: OrderNotice[] = (clientResult.data ?? []).map((client) => ({
        id: `reseller-client:${client.id}`,
        title: `Client reseller baru: ${client.name}`,
        detail: client.package_name || "Paket undangan",
        createdAt: client.created_at,
        href: "/admin/clients",
      }));

      applyNotices(
        [...checkoutNotices, ...resellerNotices]
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
          .filter((notice) => !dismissed.has(notice.id))
          .slice(0, 15)
      );
      return;
    }

    const { data: reseller, error: resellerError } = await supabase
      .from("resellers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (resellerError) throw resellerError;
    if (!reseller) {
      setNotices([]);
      return;
    }

    const { data, error } = await supabase
      .from("clients")
      .select("id, name, package_name, status, created_at")
      .eq("reseller_id", reseller.id)
      .order("created_at", { ascending: false })
      .limit(15);

    if (error) throw error;
    applyNotices(
      (data ?? []).map((client) => ({
        id: `client:${client.id}`,
        title: `Order client baru: ${client.name}`,
        detail: `${client.package_name || "Paket undangan"} · ${client.status || "active"}`,
        createdAt: client.created_at,
        href: "/reseller/invitations",
      })).filter((notice) => !dismissed.has(notice.id))
    );
    } catch (error) {
      console.error("Gagal memuat notifikasi pesanan:", error);
    } finally {
      loadingRef.current = false;
    }
  }, [role, supabase, applyNotices]);

  useEffect(() => {
    const initial = window.setTimeout(loadNotifications, 0);
    const timer = window.setInterval(loadNotifications, 20_000);
    const onVisible = () => { if (document.visibilityState === "visible") void loadNotifications(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadNotifications]);

  useEffect(() => {
    const closePanel = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closePanel);
    return () => document.removeEventListener("mousedown", closePanel);
  }, []);

  const unread = notices.filter((notice) => Date.parse(notice.createdAt) > lastSeen).length;

  const markAllRead = () => {
    const now = Date.now();
    setLastSeen(now);
    if (storageKey) window.localStorage.setItem(storageKey, String(now));
  };

  const dismissNotice = (id: string) => {
    if (!dismissedKey) return;

    let dismissed: string[] = [];
    try {
      dismissed = JSON.parse(window.localStorage.getItem(dismissedKey) || "[]");
    } catch {
      dismissed = [];
    }

    const nextDismissed = [id, ...dismissed.filter((item) => item !== id)].slice(0, 200);
    window.localStorage.setItem(dismissedKey, JSON.stringify(nextDismissed));
    setNotices((current) => current.filter((notice) => notice.id !== id));
  };

  return (
    <div className={styles.notificationWrap} ref={panelRef}>
      <button
        type="button"
        className={styles.notificationBell}
        onClick={() => setOpen((value) => !value)}
        aria-label={`Notifikasi pesanan${unread ? `, ${unread} belum dibaca` : ""}`}
      >
        <span aria-hidden="true">🔔</span>
        {unread > 0 && <span className={styles.notificationCount}>{unread > 99 ? "99+" : unread}</span>}
      </button>

      {open && (
        <section className={styles.notificationPanel} aria-label="Daftar notifikasi pesanan" style={{ maxHeight: "min(720px, calc(100dvh - 96px))", overflowY: "auto" }}>
          <div className={styles.notificationHeader}>
            <div>
              <strong>Pesanan Baru</strong>
              <p>{unread ? `${unread} belum dibaca` : "Semua sudah dibaca"}</p>
            </div>
            {unread > 0 && (
              <button type="button" onClick={markAllRead}>Tandai dibaca</button>
            )}
          </div>

          <div style={{ padding: 12, borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button type="button" onClick={toggleSound} disabled={!storageKey} aria-pressed={soundEnabled} style={{ padding: "8px 10px", border: "1px solid #bfdbfe", borderRadius: 8, background: "#eff6ff", color: "#125a94", fontSize: 12, cursor: "pointer" }}>
                {soundEnabled ? "🔊 Nada aktif · Matikan" : "🔇 Aktifkan nada"}
              </button>
              {soundEnabled && <button type="button" onClick={async () => { await unlockSound(); playChime(); }} style={{ padding: "8px 10px", border: "1px solid #bfdbfe", borderRadius: 8, background: "#fff", color: "#125a94", fontSize: 12, cursor: "pointer" }}>Tes nada</button>}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 11, lineHeight: 1.5, color: "#64748b" }}>Nada berbunyi saat ada notifikasi baru selama dashboard terbuka.</p>
            {soundError && <p role="alert" style={{ margin: "8px 0 0", fontSize: 12, color: "#b91c1c" }}>{soundError}</p>}
          </div>
          <PushNotificationControl />
          <div className={styles.notificationList}>
            {notices.length === 0 ? (
              <p className={styles.notificationEmpty}>Belum ada pesanan.</p>
            ) : (
              notices.map((notice) => {
                const isUnread = Date.parse(notice.createdAt) > lastSeen;
                return (
                  <div
                    key={notice.id}
                    className={`${styles.notificationItem} ${isUnread ? styles.notificationUnread : ""}`}
                  >
                    <span className={styles.notificationDot} />
                    <Link
                      href={notice.href}
                      className={styles.notificationItemLink}
                      onClick={markAllRead}
                    >
                      <strong>{notice.title}</strong>
                      <p>{notice.detail}</p>
                      <time>{formatDate(notice.createdAt)}</time>
                    </Link>
                    <button
                      type="button"
                      className={styles.notificationDelete}
                      onClick={() => dismissNotice(notice.id)}
                      aria-label={`Hapus notifikasi ${notice.title}`}
                      title="Hapus notifikasi"
                    >
                      ×
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
}
