"use client";

import Reveal from "@/components/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import styles from "./style.module.css";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const time = useCountdown(targetDate);

  if (time.isPast) return null;

  const boxes = [
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
        <div className={styles.ornament}><span className={styles.ornamentMark} /></div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.countdown}>
          {boxes.map((box) => (
            <div className={styles.countdownBox} key={box.label}>
              <span className={styles.countdownValue}>
                {String(box.value).padStart(2, "0")}
              </span>
              <span className={styles.countdownLabel}>{box.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
