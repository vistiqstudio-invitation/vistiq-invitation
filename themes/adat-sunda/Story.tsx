"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import SundaLattice from "./SundaLattice";
import styles from "./style.module.css";

export default function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Cerita Cinta</p>
        <h2 className={styles.title}>Kisah Kami</h2>
        <SundaLattice className={styles.divider} />
      </Reveal>

      <div className={styles.storyTimeline}>
        {invitation.story.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <Reveal key={`${item.title}-${index}`} delay={index * 0.12}>
              <div
                className={`${styles.storyRow} ${isLeft ? styles.storyRowLeft : styles.storyRowRight}`}
              >
                <span className={styles.storyDot} />

                <div className={styles.storyCard}>
                  {item.year && <span className={styles.storyYear}>{item.year}</span>}
                  <h3 className={styles.storyTitle}>{item.title}</h3>
                  <p className={styles.storyDesc}>{item.description}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
