"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import Cloud from "./Cloud";
import HangingLanterns from "./HangingLanterns";
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
      transition={{ duration: 0.8 }}
    >
      {invitation.coverImage && (
        <motion.img
          className={styles.coverImage}
          src={invitation.coverImage}
          alt=""
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
        />
      )}

      <div className={styles.coverOverlay} />

      <div className={styles.cloudLayer}>
        <Cloud className={`${styles.cloud} ${styles.cloudTop}`} />
        <Cloud className={`${styles.cloud} ${styles.cloudBottom}`} />
      </div>

      <HangingLanterns />

      <motion.div
        className={styles.coverContent}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        <p className={styles.coverTop}>The Wedding Of</p>

        <h1 className={styles.coverTitle}>
          {invitation.groom.name}
          <span>&</span>
          {invitation.bride.name}
        </h1>

        {invitation.events[0]?.date && (
          <p className={styles.coverDate}>{invitation.events[0].date}</p>
        )}

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
