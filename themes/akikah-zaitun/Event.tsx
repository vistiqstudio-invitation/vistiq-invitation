"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import FloralCorner from "./FloralCorner";
import styles from "./style.module.css";

export default function Event({ invitation }: { invitation: AqiqahInvitationData }) {
  if (!invitation.event) return null;

  const { event } = invitation;

  return (
    <div className={styles.section}>
      <FloralCorner className={styles.eventCornerTL} />
      <FloralCorner className={styles.eventCornerBR} />

      <Reveal>
        <div className={styles.eventCard}>
          <h3 className={styles.eventName}>Acara</h3>

          {event.date && (
            <p className={styles.eventDate}>
              {event.date}
              {event.time ? ` - ${event.time}` : ""}
            </p>
          )}

          {event.location && (
            <>
              <h4 className={styles.eventSub}>Lokasi Acara</h4>
              <p className={styles.eventDetail}>{event.location}</p>
            </>
          )}

          {invitation.mapsUrl && (
            <a
              className={`${styles.button} ${styles.solid}`}
              style={{ background: "#fff", color: "var(--olive)" }}
              href={invitation.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Lihat Lokasi Maps
            </a>
          )}
        </div>
      </Reveal>
    </div>
  );
}
