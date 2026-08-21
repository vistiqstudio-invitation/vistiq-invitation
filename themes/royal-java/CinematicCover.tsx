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
            <motion.div className={styles.paperScene} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.35 }} />
            <motion.div className={styles.canopyLayer} aria-hidden="true" initial={{ opacity: 0, y: -80, scale: 1.08 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.45, delay: .18, ease: [0.16, 1, 0.3, 1] }}><Image src="/decor/royal-java-layers/canopy.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" /></motion.div>
            <motion.div className={styles.janurLayer} aria-hidden="true" initial={{ opacity: 0, y: 70, scaleY: .6 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} transition={{ duration: 1.25, delay: .65, ease: [0.16, 1, 0.3, 1] }}><Image src="/decor/royal-java-layers/janur.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" /></motion.div>
            <motion.div className={styles.jogloLayer} aria-hidden="true" initial={{ opacity: 0, y: 145, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.55, delay: .38, ease: [0.16, 1, 0.3, 1] }}><Image src="/decor/royal-java-layers/joglo.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" /></motion.div>
            <motion.div className={styles.floralLayer} aria-hidden="true" initial={{ opacity: 0, y: 120 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, delay: .82, ease: [0.16, 1, 0.3, 1] }}><Image src="/decor/royal-java-layers/florals.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" /></motion.div>
            <motion.div className={styles.cloudReveal} aria-hidden="true" initial={{ opacity: .85, scale: .65, x: -70 }} animate={{ opacity: [0.85, .45, 0], scale: [0.65, 1.2, 1.55], x: [-70, 15, 90] }} transition={{ duration: 2.2, ease: "easeOut" }} />
            <div className={styles.coverVeil} aria-hidden="true" />

            <motion.div className={styles.coverNames} initial={{ opacity: 0, y: 26, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.15, delay: 0.65 }}>
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
