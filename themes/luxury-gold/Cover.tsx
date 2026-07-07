"use client";

import { useInvitation } from "@/components/InvitationProvider";
import styles from "./style.module.css";

type Props = {
  invitation: any;
};

export default function Cover({ invitation }: Props) {
  const { setOpened } = useInvitation();

  return (
    <section className={styles.cover}>
      <img
        className={styles.coverImage}
        src={
          invitation?.cover_image ||
          "/images/themes/luxury-gold/default-cover.jpg"
        }
        alt="Cover"
      />

      <div className={styles.coverContent}>
        <p className={styles.coverTop}>
          THE WEDDING OF
        </p>

        <h1 className={styles.coverTitle}>
          {invitation?.groom_name || "Rizky"}
          <span> & </span>
          {invitation?.bride_name || "Nabila"}
        </h1>

        <p className={styles.coverDate}>
          {invitation?.wedding_date || "20 September 2026"}
        </p>

        <div className={styles.line}></div>

        <p className={styles.guestLabel}>
          Kepada Yth.
        </p>

        <h2 className={styles.guestName}>
          {invitation?.guest_name ||
            "Bapak / Ibu / Saudara/i"}
        </h2>

        <button
          className={styles.openButton}
          onClick={() => {
  console.log("TOMBOL DIKLIK");
  setOpened(true);
}}
        >
          Buka Undangan
        </button>
      </div>
    </section>
  );
}