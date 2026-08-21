"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import CycladicArch from "./CycladicArch";
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
      {invitation.coverImage && (
        <motion.img
          className={styles.coverImage}
          src={invitation.coverImage}
          alt=""
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      <div className={styles.coverOverlay} />

      <motion.div
        className={styles.coverHeader}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.35, ease: "easeOut" }}
      >
        <CycladicArch className={styles.coverCrown} />

        <div className={styles.coverHeaderCard}>
          <p className={styles.coverTop}>The Wedding Of</p>

          <h1 className={styles.coverTitle}>
            {(invitation.groom.nickname || invitation.groom.name)}
            <span>&amp;</span>
            {(invitation.bride.nickname || invitation.bride.name)}
          </h1>

          {invitation.events[0]?.date && (
            <p className={styles.coverDate}>{invitation.events[0].date}</p>
          )}
        </div>
      </motion.div>

      <motion.div
        className={styles.coverContent}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
      >
        <div className={styles.line} />

        <p className={styles.guestLabel}>Kepada Yth.</p>
        <h2 className={styles.guestName}>{guestName}</h2>

        <button
          className={`${styles.button} ${styles.solid}`}
          onClick={() => setOpened(true)}
        >
          Buka Undangan
        </button>
      </motion.div>
    </motion.section>
  );
}
