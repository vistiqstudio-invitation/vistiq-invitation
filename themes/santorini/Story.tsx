"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import SunHorizon from "./SunHorizon";
import styles from "./style.module.css";

export default function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Kisah Kami</p>
        <h2 className={styles.title}>Our Story</h2>
        <SunHorizon className={styles.ornament} />
      </Reveal>

      <div className={styles.storyList}>
        {invitation.story.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 0.1}>
            <div className={styles.storyRow}>
              <span className={styles.storyNum}>{String(index + 1).padStart(2, "0")}</span>

              <div className={styles.storyBody}>
                {item.year && <p className={styles.storyYear}>{item.year}</p>}
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
