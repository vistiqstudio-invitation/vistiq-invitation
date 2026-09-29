"use client";

import Reveal from "@/components/Reveal";
import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";
import Crown from "./Crown";

export default function Event({ invitation }: { invitation: KhitanInvitationData }) {
  if (!invitation.event) return null;

  const { event } = invitation;
  const quote = invitation.opening?.quote?.trim() || "";
  const entertainmentMatch = quote.match(/^hiburan\s*:\s*(.+)$/i);
  const entertainment = entertainmentMatch?.[1]?.trim() || "";

  return (
    <div className={styles.section}>
      <Reveal>
        <div className={styles.eventCard}>
          <Crown className={styles.eventCrown} />

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

          {entertainment && (
            <>
              <h4 className={styles.eventSub}>Hiburan</h4>
              <p className={styles.eventDetail}>{entertainment}</p>
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
