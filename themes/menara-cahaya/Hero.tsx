"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Hero({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.hero}>
      <Reveal>
        <p className={styles.heroLabel}>Assalamu'alaikum Warahmatullahi Wabarakatuh</p>

        <h2 className={styles.heroTitle}>
          Dengan mengharap rahmat dan ridho Allah SWT, kami mengundang
          Bapak/Ibu/Saudara/i untuk hadir dan mendoakan pernikahan kami,{" "}
          {invitation.groom.name} &amp; {invitation.bride.name}.
        </h2>

        <p className={styles.heroDesc}>
          Semoga di bawah naungan cahaya-Nya, langkah kami menuju
          keluarga yang sakinah, mawaddah, wa rahmah senantiasa
          diberkahi doa restu Bapak/Ibu/Saudara/i.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
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
