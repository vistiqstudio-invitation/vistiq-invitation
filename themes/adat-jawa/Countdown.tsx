"use client";

import Reveal from "@/components/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import styles from "./style.module.css";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const time = useCountdown(targetDate);

  if (time.isPast) return null;

  const plaques = [
    { label: "Dina", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Netepi Janji</p>
        <h2 className={styles.title}>Cacah Dina</h2>
        <div className={styles.ornament}>
          <span className={styles.ornamentLine} />
          <span className={styles.ornamentDiamond} />
          <span className={styles.ornamentLine} />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.plaqueRow}>
          {plaques.map((plaque) => (
            <div className={styles.plaque} key={plaque.label}>
              <span className={styles.plaqueValue}>
                {String(plaque.value).padStart(2, "0")}
              </span>
              <span className={styles.plaqueLabel}>{plaque.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
