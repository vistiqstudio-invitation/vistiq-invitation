"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import SepiaOrnament from "./SepiaOrnament";
import styles from "./style.module.css";

export default function Cover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";

  return (
    <motion.section className={styles.cover} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }}>
      {invitation.coverImage && (
        <motion.img
          className={styles.sepiaCoverImage}
          src={invitation.coverImage}
          alt=""
          initial={{ scale: 1.18 }}
          animate={{ scale: 1.03 }}
          transition={{ duration: 12, ease: "easeOut" }}
        />
      )}
      <div className={styles.sepiaCoverShade} />
      <div className={styles.sepiaFrame}><i /><i /><i /><i /></div>

      <motion.div className={styles.sepiaCoverContent} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.45 }}>
        <p className={styles.sepiaKicker}>Pawiwahan</p>
        <SepiaOrnament className={styles.sepiaOrnament} />
        <p className={styles.coverEyebrow}>The Wedding Of</p>
        <h1 className={styles.sepiaNames}>
          <span>{invitation.groom.name}</span>
          <b>&amp;</b>
          <span>{invitation.bride.name}</span>
        </h1>
        {invitation.events[0]?.date && <p className={styles.sepiaDate}>{invitation.events[0].date}</p>}

        <motion.div className={styles.sepiaGuest} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}>
          <p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <strong>{guestName}</strong>
          <button className={styles.sepiaOpenButton} onClick={() => setOpened(true)}>
            <span>✦</span> Buka Undangan
          </button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
