"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Our Journey</p>
        <h2 className={styles.title}>Love Story</h2>
      </Reveal>

      <div className={styles.storyStack}>
        {invitation.story.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 0.08}>
            <div className={styles.storyCard}>
              {item.year && <span className={styles.storyYear}>{item.year}</span>}
              <h3 className={styles.storyTitle}>{item.title}</h3>
              <p className={styles.storyDesc}>{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
