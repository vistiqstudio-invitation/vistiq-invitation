"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";
import Monogram from "./Monogram";

export default function Baby({ invitation }: { invitation: AqiqahInvitationData }) {
  const { baby, parents } = invitation;

  const nickname = baby.name.trim().split(/\s+/).pop() || baby.name;

  const genderLabel = baby.gender === "L" ? "Laki-Laki" : baby.gender === "P" ? "Perempuan" : null;
  const childLabel = baby.gender === "L" ? "Putra dari" : baby.gender === "P" ? "Putri dari" : "Anak dari";

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Walimatul Aqiqah</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.babyPhoto}>
          <div className={styles.hexFrameInner}>
            {baby.photo ? (
              <img src={baby.photo} alt={baby.name} />
            ) : (
              <Monogram letter={nickname.charAt(0).toUpperCase()} />
            )}
          </div>
        </div>

        <h2 className={styles.babyNickname}>{nickname}</h2>
        <p className={styles.babyFullName}>{baby.name}</p>

        <div className={styles.babyDetails}>
          {genderLabel && <p>Jenis Kelamin : <strong>{genderLabel}</strong></p>}
          {baby.birthDate && (
            <p>
              Lahir : <strong>{baby.birthPlace ? `${baby.birthPlace}, ` : ""}{baby.birthDate}</strong>
            </p>
          )}
          <p className={styles.babyParents}>
            {childLabel} Bapak {parents.father} dan Ibu {parents.mother}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
