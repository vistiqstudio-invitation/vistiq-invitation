"use client";

import Reveal from "@/components/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Event({ invitation }: { invitation: InvitationData }) {
  const targetDate = invitation.events[0]?.rawDate || null;
  const time = useCountdown(targetDate);

  const showCountdown = targetDate && !time.isPast;

  const items = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Wedding Event</p>
        <h2 className={styles.title}>Rangkaian Acara</h2>
      </Reveal>

      {showCountdown && (
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
      )}

      <div className={styles.eventGrid}>
        {invitation.events.map((event, index) => (
          <Reveal key={event.name} delay={index * 0.1}>
            <div className={styles.eventCard}>
              <h3 className={styles.eventName}>{event.name}</h3>
              <div className={styles.eventLine} />

              {event.date && <p className={styles.eventDate}>{event.date}</p>}

              {event.time && (
                <p className={styles.eventDetail}>
                  Pukul <strong>{event.time}</strong>
                </p>
              )}

              {event.location && <p className={styles.eventDetail}>{event.location}</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
