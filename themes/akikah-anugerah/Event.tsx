"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";
import CornerBracket from "./CornerBracket";

export default function Event({ invitation }: { invitation: AqiqahInvitationData }) {
  if (!invitation.event) return null;

  const { event } = invitation;

  return (
    <div className={styles.section}>
      <Reveal>
        <div className={styles.eventCard}>
          <CornerBracket className={styles.cornerTL} />
          <CornerBracket className={styles.cornerTR} />
          <CornerBracket className={styles.cornerBL} />
          <CornerBracket className={styles.cornerBR} />

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
            <a className={styles.button} href={invitation.mapsUrl} target="_blank" rel="noreferrer">
              Lihat Lokasi Maps
            </a>
          )}
        </div>
      </Reveal>
    </div>
  );
}
