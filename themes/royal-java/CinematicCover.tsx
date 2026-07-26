"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function CinematicCover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";
  const coverPhoto = invitation.coverImage || invitation.groom.photo || invitation.bride.photo;

  return (
    <motion.section
      className={styles.cinematic}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 1.1 }}
    >
      <div className={styles.skyGlow} />
      <div className={styles.batikVeil} />
      {coverPhoto && (
        <motion.div
          className={styles.portrait}
          style={{ backgroundImage: `url(${coverPhoto})` }}
          initial={{ scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ duration: 9, ease: "easeOut" }}
        />
      )}
      <div className={styles.pendopo}>
        <span className={styles.roofTop} />
        <span className={styles.roofLower} />
        <span className={styles.pillarLeft} />
        <span className={styles.pillarRight} />
      </div>
      <motion.img
        className={styles.foliageLeft}
        src="/decor/jawa-merah/corner-foliage.png"
        alt=""
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.3 }}
      />
      <motion.img
        className={styles.foliageRight}
        src="/decor/jawa-merah/corner-foliage.png"
        alt=""
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.3 }}
      />
      <img className={styles.flowerFloor} src="/decor/jawa-merah/floral-spray.png" alt="" />
      <div className={styles.sparkles} aria-hidden="true">
        {Array.from({ length: 14 }).map((_, index) => <i key={index} />)}
      </div>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1 }}
      >
        <p className={styles.eyebrow}>The Royal Wedding of</p>
        <h1>
          {invitation.groom.name}
          <span>&amp;</span>
          {invitation.bride.name}
        </h1>
        <div className={styles.goldRule} />
        <p className={styles.guestLabel}>Kepada Yth.</p>
        <h2>{guestName}</h2>
        <p className={styles.place}>di tempat</p>
        <motion.button
          type="button"
          onClick={() => setOpened(true)}
          whileTap={{ scale: 0.96 }}
          animate={{ boxShadow: ["0 0 0 rgba(220,181,92,0)", "0 0 28px rgba(220,181,92,.55)", "0 0 0 rgba(220,181,92,0)"] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          Buka Undangan
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
