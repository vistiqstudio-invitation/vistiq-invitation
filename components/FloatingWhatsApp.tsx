"use client";

import { usePathname } from "next/navigation";
import styles from "./FloatingWhatsApp.module.css";

const WA_NUMBER = "6281371338032";

function isMarketingPage(pathname: string) {
  return pathname === "/";
}

function getMessage(pathname: string) {
  const theme = pathname.match(/^\/demo(?:-akikah|-khitan)?\/([^/]+)$/)?.[1];

  if (theme) {
    const themeName = theme
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return `Halo Vistiq Invitation, saya tertarik order undangan digital dengan tema ${themeName}. Mohon informasi selengkapnya.`;
  }

  return "Halo Vistiq Invitation, saya ingin order undangan digital. Mohon informasi paket dan cara pemesanannya.";
}

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  if (!isMarketingPage(pathname)) return null;

  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(getMessage(pathname))}`;
  return (
    <a
      className={styles.button}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Order melalui WhatsApp"
    >
      <span className={styles.pulse} aria-hidden="true" />
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16.04 3C8.86 3 3.03 8.73 3.03 15.79c0 2.25.6 4.45 1.74 6.38L3 28.55l6.6-1.7a13.1 13.1 0 0 0 6.43 1.63h.01c7.17 0 13.01-5.74 13.01-12.79C29.05 8.64 23.21 3 16.04 3Zm0 23.32h-.01a10.9 10.9 0 0 1-5.55-1.49l-.4-.23-3.92 1.01 1.05-3.75-.26-.39a10.5 10.5 0 0 1-1.68-5.68c0-5.87 4.83-10.64 10.78-10.64 5.94 0 10.77 4.77 10.77 10.64 0 5.86-4.84 10.53-10.78 10.53Zm5.91-7.98c-.32-.16-1.92-.93-2.22-1.03-.29-.11-.51-.16-.72.16-.22.31-.84 1.03-1.03 1.24-.19.21-.38.23-.7.08-.33-.16-1.37-.5-2.61-1.56a9.7 9.7 0 0 1-1.81-2.22c-.19-.32-.02-.49.14-.65.15-.14.33-.37.49-.55.16-.19.22-.32.32-.53.11-.21.06-.4-.02-.56-.08-.15-.73-1.72-.99-2.36-.27-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.31-1.14 1.09-1.14 2.67 0 1.57 1.16 3.09 1.32 3.3.16.21 2.29 3.44 5.54 4.82.78.33 1.38.52 1.85.67.78.24 1.48.21 2.04.13.62-.09 1.92-.78 2.19-1.52.27-.73.27-1.36.19-1.49-.08-.13-.3-.21-.63-.37Z" />
      </svg>
      <span className={styles.copy}>
        <small>Butuh bantuan?</small>
        <strong>Order via WhatsApp</strong>
      </span>
    </a>
  );
}
