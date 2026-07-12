"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import OmboWave from "./OmboWave";
import styles from "./style.module.css";

export default function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Kisah Kami</p>
        <h2 className={styles.title}>Riwayat Cinta</h2>
        <OmboWave className={styles.ornament} />
      </Reveal>

      <div className={styles.storyList}>
        {invitation.story.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 0.1}>
            <div className={styles.storyRow}>
              <span className={styles.storyMarker}>
                <OmboWave />
              </span>

              <div className={styles.storyCard}>
                <h3 className={styles.storyTitle}>{item.title}</h3>
                {item.year && <p className={styles.storyMeta}>{item.year}</p>}
                <p className={styles.storyDesc}>{item.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
