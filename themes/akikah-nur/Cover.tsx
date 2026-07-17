"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import MoonStar from "./MoonStar";
import CoverPattern from "./CoverPattern";
import styles from "./style.module.css";

export default function Cover({ invitation }: { invitation: AqiqahInvitationData }) {
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
      <CoverPattern />
      <div className={styles.coverGlow} aria-hidden="true" />

      <div className={styles.coverContent}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
        >
          <MoonStar className={styles.coverOrnament} />
        </motion.div>

        <motion.p
          className={styles.coverTop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Aqiqah &amp; Tasyakuran
        </motion.p>

        <motion.div
          className={styles.coverMedal}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
        >
          {invitation.baby.photo ? (
            <img src={invitation.baby.photo} alt={invitation.baby.name} />
          ) : (
            <div className={styles.coverMedalFallback}>
              <MoonStar className={styles.coverMedalIcon} />
            </div>
          )}
        </motion.div>

        <motion.h1
          className={styles.coverTitle}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          {invitation.baby.name}
        </motion.h1>

        {invitation.event?.date && (
          <motion.p
            className={styles.coverSub}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {invitation.event.date}
          </motion.p>
        )}

        <motion.div
          className={styles.coverFoot}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85, ease: "easeOut" }}
        >
          <div className={styles.coverLine} />

          <p className={styles.guestLabel}>Kepada Yth.</p>
          <h2 className={styles.guestName}>{guestName}</h2>

          <button className={`${styles.button} ${styles.solid}`} onClick={() => setOpened(true)}>
            Buka Undangan
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
