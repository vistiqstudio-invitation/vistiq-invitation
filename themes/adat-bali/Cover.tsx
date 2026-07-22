"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import CandiBentar from "./CandiBentar";
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
        className={styles.coverGlow}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.2, delay: 0.3 }}
      />

      <div className={styles.coverStage}>
        <div className={styles.gateRow}>
          <motion.div
            className={`${styles.gateHalf} ${styles.gateLeft}`}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: "-8%", opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <CandiBentar />
          </motion.div>

          <motion.div
            className={`${styles.gateHalf} ${styles.gateRight}`}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: "8%", opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <CandiBentar />
          </motion.div>

          {invitation.coverImage ? (
            <motion.div
              className={styles.coverPhoto}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={invitation.coverImage} alt="" />
            </motion.div>
          ) : (
            <div className={styles.coverPhotoFallback} />
          )}
        </div>

        <motion.div
          className={styles.coverContent}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
        >
          <p className={styles.coverTop}>Pawiwahan</p>

          <h1 className={styles.coverTitle}>
            {invitation.groom.name}
            <span>lan</span>
            {invitation.bride.name}
          </h1>

          {invitation.events[0]?.date && (
            <p className={styles.coverDate}>{invitation.events[0].date}</p>
          )}

          <div className={styles.guestBlock}>
            <div className={styles.line} />
            <p className={styles.guestLabel}>Kepada Yth.</p>
            <h2 className={styles.guestName}>{guestName}</h2>

            <button
              className={`${styles.button} ${styles.solid}`}
              onClick={() => setOpened(true)}
            >
              Buka Undangan
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
