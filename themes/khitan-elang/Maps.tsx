"use client";

import Reveal from "@/components/Reveal";
import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";

export default function Maps({ invitation }: { invitation: KhitanInvitationData }) {
  if (!invitation.mapsEmbedUrl) return null;

  return (
    <div className={styles.section}>
      <Reveal>
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
