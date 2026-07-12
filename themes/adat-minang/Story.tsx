"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import SongketMotif from "./SongketMotif";
import styles from "./style.module.css";

export default function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Kisah Kami</p>
        <h2 className={styles.title}>Perjalanan Cinto</h2>
        <SongketMotif className={styles.ornament} />
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.storyScroll}>
          {invitation.story.map((item, index) => (
            <div className={styles.storyItem} key={`${item.title}-${index}`}>
              <span className={styles.storyDot} />
              {item.year && <span className={styles.storyYear}>{item.year}</span>}

              <div className={styles.storyCard}>
                <h3 className={styles.storyTitle}>{item.title}</h3>
                <p className={styles.storyDesc}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className={styles.storyHint}>Geser untuk melihat perjalanan kami →</p>
      </Reveal>
    </div>
  );
}
