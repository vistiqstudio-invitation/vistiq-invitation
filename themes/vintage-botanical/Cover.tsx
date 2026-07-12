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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className={styles.coverFrame}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {invitation.coverImage && (
          <img className={styles.coverImage} src={invitation.coverImage} alt="" />
        )}

        <div className={styles.coverOverlay} />

        <div className={styles.coverHeader}>
          <p className={styles.coverTop}>The Wedding Of</p>

          <h1 className={styles.coverTitle}>
            {invitation.groom.name}
            <span>&amp;</span>
            {invitation.bride.name}
          </h1>

          {invitation.events[0]?.date && (
            <p className={styles.coverDate}>{invitation.events[0].date}</p>
          )}
        </div>

        <div className={styles.coverContent}>
          <div className={styles.line} />

          <p className={styles.guestLabel}>Kepada Yth.</p>
          <h2 className={styles.guestName}>{guestName}</h2>

          <button className={styles.coverButton} onClick={() => setOpened(true)}>
            Buka Undangan
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
