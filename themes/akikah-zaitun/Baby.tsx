"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Baby({ invitation }: { invitation: AqiqahInvitationData }) {
  const { baby, parents } = invitation;

  // No dedicated nickname field in the schema - the last word of the full
  // name is a reasonable stand-in for the Indonesian "panggilan" convention
  // (e.g. "Moh. D. Luffy" -> "Luffy").
  const nickname = baby.name.trim().split(/\s+/).pop() || baby.name;

  const genderLabel = baby.gender === "L" ? "Laki-Laki" : baby.gender === "P" ? "Perempuan" : null;
  const childLabel = baby.gender === "L" ? "Putra dari" : baby.gender === "P" ? "Putri dari" : "Anak dari";

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.babyEyebrow}>Walimatul Aqiqah</p>
      </Reveal>

      <Reveal delay={0.1}>
        {baby.photo && (
          <div className={styles.babyMedal}>
            <img src={baby.photo} alt={baby.name} />
          </div>
        )}

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
