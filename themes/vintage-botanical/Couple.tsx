"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import FernSprig from "./FernSprig";
import styles from "./style.module.css";

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>The Bride &amp; Groom</p>
        <h2 className={`${styles.title} ${styles.titleArabic}`}>Bismillahirrahmanirrahim</h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.diptych}>
          <div className={styles.plateCard}>
            {invitation.bride.photo && (
              <div className={styles.ovalPhoto}>
                <img src={invitation.bride.photo} alt={invitation.bride.name} />
              </div>
            )}

            <FernSprig className={styles.plateSprig} />
            <p className={styles.plateCaption}>Mempelai Wanita</p>
            <h3 className={styles.plateName}>{invitation.bride.name}</h3>

            {invitation.bride.parents && (
              <p className={styles.plateMeta}>Putri dari {invitation.bride.parents}</p>
            )}

            {invitation.bride.instagram && (
              <p className={styles.plateMeta}>
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

          <div className={styles.plateCard}>
            {invitation.groom.photo && (
              <div className={styles.ovalPhoto}>
                <img src={invitation.groom.photo} alt={invitation.groom.name} />
              </div>
            )}

            <FernSprig className={styles.plateSprig} />
            <p className={styles.plateCaption}>Mempelai Pria</p>
            <h3 className={styles.plateName}>{invitation.groom.name}</h3>

            {invitation.groom.parents && (
              <p className={styles.plateMeta}>Putra dari {invitation.groom.parents}</p>
            )}

            {invitation.groom.instagram && (
              <p className={styles.plateMeta}>
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
