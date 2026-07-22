"use client";

import { Fragment } from "react";
import Reveal from "@/components/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import PolengTrim from "./PolengTrim";
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
        <p className={styles.eyebrow}>Manuju Pawiwahan</p>
        <h2 className={styles.title}>Hitung Mundur</h2>
        <PolengTrim className={styles.ornament} />
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.countdownRow}>
          {items.map((item, index) => (
            <Fragment key={item.label}>
              {index > 0 && <span className={styles.countdownBead} />}
              <div className={styles.countdownRing}>
                <span className={styles.countdownValue}>
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className={styles.countdownLabel}>{item.label}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
