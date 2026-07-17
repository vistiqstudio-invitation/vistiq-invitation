"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Maps({ invitation }: { invitation: AqiqahInvitationData }) {
  if (!invitation.mapsEmbedUrl) return null;

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Lokasi</p>
        <h2 className={styles.title}>Petunjuk Arah</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.mediaBox}>
          <iframe
            src={invitation.mapsEmbedUrl}
            title="Lokasi Acara"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </Reveal>
    </div>
  );
}
