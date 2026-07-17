"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <div className={styles.coupleIntro}>
          <h2 className={styles.coupleGreeting}>Assalamu'alaikum Wr. Wb.</h2>
          <p className={styles.coupleDesc}>
            Dengan memohon rahmat dan ridho Allah SWT, insyaaAllah kami akan
            menyelenggarakan acara pernikahan {invitation.groom.name} &amp;{" "}
            {invitation.bride.name}.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.coupleRow}>
          <div className={styles.archWrap}>
            {invitation.bride.photo && (
              <div className={styles.archPhoto}>
                <img src={invitation.bride.photo} alt={invitation.bride.name} />
              </div>
            )}
            <h3 className={styles.archName}>{invitation.bride.name}</h3>
            {invitation.bride.parents && (
              <p className={styles.archMeta}>Putri dari {invitation.bride.parents}</p>
            )}
            {invitation.bride.instagram && (
              <p className={styles.archMeta}>
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

          <div className={styles.archWrap}>
            {invitation.groom.photo && (
              <div className={styles.archPhoto}>
                <img src={invitation.groom.photo} alt={invitation.groom.name} />
              </div>
            )}
            <h3 className={styles.archName}>{invitation.groom.name}</h3>
            {invitation.groom.parents && (
              <p className={styles.archMeta}>Putra dari {invitation.groom.parents}</p>
            )}
            {invitation.groom.instagram && (
              <p className={styles.archMeta}>
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
