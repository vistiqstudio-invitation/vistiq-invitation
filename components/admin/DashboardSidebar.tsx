"use client";

import { useState } from "react";
import Link from "next/link";
import OrderNotifications from "@/components/admin/OrderNotifications";
import styles from "@/styles/dashboard.module.css";

export type SidebarItem = {
  key: string;
  label: string;
  href: string;
  external?: boolean;
  icon?: React.ReactNode;
};

export default function DashboardSidebar({
  brandTop,
  brandBottom,
  logoUrl,
  accentColor,
  items,
  activeKey,
  onLogout,
  notificationRole,
}: {
  brandTop: string;
  brandBottom: string;
  logoUrl?: string | null;
  accentColor?: string | null;
  items: SidebarItem[];
  activeKey: string;
  onLogout: () => void;
  notificationRole?: "owner" | "reseller";
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <aside
      className={styles.sidebar}
      style={accentColor ? ({ "--accent": accentColor } as React.CSSProperties) : undefined}
    >
      <div className={styles.brandBlock}>
        {notificationRole && <OrderNotifications role={notificationRole} />}
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={brandBottom} className={styles.brandLogo} />
        )}
        <p className={styles.brandSmall}>{brandTop}</p>
        <h2 className={styles.brand}>{brandBottom}</h2>
      </div>

      <button
        type="button"
        className={styles.menuToggle}
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      <nav className={mobileOpen ? `${styles.menu} ${styles.menuOpen}` : styles.menu}>
        {items.map((item) =>
          item.external ? (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={item.key === activeKey ? styles.menuActive : styles.menuButton}
              onClick={closeMobile}
            >
              {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
              {item.label}
            </a>
          ) : (
            <Link
              key={item.key}
              href={item.href}
              className={item.key === activeKey ? styles.menuActive : styles.menuButton}
              onClick={closeMobile}
            >
              {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
              {item.label}
            </Link>
          )
        )}
      </nav>

      <button onClick={onLogout} className={styles.logoutButton}>
        Logout
      </button>
    </aside>
  );
}
