"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

type NotificationRole = "owner" | "reseller";

type OrderNotice = {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  href: string;
};

const LAST_SEEN_PREFIX = "vistiq-order-notifications-seen";

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

  const loadNotifications = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const key = `${LAST_SEEN_PREFIX}:${role}:${user.id}`;
    setStorageKey(key);

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

      const checkoutNotices: OrderNotice[] = (checkoutResult.data ?? []).map((order) => ({
        id: `checkout:${order.id}`,
        title: `Order baru: ${order.customer_name}`,
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

      setNotices(
        [...checkoutNotices, ...resellerNotices]
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
          .slice(0, 15)
      );
      return;
    }

    const { data: reseller } = await supabase
      .from("resellers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!reseller) {
      setNotices([]);
      return;
    }

    const { data } = await supabase
      .from("clients")
      .select("id, name, package_name, status, created_at")
      .eq("reseller_id", reseller.id)
      .order("created_at", { ascending: false })
      .limit(15);

    setNotices(
      (data ?? []).map((client) => ({
        id: `client:${client.id}`,
        title: `Order client baru: ${client.name}`,
        detail: `${client.package_name || "Paket undangan"} · ${client.status || "active"}`,
        createdAt: client.created_at,
        href: "/reseller/invitations",
      }))
    );
  }, [role, supabase]);

  useEffect(() => {
    const initial = window.setTimeout(loadNotifications, 0);
    const timer = window.setInterval(loadNotifications, 20_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
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
        <section className={styles.notificationPanel} aria-label="Daftar notifikasi pesanan">
          <div className={styles.notificationHeader}>
            <div>
              <strong>Pesanan Baru</strong>
              <p>{unread ? `${unread} belum dibaca` : "Semua sudah dibaca"}</p>
            </div>
            {unread > 0 && (
              <button type="button" onClick={markAllRead}>Tandai dibaca</button>
            )}
          </div>

          <div className={styles.notificationList}>
            {notices.length === 0 ? (
              <p className={styles.notificationEmpty}>Belum ada pesanan.</p>
            ) : (
              notices.map((notice) => {
                const isUnread = Date.parse(notice.createdAt) > lastSeen;
                return (
                  <Link
                    href={notice.href}
                    key={notice.id}
                    className={`${styles.notificationItem} ${isUnread ? styles.notificationUnread : ""}`}
                    onClick={markAllRead}
                  >
                    <span className={styles.notificationDot} />
                    <div>
                      <strong>{notice.title}</strong>
                      <p>{notice.detail}</p>
                      <time>{formatDate(notice.createdAt)}</time>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
}
