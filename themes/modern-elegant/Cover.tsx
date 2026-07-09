"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Cover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";

  return (
    <motion.section
      className={styles.cover}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.coverPhotoHalf}
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      >
        {invitation.coverImage && (
          <img className={styles.coverImage} src={invitation.coverImage} alt="" />
        )}
      </motion.div>

      <div className={styles.coverTextHalf}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          <p className={styles.coverEyebrow}>The Wedding Of</p>

          <h1 className={styles.coverTitle}>
            {invitation.groom.name}
            <span className={styles.coverAmp}>&amp;</span>
            {invitation.bride.name}
          </h1>

          {invitation.events[0]?.date && (
            <p className={styles.coverDate}>{invitation.events[0].date}</p>
          )}

          <div className={styles.coverDivider} />

          <p className={styles.guestLabel}>Kepada Yth.</p>
          <h2 className={styles.guestName}>{guestName}</h2>

          <button
            className={`${styles.button} ${styles.solid}`}
            onClick={() => setOpened(true)}
          >
            Buka Undangan
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
