"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Baby({ invitation }: { invitation: AqiqahInvitationData }) {
  const { baby, parents } = invitation;

  const childLabel = baby.gender === "L" ? "Putra dari" : baby.gender === "P" ? "Putri dari" : "Anak dari";

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Buah Hati Kami</p>
        <h2 className={styles.title}>Sang Buah Hati</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.babyCard}>
          <h3 className={styles.babyName}>{baby.name}</h3>

          {baby.birthDate && (
            <p className={styles.babyMeta}>
              Lahir, {baby.birthDate}
              {baby.birthPlace ? ` di ${baby.birthPlace}` : ""}
            </p>
          )}

          <div className={styles.babyDivider} />

          <p className={styles.babyMeta}>{childLabel}</p>

          <div className={styles.parentRow}>
            <div className={styles.parentBlock}>
              <small>Ayah</small>
              <strong>{parents.father}</strong>
            </div>
            <div className={styles.parentBlock}>
              <small>Ibu</small>
              <strong>{parents.mother}</strong>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
