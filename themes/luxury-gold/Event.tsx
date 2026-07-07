"use client";

import styles from "./style.module.css";

type Props = {
  invitation: any;
};

export default function Event({ invitation }: Props) {
  return (
    <section className={styles.section}>

      <p className={styles.sectionLabel}>
        Wedding Event
      </p>

      <h2 className={styles.sectionTitle}>
        Save The Date
      </h2>

      <div className={styles.eventGrid}>

        <div className={styles.eventCard}>

          <h3>Akad Nikah</h3>

          <div className={styles.eventLine}></div>

          <p className={styles.eventDate}>
            {invitation?.akad_date || "Minggu, 20 September 2026"}
          </p>

          <p>
            Pukul
            <br />
            <strong>
              {invitation?.akad_time || "08.00 WIB"}
            </strong>
          </p>

          <p>
            {invitation?.akad_location || "Gedung Serbaguna Vistiq"}
          </p>

        </div>

        <div className={styles.eventCard}>

          <h3>Resepsi</h3>

          <div className={styles.eventLine}></div>

          <p className={styles.eventDate}>
            {invitation?.reception_date || "Minggu, 20 September 2026"}
          </p>

          <p>
            Pukul
            <br />
            <strong>
              {invitation?.reception_time || "11.00 WIB"}
            </strong>
          </p>

          <p>
            {invitation?.reception_location || "Gedung Serbaguna Vistiq"}
          </p>

        </div>

      </div>

    </section>
  );
}