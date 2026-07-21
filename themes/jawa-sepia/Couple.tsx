"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import LotusMark from "./LotusMark";
import styles from "./style.module.css";

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Mempelai</p>
        <h2 className={styles.title}>Kedua Mempelai</h2>
        <LotusMark className={styles.ornament} />
      </Reveal>

      <div className={styles.profileStack}>
        <Reveal delay={0.1}>
          <div className={styles.profileBlock}>
            <div className={styles.profilePhotoWrap}>
              {invitation.bride.photo && (
                <div className={styles.profilePhoto}>
                  <img src={invitation.bride.photo} alt={invitation.bride.name} />
                </div>
              )}

              <img
                className={styles.profileAccent}
                src="/decor/jawa-merah/corner-foliage.png"
                alt=""
                onError={hideOnError}
              />
            </div>

            <h3 className={styles.profileNickname}>{firstName(invitation.bride.name)}</h3>
            <p className={styles.profileName}>{invitation.bride.name}</p>

            {invitation.bride.parents && (
              <p className={styles.profileMeta}>Putri dari {invitation.bride.parents}</p>
            )}

            {invitation.bride.instagram && (
              <a
                className={styles.profileInstagram}
                href={`https://instagram.com/${invitation.bride.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            )}
          </div>
        </Reveal>

        <div className={styles.profileDivider}>
          <span className={styles.profileAmpersand}>&amp;</span>
        </div>

        <Reveal delay={0.2}>
          <div className={styles.profileBlock}>
            <div className={styles.profilePhotoWrap}>
              {invitation.groom.photo && (
                <div className={styles.profilePhoto}>
                  <img src={invitation.groom.photo} alt={invitation.groom.name} />
                </div>
              )}

              <img
                className={styles.profileAccent}
                src="/decor/jawa-merah/corner-foliage.png"
                alt=""
                onError={hideOnError}
              />
            </div>

            <h3 className={styles.profileNickname}>{firstName(invitation.groom.name)}</h3>
            <p className={styles.profileName}>{invitation.groom.name}</p>

            {invitation.groom.parents && (
              <p className={styles.profileMeta}>Putra dari {invitation.groom.parents}</p>
            )}

            {invitation.groom.instagram && (
              <a
                className={styles.profileInstagram}
                href={`https://instagram.com/${invitation.groom.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
