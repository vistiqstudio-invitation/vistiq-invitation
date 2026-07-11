"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const NUMERALS = ["I", "II", "III", "IV", "V"];

export default function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Our Journey</p>
        <h2 className={styles.title}>Love Story</h2>
        <div className={styles.ornament}>
          <span className={styles.ornamentDiamond} />
        </div>
      </Reveal>

      <div className={styles.staircase}>
        {invitation.story.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 0.12}>
            <div className={styles.stairItem}>
              <span className={styles.stairNumber}>{NUMERALS[index] || index + 1}</span>

              <div className={styles.stairCard}>
                <h3 className={styles.stairTitle}>{item.title}</h3>
                {item.year && <p className={styles.stairYear}>{item.year}</p>}
                <p className={styles.stairDesc}>{item.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
