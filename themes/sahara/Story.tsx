"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Story({ invitation }: { invitation: InvitationData }) {
  const storyPhoto = invitation.gallery[0] || invitation.coverImage;

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Our Journey</p>
        <h2 className={styles.title}>Love Story</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.storyGrid}>
          {storyPhoto && (
            <div className={styles.storyPhoto}>
              <img src={storyPhoto} alt="" />
            </div>
          )}

          <div className={styles.storyList}>
            {invitation.story.map((item, index) => (
              <div className={styles.storyItem} key={`${item.title}-${index}`}>
                <span className={styles.storyMark}>{item.year || index + 1}</span>
                <div>
                  <h3 className={styles.storyTitle}>{item.title}</h3>
                  <p className={styles.storyDesc}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
