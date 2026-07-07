"use client";

import styles from "./style.module.css";

type Props = {
  invitation: any;
};

export default function Gallery({ invitation }: Props) {
  const photos = [
    invitation?.gallery1,
    invitation?.gallery2,
    invitation?.gallery3,
    invitation?.gallery4,
    invitation?.gallery5,
    invitation?.gallery6,
  ];

  return (
    <section className={styles.section}>
      <p className={styles.sectionLabel}>
        Our Moments
      </p>

      <h2 className={styles.sectionTitle}>
        Gallery
      </h2>

      <div className={styles.galleryGrid}>
        {photos.map((photo, index) => (
          <div
            key={index}
            className={styles.galleryItem}
          >
            <img
              src={
                photo ||
                `/images/themes/luxury-gold/gallery-${(index % 6) + 1}.jpg`
              }
              alt=""
            />
          </div>
        ))}
      </div>
    </section>
  );
}