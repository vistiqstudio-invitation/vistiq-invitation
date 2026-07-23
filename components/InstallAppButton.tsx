"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./InstallAppButton.module.css";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isDashboardPage(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/reseller") ||
    pathname.startsWith("/client")
  );
}

function stacksAboveWhatsApp(pathname: string) {
  return pathname === "/";
}

function getInstructions() {
  if (typeof navigator === "undefined") return null;

  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);

  if (isIOS) {
    return "Tap tombol Share (kotak dengan panah ke atas) di Safari, lalu pilih \"Add to Home Screen\".";
  }

  if (/android/i.test(ua)) {
    return "Buka menu titik tiga di Chrome, lalu pilih \"Install app\" atau \"Tambahkan ke layar utama\".";
  }

  return "Klik ikon Install di address bar, atau buka menu titik tiga (⋮) lalu pilih \"Install Vistiq Invitation...\".";
}

export default function InstallAppButton() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const iosStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standaloneQuery.matches || iosStandalone);

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  if (!isDashboardPage(pathname) || isStandalone) return null;

  const handleClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsStandalone(true);
      setDeferredPrompt(null);
      return;
    }

    setShowHint((prev) => !prev);
  };

  return (
    <div
      className={`${styles.wrap} ${stacksAboveWhatsApp(pathname) ? styles.stacked : ""}`}
    >
      {showHint && (
        <div className={styles.hint} role="tooltip">
          {getInstructions()}
          <button
            type="button"
            className={styles.hintClose}
            onClick={() => setShowHint(false)}
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>
      )}

      <button
        type="button"
        className={styles.button}
        onClick={handleClick}
        aria-label="Install aplikasi Vistiq Invitation"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1Z" />
          <path d="M5 15a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2a1 1 0 1 1 2 0v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2a1 1 0 0 1 1-1Z" />
        </svg>
        <span className={styles.copy}>
          <small>Akses lebih cepat</small>
          <strong>Install Aplikasi</strong>
        </span>
      </button>
    </div>
  );
}
