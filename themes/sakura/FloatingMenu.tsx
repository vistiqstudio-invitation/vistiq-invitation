"use client";

import styles from "./style.module.css";

const items = [
  { id: "home", icon: "⌂", label: "Home" },
  { id: "couple", icon: "♥", label: "Couple" },
  { id: "story", icon: "❁", label: "Story" },
  { id: "event", icon: "☰", label: "Event" },
  { id: "gallery", icon: "▦", label: "Gallery" },
  { id: "gift", icon: "✦", label: "Gift" },
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
