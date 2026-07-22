"use client";

import { Fragment } from "react";
import Reveal from "@/components/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";
import LineDivider from "./LineDivider";

export default function Hero({ invitation }: { invitation: AqiqahInvitationData }) {
  const opening = invitation.opening;
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
        <LineDivider className={styles.divider} />

        <h2 className={styles.heroTitle}>
          {opening?.title ||
            "Assalamu'alaikum Warahmatullahi Wabarakatuh, dengan penuh syukur kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara tasyakuran atas kelahiran putra/putri kami."}
        </h2>
      </Reveal>

      {showCountdown && (
        <Reveal delay={0.15}>
          <div className={styles.badgeRow}>
            {items.map((item, i) => (
              <Fragment key={item.label}>
                {i > 0 && <span className={styles.badgeDivider}>/</span>}
                <div className={styles.badge}>
                  <span className={styles.badgeValue}>{String(item.value).padStart(2, "0")}</span>
                  <span className={styles.badgeLabel}>{item.label}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
