"use client";

import Reveal from "@/components/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import styles from "./style.module.css";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const time = useCountdown(targetDate);

  if (time.isPast) return null;

  const units = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Menuju Hari Bahagia</p>
        <h2 className={styles.title}>Save The Date</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.countdownInline}>
          {units.map((unit, i) => (
            <span className={styles.countdownUnit} key={unit.label}>
              <span className={styles.countdownInlineValue}>
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className={styles.countdownInlineLabel}>{unit.label}</span>
              {i < units.length - 1 && <span className={styles.countdownSlash}>/</span>}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
