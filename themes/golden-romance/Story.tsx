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

      <div className={styles.arcWrap}>
        {invitation.story.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 0.1}>
            <div className={styles.arcItem}>
              <div className={styles.arcCard}>
                {item.year && <span className={styles.arcYear}>{item.year}</span>}
                <h3 className={styles.arcTitle}>{item.title}</h3>
                <p className={styles.arcDesc}>{item.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
