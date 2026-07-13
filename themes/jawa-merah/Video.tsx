"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import LotusMark from "./LotusMark";
import styles from "./style.module.css";

export default function Video({ invitation }: { invitation: InvitationData }) {
  if (!invitation.videoUrl) return null;

  return (
    <div className={styles.section}>
      <Reveal className={styles.liveBlock}>
        <p className={styles.eyebrow}>Live Streaming</p>
        <h2 className={styles.title}>Saksikan Bersama Kami</h2>
        <LotusMark className={styles.ornament} />

        <p className={styles.liveDesc}>
          Pernikahan kami dapat disaksikan secara langsung melalui live
          streaming pada tautan berikut.
        </p>

        <a
          className={`${styles.button} ${styles.solid}`}
          href={invitation.videoUrl}
          target="_blank"
          rel="noreferrer"
        >
          Join Live
        </a>
      </Reveal>
    </div>
  );
}
