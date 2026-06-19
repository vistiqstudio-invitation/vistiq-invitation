"use client";

import { useEffect, useState } from "react";

export default function Countdown({ date }: { date: string }) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(date).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance <= 0) return;

      setTime({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [date]);

  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
      {[
        ["Hari", time.days],
        ["Jam", time.hours],
        ["Menit", time.minutes],
        ["Detik", time.seconds],
      ].map(([label, value]) => (
        <div key={label} style={boxStyle}>
          <strong style={{ fontSize: 28 }}>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

const boxStyle = {
  width: 90,
  padding: 16,
  borderRadius: 18,
  background: "rgba(255,255,255,.75)",
  border: "1px solid #d6bd83",
  display: "flex",
  flexDirection: "column" as const,
  gap: 6,
};