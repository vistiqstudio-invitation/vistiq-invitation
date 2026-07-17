"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import MoonStar from "./MoonStar";
import styles from "./style.module.css";

export default function Event({ invitation }: { invitation: AqiqahInvitationData }) {
  if (!invitation.event) return null;

  const { event } = invitation;

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Waktu &amp; Tempat</p>
        <h2 className={styles.title}>Acara Aqiqah</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.eventCard}>
          <MoonStar className={styles.cornerOrnament} />

          <h3 className={styles.eventName}>Aqiqah &amp; Tasyakuran</h3>
          <div className={styles.eventLine} />

          {event.date && <p className={styles.eventDate}>{event.date}</p>}

          {event.time && (
            <p className={styles.eventDetail}>
              Pukul <strong>{event.time}</strong>
              {event.location ? (
                <>
                  <br />
                  {event.location}
                </>
              ) : null}
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
