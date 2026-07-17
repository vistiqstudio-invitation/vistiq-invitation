"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

function LeafCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M62 2C48 2 34 10 30 24c-3 10 0 20 8 26 8-14 16-22 24-30 2-6 2-12 0-18Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M46 6C38 8 30 14 27 24c-2 8 0 16 6 21 6-11 12-18 19-25 1-5 0-10-6-14Z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}

export default function Event({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Wedding Event</p>
        <h2 className={styles.title}>Rangkaian Acara</h2>
      </Reveal>

      <div className={styles.eventGrid}>
        {invitation.events.map((event, index) => (
          <Reveal key={event.name} delay={index * 0.1}>
            <div className={styles.eventCard}>
              <LeafCorner className={styles.eventLeaf} />

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

      {invitation.events.length > 1 && (
        <div className={styles.eventDivider}>
          <span />
          <span className={styles.eventDividerMark}>&amp;</span>
          <span />
        </div>
      )}
    </div>
  );
}
