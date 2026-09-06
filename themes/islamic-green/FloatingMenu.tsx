"use client";

import styles from "./style.module.css";

type IconName = "home" | "couple" | "event" | "gallery" | "gift";

const items: Array<{ id: string; icon: IconName; label: string }> = [
  { id: "home", icon: "home", label: "Home" },
  { id: "couple", icon: "couple", label: "Couple" },
  { id: "event", icon: "event", label: "Event" },
  { id: "gallery", icon: "gallery", label: "Gallery" },
  { id: "gift", icon: "gift", label: "Gift" },
];

function FeatureIcon({ name }: { name: IconName }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.55,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "home") {
    return (
      <svg {...common}>
        <path d="m3.5 10.8 8.5-7 8.5 7" />
        <path d="M5.5 9.8V21h13V9.8" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    );
  }

  if (name === "couple") {
    return (
      <svg {...common}>
        <path d="M20.4 8.6c0 5.1-8.4 10.2-8.4 10.2S3.6 13.7 3.6 8.6A4.25 4.25 0 0 1 12 6a4.25 4.25 0 0 1 8.4 2.6Z" />
      </svg>
    );
  }

  if (name === "event") {
    return (
      <svg {...common}>
        <rect x="3.5" y="5" width="17" height="16" rx="2" />
        <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" />
        <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
      </svg>
    );
  }

  if (name === "gallery") {
    return (
      <svg {...common}>
        <rect x="3.5" y="4" width="17" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.25" />
        <path d="m4.5 17 4.2-4 3.1 2.8 2.1-2 5.6 4.7" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 8.5h16v11H4zM3 8.5h18v-3H3zM12 5.5v14M3 8.5h18" />
      <path d="M12 5.5c-.5-2.1-2-3.5-3.8-3.5C7 2 6.3 3 7 4.1c.8 1.2 2.6 1.4 5 1.4ZM12 5.5c.5-2.1 2-3.5 3.8-3.5C17 2 17.7 3 17 4.1c-.8 1.2-2.6 1.4-5 1.4Z" />
    </svg>
  );
}

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
          <span className={styles.floatingMenuIcon}>
            <FeatureIcon name={item.icon} />
          </span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
