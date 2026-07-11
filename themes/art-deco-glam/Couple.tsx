"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import SunburstFan from "./SunburstFan";
import styles from "./style.module.css";

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>The Bride &amp; Groom</p>
        <h2 className={`${styles.title} ${styles.titleArabic}`}>Bismillahirrahmanirrahim</h2>
        <div className={styles.ornament}>
          <span className={styles.ornamentDiamond} />
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.hexRow}>
          <div className={styles.hexWrap}>
            {invitation.bride.photo && (
              <div className={styles.hexPhoto}>
                <img src={invitation.bride.photo} alt={invitation.bride.name} />
              </div>
            )}
            <h3 className={styles.hexName}>{invitation.bride.name}</h3>
            {invitation.bride.parents && (
              <p className={styles.hexMeta}>Putri dari {invitation.bride.parents}</p>
            )}
            {invitation.bride.instagram && (
              <p className={styles.hexMeta}>
                <a
                  href={`https://instagram.com/${invitation.bride.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{invitation.bride.instagram.replace("@", "")}
                </a>
              </p>
            )}
          </div>

          <SunburstFan className={styles.hexDivider} style={{ transform: "rotate(90deg)" }} />

          <div className={styles.hexWrap}>
            {invitation.groom.photo && (
              <div className={styles.hexPhoto}>
                <img src={invitation.groom.photo} alt={invitation.groom.name} />
              </div>
            )}
            <h3 className={styles.hexName}>{invitation.groom.name}</h3>
            {invitation.groom.parents && (
              <p className={styles.hexMeta}>Putra dari {invitation.groom.parents}</p>
            )}
            {invitation.groom.instagram && (
              <p className={styles.hexMeta}>
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
        </div>
      </Reveal>
    </div>
  );
}
