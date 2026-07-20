"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// This platform's real "order" action is a WhatsApp link (no on-site
// checkout - payment is negotiated in chat and confirmed manually), so
// a click on any wa.me link is the closest thing to a conversion the
// Meta Pixel can observe. A single delegated listener covers every
// "Order" button across the site (homepage pricing, demo pickers,
// navbar, reseller pages) without touching each one individually.
export default function LeadTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.("a[href*='wa.me']");
      if (link) {
        window.fbq?.("track", "Lead");
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
