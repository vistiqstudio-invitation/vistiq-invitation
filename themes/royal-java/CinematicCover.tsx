"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function CinematicCover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";
  const coverPhoto = invitation.coverImage || invitation.groom.photo || invitation.bride.photo;
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (finishTimer.current) clearTimeout(finishTimer.current);
  }, []);

  const openInvitation = () => {
    setPlaying(true);
    requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => undefined);
    });
    finishTimer.current = setTimeout(() => setOpened(true), 11200);
  };

  const finishOpening = () => {
    if (finishTimer.current) clearTimeout(finishTimer.current);
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
      <AnimatePresence mode="wait">
        {!playing ? (
          <motion.div
            key="cover"
            className={styles.coverScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 1 }}
          >
            <div className={styles.coverBackdrop} />
            <div className={styles.paperWash} />

            <motion.div
              className={styles.photoCard}
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.25 }}
            >
              {coverPhoto && <img src={coverPhoto} alt={`${invitation.groom.name} dan ${invitation.bride.name}`} />}
              <p>The Wedding Of</p>
              <h1>{invitation.groom.name} <em>&amp;</em> {invitation.bride.name}</h1>
            </motion.div>

            <motion.div
              className={styles.invitee}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85 }}
            >
              <p>Kepada Bapak/Ibu/Saudara/i</p>
              <h2>{guestName}</h2>
              <span>Di Tempat</span>
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
        ) : (
          <motion.div
            key="opening"
            className={styles.videoScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <video
              ref={videoRef}
              className={styles.openingVideo}
              src="/video/royal-java-opening-v2.mp4"
              muted
              playsInline
              preload="auto"
              onEnded={finishOpening}
            />
            <div className={styles.videoShade} />
            <motion.div
              className={styles.cinematicTitle}
              initial={{ opacity: 0, scale: 0.84 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.84, 1, 1.04, 1.1] }}
              transition={{ duration: 10.4, times: [0, 0.18, 0.78, 1] }}
            >
              {coverPhoto && <img src={coverPhoto} alt="" />}
              <p>The Royal Wedding Of</p>
              <h2>{invitation.groom.name}</h2>
              <i>&amp;</i>
              <h2>{invitation.bride.name}</h2>
            </motion.div>
            <div className={styles.petals} aria-hidden="true">
              {Array.from({ length: 16 }).map((_, index) => <i key={index} />)}
            </div>
            <button className={styles.skipButton} type="button" onClick={finishOpening}>Lewati</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
