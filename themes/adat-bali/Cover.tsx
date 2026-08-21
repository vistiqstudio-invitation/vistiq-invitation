"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useCountdown } from "@/hooks/useCountdown";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Cover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";

  const weddingDate = invitation.events[0]?.rawDate || null;
  const time = useCountdown(weddingDate);

  const items = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <motion.section
      className={styles.cover}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {invitation.coverImage ? (
        <motion.img
          className={styles.coverImage}
          src={invitation.coverImage}
          alt=""
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : (
        <div className={styles.coverFallback} />
      )}

      <div className={styles.coverOverlay} />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${styles.coverCorner} ${styles.coverCornerTL}`} src="/decor/adat-bali/corner-top-left.png" alt="" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${styles.coverCorner} ${styles.coverCornerTR}`} src="/decor/adat-bali/corner-top-right.png" alt="" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${styles.coverCorner} ${styles.coverCornerBL}`} src="/decor/adat-bali/corner-bottom-left.png" alt="" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${styles.coverCorner} ${styles.coverCornerBR}`} src="/decor/adat-bali/corner-bottom-right.png" alt="" aria-hidden="true" />

      <motion.div
        className={styles.coverContent}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      >
        <p className={styles.coverTop}>Pawiwahan</p>

        <h1 className={styles.coverTitle}>
          {(invitation.groom.nickname || invitation.groom.name)}
          <span>&amp;</span>
          {(invitation.bride.nickname || invitation.bride.name)}
        </h1>

        {invitation.events[0]?.date && (
          <p className={styles.coverDate}>{invitation.events[0].date}</p>
        )}

        {weddingDate && !time.isPast && (
          <>
            <p className={styles.coverCountdownLabel}>Hitung Mundur Acara</p>

            <div className={styles.coverCountdownRow}>
              {items.map((item, index) => (
                <Fragment key={item.label}>
                  {index > 0 && <span className={styles.coverCountdownDash}>·</span>}
                  <div className={styles.coverCountdownItem}>
                    <span className={styles.coverCountdownValue}>
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className={styles.coverCountdownUnit}>{item.label}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </>
        )}

        <p className={styles.guestLabel}>Kepada Yth.</p>
        <h2 className={styles.guestName}>{guestName}</h2>

        <button className={styles.button} onClick={() => setOpened(true)}>
          Buka Undangan
        </button>
      </motion.div>
    </motion.section>
  );
}
