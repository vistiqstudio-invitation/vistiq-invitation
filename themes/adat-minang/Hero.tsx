"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Hero({ invitation }: { invitation: InvitationData }) {
  const opening = invitation.opening;

  return (
    <div className={styles.hero}>
      <Reveal>
        <p className={styles.heroLabel}>
          {opening?.greeting || "Assalamu'alaikum Warahmatullahi Wabarakatuh"}
        </p>

        {opening?.title ? (
          <h2 className={styles.heroTitle}>{opening.title}</h2>
        ) : (
          <h2 className={styles.heroTitle}>
            Dengan mengharap rahmat dan ridho Allah SWT, kami mengundang
            Bapak/Ibu/Saudara/i untuk hadir pada baralek pernikahan kami,{" "}
            {invitation.groom.name} &amp; {invitation.bride.name}.
          </h2>
        )}

        <p className={styles.heroDesc}>
          {opening?.description ||
            "Adat basandi syarak, syarak basandi Kitabullah. Menjadi kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan memberikan doa restu di hari yang berbahagia ini."}
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <p className={styles.heroVerse}>
          {opening?.quote ||
            `"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapat ketenangan hati padanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."`}
        </p>

        <span className={styles.heroVerseSource}>{opening?.quoteSource || "QS. Ar-Rum : 21"}</span>
      </Reveal>
    </div>
  );
}
