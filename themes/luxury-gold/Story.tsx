"use client";

import styles from "./style.module.css";

type Props = {
  invitation: any;
};

export default function Story({ invitation }: Props) {
  return (
    <section className={styles.story}>
      <div className={styles.container}>

        <p className={styles.sectionLabel}>
          Our Journey
        </p>

        <h2 className={styles.sectionTitle}>
          Love Story
        </h2>

        <div className={styles.storyTimeline}>

          <div className={styles.storyItem}>
            <div className={styles.storyYear}>2021</div>

            <div className={styles.storyContent}>
              <h3>Pertama Bertemu</h3>

              <p>
                Kami dipertemukan dalam sebuah kesempatan yang
                tidak pernah kami sangka sebelumnya.
                Dari perkenalan sederhana, tumbuh rasa nyaman
                yang perlahan menjadi kasih sayang.
              </p>
            </div>
          </div>

          <div className={styles.storyItem}>
            <div className={styles.storyYear}>2023</div>

            <div className={styles.storyContent}>
              <h3>Menjalin Hubungan</h3>

              <p>
                Setelah saling mengenal lebih dekat,
                kami memutuskan untuk berjalan bersama,
                saling mendukung dalam setiap langkah,
                dan tumbuh menjadi pribadi yang lebih baik.
              </p>
            </div>
          </div>

          <div className={styles.storyItem}>
            <div className={styles.storyYear}>2026</div>

            <div className={styles.storyContent}>
              <h3>Menuju Pernikahan</h3>

              <p>
                Dengan restu kedua orang tua serta ridho Allah SWT,
                kami memutuskan mengikat janji suci pernikahan
                sebagai awal perjalanan baru menuju keluarga
                yang sakinah, mawaddah, warahmah.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}