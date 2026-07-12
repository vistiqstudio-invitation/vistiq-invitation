"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import TimpalajaRoof from "./TimpalajaRoof";
import OmboWave from "./OmboWave";
import styles from "./style.module.css";

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Mempelai</p>
        <h2 className={styles.title}>Botting Sipaenrekang</h2>
        <OmboWave className={styles.ornament} />
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.houseWrap}>
          <TimpalajaRoof className={styles.houseRoofMark} />

          <div className={styles.houseFrame}>
            {invitation.bride.photo && (
              <img
                className={styles.houseHalf}
                src={invitation.bride.photo}
                alt={invitation.bride.name}
              />
            )}
            {invitation.groom.photo && (
              <img
                className={styles.houseHalf}
                src={invitation.groom.photo}
                alt={invitation.groom.name}
              />
            )}
            <div className={styles.houseDivider} />
          </div>

          <h3 className={styles.coupleNames}>
            {invitation.bride.name}
            <span>&amp;</span>
            {invitation.groom.name}
          </h3>

          <div className={styles.coupleMetaRow}>
            {invitation.bride.parents && (
              <p className={styles.coupleMeta}>Putri dari {invitation.bride.parents}</p>
            )}
            {invitation.groom.parents && (
              <p className={styles.coupleMeta}>Putra dari {invitation.groom.parents}</p>
            )}
          </div>

          <div className={styles.coupleMetaRow}>
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
