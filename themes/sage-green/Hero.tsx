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
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
            menyelenggarakan pernikahan putra-putri kami,{" "}
            {invitation.groom.name} &amp; {invitation.bride.name}.
          </h2>
        )}

        <p className={styles.heroDesc}>
          {opening?.description ||
            "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai."}
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <p className={styles.heroVerse}>
          {opening?.quote ||
            `"Cara Allah mempersatukan dua insan dalam satu pernikahan tak pernah bisa diduga oleh manusia. Allah membuat segala sesuatu indah pada waktu-Nya."`}
        </p>

        <span className={styles.heroVerseSource}>{opening?.quoteSource || "Kutipan"}</span>
      </Reveal>
    </div>
  );
}
