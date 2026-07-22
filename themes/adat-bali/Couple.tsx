"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Mempelai</p>
        <h2 className={styles.title}>Kedua Mempelai</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.divider} src="/decor/adat-bali/divider.png" alt="" aria-hidden="true" />
      </Reveal>

      <div className={styles.coupleStack}>
        <Reveal delay={0.1}>
          <div className={styles.coupleBlock}>
            {invitation.groom.photo && (
              <div className={styles.couplePhoto}>
                <img src={invitation.groom.photo} alt={invitation.groom.name} />
              </div>
            )}

            <h3 className={styles.coupleName}>{invitation.groom.name}</h3>

            {invitation.groom.parents && (
              <p className={styles.coupleMeta}>Putra dari {invitation.groom.parents}</p>
            )}

            {invitation.groom.instagram && (
              <p className={styles.coupleMeta}>
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

        <Reveal delay={0.2}>
          <p className={styles.coupleDivider}>dengan</p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className={styles.coupleBlock}>
            {invitation.bride.photo && (
              <div className={styles.couplePhoto}>
                <img src={invitation.bride.photo} alt={invitation.bride.name} />
              </div>
            )}

            <h3 className={styles.coupleName}>{invitation.bride.name}</h3>

            {invitation.bride.parents && (
              <p className={styles.coupleMeta}>Putri dari {invitation.bride.parents}</p>
            )}

            {invitation.bride.instagram && (
              <p className={styles.coupleMeta}>
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
        </Reveal>
      </div>
    </div>
  );
}
