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

      <div className={styles.postcards}>
        {invitation.story.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 0.1}>
            <div className={styles.postcard}>
              {item.year && <span className={styles.postcardYear}>{item.year}</span>}
              <h3 className={styles.postcardTitle}>{item.title}</h3>
              <p className={styles.postcardDesc}>{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
