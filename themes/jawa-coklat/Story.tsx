"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import LotusMark from "./LotusMark";
import styles from "./style.module.css";

export default function Story({ invitation }: { invitation: InvitationData }) {
  const bgPhoto = invitation.groom.photo || invitation.coverImage || invitation.bride.photo;

  return (
    <div
      className={`${styles.section} ${styles.darkSection}`}
      style={bgPhoto ? { backgroundImage: `url(${bgPhoto})` } : undefined}
    >
      <Reveal>
        <p className={styles.eyebrow}>Kisah Kami</p>
        <h2 className={styles.title}>Perjalanan Cinta</h2>
        <LotusMark className={styles.ornament} />
      </Reveal>

      <div className={styles.storyVine}>
        {invitation.story.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 0.12}>
            <div
              className={`${styles.storyItem} ${
                index % 2 === 1 ? styles.storyEven : ""
              }`}
            >
              <span className={styles.storyDot} />
              <div className={styles.storyCard}>
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
