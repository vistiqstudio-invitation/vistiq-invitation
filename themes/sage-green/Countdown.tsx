"use client";

import Reveal from "@/components/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import styles from "./style.module.css";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const time = useCountdown(targetDate);

  if (time.isPast) return null;

  const items = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Menuju Hari Bahagia</p>
        <h2 className={styles.title}>Countdown</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.badgeRow}>
          {items.map((item) => (
            <div className={styles.badge} key={item.label}>
              <span className={styles.badgeValue}>{String(item.value).padStart(2, "0")}</span>
              <span className={styles.badgeLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
