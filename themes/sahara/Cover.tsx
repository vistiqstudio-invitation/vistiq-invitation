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
      <motion.p
        className={styles.coverTop}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      >
        The Wedding Of
      </motion.p>

      {invitation.coverImage && (
        <motion.div
          className={styles.coverFrame}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
        >
          <img src={invitation.coverImage} alt="" />
        </motion.div>
      )}

      <motion.h1
        className={styles.coverTitle}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.55, ease: "easeOut" }}
      >
        {invitation.groom.name.split(" ")[0]}
        <span>&amp;</span>
        {invitation.bride.name.split(" ")[0]}
      </motion.h1>

      {invitation.events[0]?.date && (
        <motion.p
          className={styles.coverDate}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          {invitation.events[0].date}
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
    </motion.section>
  );
}
