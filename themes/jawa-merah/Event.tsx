"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import LotusMark from "./LotusMark";
import FloralAccent from "./FloralAccent";
import styles from "./style.module.css";

export default function Event({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <FloralAccent variant="corner" className={styles.sectionCornerTR} />

      <Reveal>
        <p className={styles.eyebrow}>Waktu &amp; Tempat</p>
        <h2 className={styles.title}>Wedding Event</h2>
        <LotusMark className={styles.ornament} />
        <p className={styles.eventIntro}>
          Dengan mengucap syukur kepada Tuhan Yang Maha Esa, kami bermaksud
          mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan
          kami yang akan dilaksanakan pada:
        </p>
      </Reveal>

      <div className={styles.eventGrid}>
        {invitation.events.map((event, index) => (
          <Reveal key={event.name} delay={index * 0.15}>
            <div className={styles.eventCard}>
              <h3 className={styles.eventName}>{event.name}</h3>
              {event.date && <p className={styles.eventDate}>{event.date}</p>}

              <div className={styles.eventDash} />

              {event.time && (
                <p className={styles.eventDetail}>
                  Pukul <strong>{event.time}</strong>
                </p>
              )}

              {event.location && (
                <p className={styles.eventDetail}>{event.location}</p>
              )}

              {invitation.mapsUrl && (
                <a
                  className={styles.eventMapButton}
                  href={invitation.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Buka Maps
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
