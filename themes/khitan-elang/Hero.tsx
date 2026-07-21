"use client";

import Reveal from "@/components/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";
import Eagle from "./Eagle";

export default function Hero({ invitation }: { invitation: KhitanInvitationData }) {
  const targetDate = invitation.event?.rawDate || null;
  const time = useCountdown(targetDate);
  const showCountdown = targetDate && !time.isPast;

  const items = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <div className={styles.hero}>
      <Reveal>
        <Eagle className={styles.heroEagle} />

        <h2 className={styles.heroTitle}>
          Assalamu'alaikum Warahmatullahi Wabarakatuh, dengan penuh syukur
          kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara
          Walimatul Khitan putra kami.
        </h2>
      </Reveal>

      {showCountdown && (
        <Reveal delay={0.15}>
          <div className={styles.badgeRow}>
            {items.map((item) => (
              <div className={styles.badge} key={item.label}>
                <span className={styles.badgeValue}>{String(item.value).padStart(2, "0")}</span>
                <span className={styles.badgeLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
