"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function CinematicCover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";
  const weddingDate = invitation.events[0]?.date;

  const openInvitation = () => {
    setOpened(true);
  };

  return (
    <motion.section
      className={styles.cinematic}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.035 }}
      transition={{ duration: 0.9 }}
    >
      <motion.div
        className={styles.coverScene}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.7 }}
      >
            <Image
              src="/decor/royal-java-cover-v2.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 520px) 100vw, 520px"
              className={styles.coverArtwork}
            />
            <div className={styles.coverVeil} aria-hidden="true" />

            <motion.div className={styles.coverNames} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.2 }}>
              <p>The Royal Wedding Of</p>
              <h1><span>{(invitation.groom.nickname || invitation.groom.name)}</span><em>&amp;</em><span>{(invitation.bride.nickname || invitation.bride.name)}</span></h1>
              {weddingDate && <time>{weddingDate}</time>}
            </motion.div>

            <motion.div
              className={styles.invitee}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85 }}
            >
              <p>Kepada Yth.</p>
              <h2>{guestName}</h2>
              <span>di tempat</span>
              <motion.button
                type="button"
                onClick={openInvitation}
                whileTap={{ scale: 0.96 }}
                animate={{ boxShadow: ["0 5px 18px rgba(91,9,18,.2)", "0 5px 30px rgba(151,22,42,.5)", "0 5px 18px rgba(91,9,18,.2)"] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <span aria-hidden="true">✉</span> Buka Undangan
              </motion.button>
            </motion.div>
      </motion.div>
    </motion.section>
  );
}
