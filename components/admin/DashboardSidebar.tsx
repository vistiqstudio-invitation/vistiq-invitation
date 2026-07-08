"use client";

import Link from "next/link";
import styles from "@/styles/dashboard.module.css";

export type SidebarItem = {
  key: string;
  label: string;
  href: string;
};

export default function DashboardSidebar({
  brandTop,
  brandBottom,
  items,
  activeKey,
  onLogout,
}: {
  brandTop: string;
  brandBottom: string;
  items: SidebarItem[];
  activeKey: string;
  onLogout: () => void;
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandBlock}>
        <p className={styles.brandSmall}>{brandTop}</p>
        <h2 className={styles.brand}>{brandBottom}</h2>
      </div>

      <nav className={styles.menu}>
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={item.key === activeKey ? styles.menuActive : styles.menuButton}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button onClick={onLogout} className={styles.logoutButton}>
        Logout
      </button>
    </aside>
  );
}
