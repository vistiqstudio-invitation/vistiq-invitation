"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { AqiqahInvitationData } from "@/types/aqiqah";
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
      <img className={styles.coverCornerTL} src="/photos/akikah-zaitun-floral-a.png" alt="" aria-hidden="true" />
      <img className={styles.coverCornerBL} src="/photos/akikah-zaitun-floral-a.png" alt="" aria-hidden="true" />
      <img className={styles.coverCornerBR} src="/photos/akikah-zaitun-floral-a.png" alt="" aria-hidden="true" />

      <motion.h1
        className={styles.coverTitle}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15 }}
      >
        Walimatul Aqiqah
      </motion.h1>

      <motion.p
        className={styles.coverName}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {invitation.baby.name}
      </motion.p>

      {invitation.baby.photo && (
        <motion.div
          className={styles.coverPhoto}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
        >
          <img src={invitation.baby.photo} alt={invitation.baby.name} />
        </motion.div>
      )}

      <motion.div
        className={styles.coverFoot}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
      >
        <div className={styles.coverLine} />

        <p className={styles.guestLabel}>Kepada Yth.</p>
        <h2 className={styles.guestName}>{guestName}</h2>

        <button className={`${styles.button} ${styles.solid}`} onClick={() => setOpened(true)}>
          Buka Undangan
        </button>
      </motion.div>
    </motion.section>
  );
}
