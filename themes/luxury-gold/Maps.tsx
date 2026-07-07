"use client";

import styles from "./style.module.css";

type Props = {
  invitation: any;
};

export default function Maps({ invitation }: Props) {
  return (
    <section className={styles.section}>

      <p className={styles.sectionLabel}>
        Location
      </p>

      <h2 className={styles.sectionTitle}>
        Wedding Venue
      </h2>

      <div className={styles.mapBox}>
        <iframe
          src={
            invitation?.maps_url ||
            "https://www.google.com/maps?q=Jakarta&output=embed"
          }
          loading="lazy"
          allowFullScreen
        />
      </div>

      <a
        className={styles.button}
        href={invitation?.google_maps || "#"}
        target="_blank"
      >
        Buka Google Maps
      </a>

    </section>
  );
}