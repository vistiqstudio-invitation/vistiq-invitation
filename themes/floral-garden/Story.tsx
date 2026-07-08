"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import FloralSpray from "./FloralSpray";
import styles from "./style.module.css";

export default function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <FloralSpray
        className={`${styles.spray} ${styles.spraySmall} ${styles.sprayTopLeft}`}
      />
      <FloralSpray
        className={`${styles.spray} ${styles.spraySmall} ${styles.sprayBottomRight}`}
      />

      <Reveal>
        <p className={styles.eyebrow}>Our Journey</p>
        <h2 className={styles.title}>Love Story</h2>
        <div className={styles.ornament}><span className={styles.ornamentMark} /></div>
      </Reveal>

      <div className={styles.storyTimeline}>
        {invitation.story.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 0.1}>
            <div className={styles.storyItem}>
              <div className={styles.storyYear}>{item.year}</div>

              <div>
                <h3 className={styles.storyTitle}>{item.title}</h3>
                <p className={styles.storyDesc}>{item.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
