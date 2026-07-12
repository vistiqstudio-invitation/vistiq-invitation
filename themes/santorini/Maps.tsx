"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import SunHorizon from "./SunHorizon";
import styles from "./style.module.css";

export default function Maps({ invitation }: { invitation: InvitationData }) {
  if (!invitation.mapsUrl && !invitation.mapsEmbedUrl) return null;

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Titik Temu</p>
        <h2 className={styles.title}>Lokasi Acara</h2>
        <SunHorizon className={styles.ornament} />
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
