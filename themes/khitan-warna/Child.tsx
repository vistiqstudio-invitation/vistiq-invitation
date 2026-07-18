"use client";

import Reveal from "@/components/Reveal";
import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";

export default function Child({ invitation }: { invitation: KhitanInvitationData }) {
  const { child, parents } = invitation;

  // No dedicated nickname field in the schema - last word of the full name
  // stands in for the Indonesian "panggilan" convention.
  const nickname = child.name.trim().split(/\s+/).pop() || child.name;

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Walimatul Khitan</p>
      </Reveal>

      <Reveal delay={0.1}>
        {child.photo && (
          <div className={styles.childMedal}>
            <img src={child.photo} alt={child.name} />
          </div>
        )}

        <h2 className={styles.childNickname}>{nickname}</h2>
        <p className={styles.childFullName}>{child.name}</p>

        <div className={styles.childDetails}>
          <p className={styles.childParents}>
            Putra dari Bapak {parents.father} dan Ibu {parents.mother}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
