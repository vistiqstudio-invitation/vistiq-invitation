"use client";

import Reveal from "@/components/Reveal";
import styles from "./style.module.css";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <Reveal>
        <p className={styles.heroVerse}>
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
          untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapat
          ketenangan hati padanya, dan dijadikan-Nya di antaramu rasa kasih
          dan sayang."
        </p>

        <span className={styles.heroVerseSource}>QS. Ar-Rum : 21</span>
      </Reveal>
    </div>
  );
}
