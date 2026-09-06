"use client";

import { motion } from "framer-motion";
import type { InvitationData } from "@/types/invitation";
import BotanicalSprig from "./BotanicalSprig";
import styles from "./style.module.css";

export default function OpeningIntro({ invitation }: { invitation: InvitationData }) {
  const groomName = invitation.groom.nickname || invitation.groom.name;
  const brideName = invitation.bride.nickname || invitation.bride.name;

  return (
    <motion.section
      id="home"
      className={styles.openingIntro}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {invitation.coverImage && (
        <motion.img
          className={styles.openingImage}
          src={invitation.coverImage}
          alt=""
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
      )}

      <div className={styles.openingFade} />

      <BotanicalSprig className={`${styles.openingSprig} ${styles.openingSprigLeft}`} />
      <BotanicalSprig className={`${styles.openingSprig} ${styles.openingSprigRight}`} />

      <motion.div
        className={styles.openingCopy}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
      >
        <p className={styles.openingLabel}>The Wedding Of</p>
        <h1 className={styles.openingNames}>
          {groomName}
          <span>&amp;</span>
          {brideName}
        </h1>

        {invitation.events[0]?.date && (
          <p className={styles.openingDate}>{invitation.events[0].date}</p>
        )}
      </motion.div>
    </motion.section>
  );
}
