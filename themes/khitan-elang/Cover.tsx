"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";
import Eagle from "./Eagle";
import Monogram from "./Monogram";

export default function Cover({ invitation }: { invitation: KhitanInvitationData }) {
  const { setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";
  const nickname = invitation.child.name.trim().split(/\s+/).pop() || invitation.child.name;

  return (
    <motion.section
      className={styles.cover}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        <Eagle className={styles.coverEagle} />
      </motion.div>

      <motion.p
        className={styles.coverEyebrow}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.25 }}
      >
        Walimatul Khitan
      </motion.p>

      <motion.div
        className={styles.coverPhoto}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        <div className={styles.diamondFrameInner}>
          {invitation.child.photo ? (
            <img src={invitation.child.photo} alt={invitation.child.name} />
          ) : (
            <Monogram letter={nickname.charAt(0).toUpperCase()} />
          )}
        </div>
      </motion.div>

      <motion.h1
        className={styles.coverTitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.55 }}
      >
        {invitation.child.name}
      </motion.h1>

      {invitation.event?.date && (
        <motion.p
          className={styles.coverSub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.65 }}
        >
          {invitation.event.date}
        </motion.p>
      )}

      <motion.div
        className={styles.coverFoot}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
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
