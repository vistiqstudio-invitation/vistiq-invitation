"use client";

import styles from "./style.module.css";

type Props = {
  invitation: any;
};

export default function Hero({ invitation }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <p className={styles.sectionLabel}>
          Assalamu'alaikum Warahmatullahi Wabarakatuh
        </p>

        <h2 className={styles.heroTitle}>
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
          menyelenggarakan acara pernikahan putra-putri kami.
        </h2>

        <p className={styles.heroDesc}>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada
          kedua mempelai.
        </p>

        <div className={styles.heroDivider}></div>

        <p className={styles.heroVerse}>
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
          untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapat
          ketenangan hati padanya, dan dijadikan-Nya di antaramu rasa kasih
          sayang."
        </p>

        <span className={styles.heroVerseSource}>
          QS. Ar-Rum : 21
        </span>
      </div>
    </section>
  );
}