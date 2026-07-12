"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import IslamicStar from "./IslamicStar";
import styles from "./style.module.css";

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Mempelai</p>
        <h2 className={styles.title}>Dua Hati Bersatu</h2>
        <IslamicStar className={styles.ornament} />
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.archPair}>
          <IslamicStar className={styles.archStar} />

          <div className={styles.archCol}>
            {invitation.bride.photo && (
              <div className={styles.archFrame}>
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

          <div className={styles.archCol}>
            {invitation.groom.photo && (
              <div className={styles.archFrame}>
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
        </div>
      </Reveal>
    </div>
  );
}
