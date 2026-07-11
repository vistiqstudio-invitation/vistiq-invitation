"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Event({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Wedding Event</p>
        <h2 className={styles.title}>Rangkaian Acara</h2>
        <div className={styles.ornament}>
          <span className={styles.ornamentDiamond} />
        </div>
      </Reveal>

      <div className={styles.eventGrid}>
        {invitation.events.map((event, index) => (
          <Reveal key={event.name} delay={index * 0.15}>
            <div className={styles.eventCard}>
              <h3 className={styles.eventName}>{event.name}</h3>
              <div className={styles.eventLine} />

              {event.date && <p className={styles.eventDate}>{event.date}</p>}

              {event.time && (
                <p className={styles.eventDetail}>
                  Pukul <strong>{event.time}</strong>
                </p>
              )}

              {event.location && (
                <p className={styles.eventDetail}>{event.location}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
