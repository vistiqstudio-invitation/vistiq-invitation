"use client";

import Reveal from "@/components/Reveal";
import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";
import Monogram from "./Monogram";

export default function Child({ invitation }: { invitation: KhitanInvitationData }) {
  const { child, parents } = invitation;

  const nickname = child.name.trim().split(/\s+/).pop() || child.name;

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Walimatul Khitan</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.childPhoto}>
          <div className={styles.certFrameInner}>
            {child.photo ? (
              <img src={child.photo} alt={child.name} />
            ) : (
              <Monogram letter={nickname.charAt(0).toUpperCase()} />
            )}
          </div>
        </div>

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
