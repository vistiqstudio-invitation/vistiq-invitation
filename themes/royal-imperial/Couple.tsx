"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import RoyalCrest from "./RoyalCrest";
import styles from "./style.module.css";

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>The Bride &amp; Groom</p>
        <h2 className={`${styles.title} ${styles.titleArabic}`}>Bismillahirrahmanirrahim</h2>
        <div className={styles.ornament}><span className={styles.ornamentMark} /></div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.medallion}>
          <RoyalCrest className={`${styles.medallionCrest} ${styles.medallionCrestLeft}`} />
          <RoyalCrest className={`${styles.medallionCrest} ${styles.medallionCrestRight}`} />

          <div className={styles.medallionRow}>
            {invitation.bride.photo && (
              <div className={styles.medallionPhoto}>
                <img src={invitation.bride.photo} alt={invitation.bride.name} />
              </div>
            )}

            <span className={styles.medallionSeal}>&amp;</span>

            {invitation.groom.photo && (
              <div className={styles.medallionPhoto}>
                <img src={invitation.groom.photo} alt={invitation.groom.name} />
              </div>
            )}
          </div>

          <h3 className={styles.medallionNames}>
            {invitation.bride.name}
            <span>&amp;</span>
            {invitation.groom.name}
          </h3>

          <div className={styles.medallionParents}>
            <div>
              {invitation.bride.parents && (
                <p>
                  Putri dari
                  <br />
                  {invitation.bride.parents}
                </p>
              )}
              {invitation.bride.instagram && (
                <a
                  href={`https://instagram.com/${invitation.bride.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{invitation.bride.instagram.replace("@", "")}
                </a>
              )}
            </div>
            <div>
              {invitation.groom.parents && (
                <p>
                  Putra dari
                  <br />
                  {invitation.groom.parents}
                </p>
              )}
              {invitation.groom.instagram && (
                <a
                  href={`https://instagram.com/${invitation.groom.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{invitation.groom.instagram.replace("@", "")}
                </a>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
