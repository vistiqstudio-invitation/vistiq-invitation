"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>The Bride &amp; Groom</p>
        <h2 className={styles.title}>Mempelai</h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.coupleRow}>
          <div className={styles.circleWrap}>
            {invitation.bride.photo && (
              <div className={styles.circlePhoto}>
                <img src={invitation.bride.photo} alt={invitation.bride.name} />
              </div>
            )}
            <h3 className={styles.circleFirstName}>{invitation.bride.name.split(" ")[0]}</h3>
            <p className={styles.circleName}>{invitation.bride.name}</p>
            {invitation.bride.parents && (
              <p className={styles.circleMeta}>Putri dari {invitation.bride.parents}</p>
            )}
            {invitation.bride.instagram && (
              <p className={styles.circleMeta}>
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

          <span className={styles.coupleAmp}>&amp;</span>

          <div className={styles.circleWrap}>
            {invitation.groom.photo && (
              <div className={styles.circlePhoto}>
                <img src={invitation.groom.photo} alt={invitation.groom.name} />
              </div>
            )}
            <h3 className={styles.circleFirstName}>{invitation.groom.name.split(" ")[0]}</h3>
            <p className={styles.circleName}>{invitation.groom.name}</p>
            {invitation.groom.parents && (
              <p className={styles.circleMeta}>Putra dari {invitation.groom.parents}</p>
            )}
            {invitation.groom.instagram && (
              <p className={styles.circleMeta}>
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
