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
      transition={{ duration: 0.6 }}
    >
      <div className={styles.coverPhotoWrap}>
        {invitation.coverImage && (
          <motion.img
            className={styles.coverImage}
            src={invitation.coverImage}
            alt=""
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}
      </div>

      <motion.div
        className={styles.coverBlock}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <p className={styles.coverTop}>The Wedding Of</p>

        <h1 className={styles.coverTitle}>
          {invitation.groom.name}
          <span>&amp;</span>
          {invitation.bride.name}
        </h1>

        {invitation.events[0]?.date && (
          <p className={styles.coverDate}>{invitation.events[0].date}</p>
        )}

        <div className={styles.coverGuest}>
          Kepada Yth. <strong>{guestName}</strong>
        </div>

        <div>
          <button className={styles.button} onClick={() => setOpened(true)}>
            Buka Undangan
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
