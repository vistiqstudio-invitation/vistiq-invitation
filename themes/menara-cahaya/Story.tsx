"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import IslamicStar from "./IslamicStar";
import styles from "./style.module.css";

export default function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Kisah Kami</p>
        <h2 className={styles.title}>Perjalanan Cinta</h2>
        <IslamicStar className={styles.ornament} />
      </Reveal>

      <div className={styles.brickGrid}>
        {invitation.story.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 0.1}>
            <div className={styles.brickItem}>
              <div className={styles.brickCard}>
                {item.year && <p className={styles.brickYear}>{item.year}</p>}
                <h3 className={styles.brickTitle}>{item.title}</h3>
                <p className={styles.brickDesc}>{item.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
