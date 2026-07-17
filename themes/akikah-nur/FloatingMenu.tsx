"use client";

import styles from "./style.module.css";

const items = [
  { id: "home", icon: "⌂", label: "Home" },
  { id: "baby", icon: "☾", label: "Bayi" },
  { id: "event", icon: "☰", label: "Acara" },
  { id: "gallery", icon: "▦", label: "Galeri" },
  { id: "gift", icon: "✦", label: "Kado" },
  { id: "rsvp", icon: "✉", label: "RSVP" },
];

export default function FloatingMenu() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={styles.floatingMenu} aria-label="Navigasi undangan">
      {items.map((item) => (
        <button
          key={item.id}
          className={styles.floatingMenuItem}
          onClick={() => scrollTo(item.id)}
        >
          <span className={styles.floatingMenuIcon}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
