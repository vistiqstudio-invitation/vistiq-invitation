"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Event({ invitation }: { invitation: AqiqahInvitationData }) {
  if (!invitation.event) return null;

  const { event } = invitation;

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Waktu &amp; Tempat</p>
        <h2 className={styles.title}>Acara Tasyakuran</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.eventCard}>
          <h3 className={styles.eventName}>Aqiqah</h3>

          {event.date && (
            <p className={styles.eventDate}>
              {event.date}
              {event.time ? ` - ${event.time}` : ""}
            </p>
          )}

          <hr className={styles.eventDivider} />

          {event.location && (
            <>
              <h4 className={styles.eventSub}>Lokasi Acara</h4>
              <p className={styles.eventDetail}>{event.location}</p>
            </>
          )}

          {invitation.mapsUrl && (
            <a
              className={`${styles.button} ${styles.solid}`}
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
