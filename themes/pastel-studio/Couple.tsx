"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>The Bride &amp; Groom</p>
        <h2 className={`${styles.title} ${styles.titleArabic}`}>Bismillahirrahmanirrahim</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.coupleBlock}>
          <div className={styles.chipRow}>
            {invitation.bride.photo && (
              <div className={styles.chipPhoto}>
                <img src={invitation.bride.photo} alt={invitation.bride.name} />
              </div>
            )}

            <span className={styles.chipBadge}>♥</span>

            {invitation.groom.photo && (
              <div className={styles.chipPhoto}>
                <img src={invitation.groom.photo} alt={invitation.groom.name} />
              </div>
            )}
          </div>

          <h3 className={styles.chipNames}>
            {invitation.bride.name} &amp; {invitation.groom.name}
          </h3>

          <div className={styles.chipMetaRow}>
            <div>
              {invitation.bride.parents && (
                <p>Putri dari {invitation.bride.parents}</p>
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
                <p>Putra dari {invitation.groom.parents}</p>
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
