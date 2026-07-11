"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Lampahing Katresnan</p>
        <h2 className={styles.title}>Love Story</h2>
        <div className={styles.ornament}>
          <span className={styles.ornamentLine} />
          <span className={styles.ornamentDiamond} />
          <span className={styles.ornamentLine} />
        </div>
      </Reveal>

      <div className={styles.storyTimeline}>
        {invitation.story.map((item, index) => {
          const reversed = index % 2 === 1;

          return (
            <Reveal key={`${item.title}-${index}`} delay={index * 0.12}>
              <div className={`${styles.storyRow} ${reversed ? styles.storyRowReverse : ""}`}>
                <div className={styles.storyContent}>
                  <div className={styles.storyCard}>
                    <h3 className={styles.storyTitle}>{item.title}</h3>
                    {item.year && <p className={styles.storyMeta}>{item.year}</p>}
                    <p className={styles.storyDesc}>{item.description}</p>
                  </div>
                </div>
                <div className={styles.storySpacer} />
                <span className={styles.storyDot} />
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
