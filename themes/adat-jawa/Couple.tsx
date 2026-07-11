"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import MeruRoof from "./MeruRoof";
import BatikCorner from "./BatikCorner";
import styles from "./style.module.css";

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Pengantin</p>
        <h2 className={`${styles.title} ${styles.titleArabic}`}>Bismillahirrahmanirrahim</h2>
        <div className={styles.ornament}>
          <span className={styles.ornamentLine} />
          <span className={styles.ornamentDiamond} />
          <span className={styles.ornamentLine} />
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.coupleFrame}>
          <MeruRoof className={styles.coupleRoof} />
          <BatikCorner className={`${styles.coupleCorner} ${styles.coupleCornerLeft}`} />
          <BatikCorner className={`${styles.coupleCorner} ${styles.coupleCornerRight}`} />

          {invitation.bride.photo && (
            <div className={styles.stackPhoto}>
              <img src={invitation.bride.photo} alt={invitation.bride.name} />
            </div>
          )}

          <h3 className={styles.stackName}>{invitation.bride.name}</h3>

          {invitation.bride.parents && (
            <p className={styles.stackMeta}>Putri dari {invitation.bride.parents}</p>
          )}

          {invitation.bride.instagram && (
            <p className={styles.stackMeta}>
              <a
                href={`https://instagram.com/${invitation.bride.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
              >
                @{invitation.bride.instagram.replace("@", "")}
              </a>
            </p>
          )}

          <div className={styles.stackDivider}>
            <MeruRoof className={styles.stackDividerMark} />
          </div>

          {invitation.groom.photo && (
            <div className={styles.stackPhoto}>
              <img src={invitation.groom.photo} alt={invitation.groom.name} />
            </div>
          )}

          <h3 className={styles.stackName}>{invitation.groom.name}</h3>

          {invitation.groom.parents && (
            <p className={styles.stackMeta}>Putra dari {invitation.groom.parents}</p>
          )}

          {invitation.groom.instagram && (
            <p className={styles.stackMeta}>
              <a
                href={`https://instagram.com/${invitation.groom.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
              >
                @{invitation.groom.instagram.replace("@", "")}
              </a>
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
