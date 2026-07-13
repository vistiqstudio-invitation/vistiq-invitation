"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import JogloSilhouette from "./JogloSilhouette";
import BananaLeaf from "./BananaLeaf";
import styles from "./style.module.css";

export default function Hero({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.hero}>
      <Reveal>
        <p className={styles.heroLabel}>Assalamu'alaikum Warahmatullahi Wabarakatuh</p>

        <h2 className={styles.heroTitle}>
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
          menyelenggarakan pernikahan putra-putri kami,{" "}
          {invitation.groom.name} &amp; {invitation.bride.name}.
        </h2>

        <p className={styles.heroDesc}>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.heroStage}>
          <BananaLeaf className={styles.heroLeaf} />
          <JogloSilhouette className={styles.heroJoglo} />
          <BananaLeaf className={styles.heroLeafRight} />
        </div>
      </Reveal>

      <Reveal delay={0.25}>
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
