"use client";

import { useEffect, useState } from "react";

function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, midnight.getTime() - now.getTime());
}

// A rolling "promo ends in..." countdown that resets every night at
// midnight - always shows urgency without needing a real end date, and
// without ever actually running out. Renders null until mounted so the
// server-rendered markup (which has no access to the visitor's clock)
// never mismatches the client's first paint.
export default function PromoCountdown({ className }: { className?: string }) {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    setMs(msUntilMidnight());
    const timer = setInterval(() => setMs(msUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (ms === null) return null;

  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1_000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <p className={className}>
      ⏳ Promo berakhir dalam{" "}
      <strong>
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </strong>
    </p>
  );
}
