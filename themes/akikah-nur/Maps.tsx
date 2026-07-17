"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Maps({ invitation }: { invitation: AqiqahInvitationData }) {
  if (!invitation.mapsUrl && !invitation.mapsEmbedUrl) return null;

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Lokasi</p>
        <h2 className={styles.title}>Petunjuk Arah</h2>
      </Reveal>

      <Reveal delay={0.1}>
        {invitation.mapsEmbedUrl ? (
          <div className={styles.mediaBox}>
            <iframe
              src={invitation.mapsEmbedUrl}
              title="Lokasi Acara"
              loading="lazy"
              allowFullScreen
            />
          </div>
        ) : (
          <div className={styles.mapCard}>
            <p>
              Silakan buka lokasi acara melalui Google Maps untuk mendapatkan
              petunjuk arah menuju tempat berlangsungnya acara.
            </p>

            <a
              className={`${styles.button} ${styles.solid}`}
              href={invitation.mapsUrl || "#"}
              target="_blank"
              rel="noreferrer"
            >
              Buka Google Maps
            </a>
          </div>
        )}
      </Reveal>
    </div>
  );
}
