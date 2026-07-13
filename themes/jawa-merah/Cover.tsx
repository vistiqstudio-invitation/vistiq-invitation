"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

export default function Cover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";

  return (
    <motion.section
      className={styles.cover}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <img
        className={styles.coverCornerTL}
        src="/decor/jawa-merah/corner-foliage.png"
        alt=""
        onError={hideOnError}
      />
      <img
        className={styles.coverCornerTR}
        src="/decor/jawa-merah/corner-foliage.png"
        alt=""
        onError={hideOnError}
      />

      <motion.div
        className={styles.coverCard}
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.35, ease: "easeOut" }}
      >
        <p className={styles.coverEyebrow}>The Wedding Of</p>

        {invitation.coverImage && (
          <div className={styles.coverPhotoFrame}>
            <img src={invitation.coverImage} alt="" />
          </div>
        )}

        <h1 className={styles.coverTitle}>
          {invitation.groom.name}
          <span>&amp;</span>
          {invitation.bride.name}
        </h1>

        {invitation.events[0]?.date && (
          <p className={styles.coverDate}>{invitation.events[0].date}</p>
        )}

        <div className={styles.coverGuestBlock}>
          <div className={styles.coverLine} />
          <p className={styles.coverGuestLabel}>Kepada Bapak/Ibu/Saudara/i</p>
          <h2 className={styles.coverGuestName}>{guestName}</h2>
          <p className={styles.coverPlace}>Di Tempat</p>

          <button
            className={`${styles.button} ${styles.solid} ${styles.coverButton}`}
            onClick={() => setOpened(true)}
          >
            Buka Undangan
          </button>
        </div>
      </motion.div>

      <img
        className={styles.coverSpray}
        src="/decor/jawa-merah/floral-spray.png"
        alt=""
        onError={hideOnError}
      />
    </motion.section>
  );
}
