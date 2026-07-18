"use client";

import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";

export default function FloatingMenu({ invitation }: { invitation: KhitanInvitationData }) {
  const nickname = invitation.child.name.trim().split(/\s+/).pop() || invitation.child.name;

  const items = [
    { id: "home", icon: "⌂", label: "Home" },
    { id: "child", icon: "☺", label: nickname },
    { id: "event", icon: "☰", label: "Acara" },
    { id: "gallery", icon: "▦", label: "Galeri" },
    { id: "rsvp", icon: "✉", label: "Rsvp" },
  ];

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
