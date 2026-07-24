"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Hero({ invitation }: { invitation: InvitationData }) {
  const opening = invitation.opening;

  return (
    <div className={styles.hero}>
      <Reveal>
        <span className={styles.heroGreeting}>Wilujeng Sumping</span>

        <p className={styles.heroLabel}>{opening?.greeting || "Assalamu'alaikum Warahmatullahi Wabarakatuh"}</p>

        {opening?.title ? (
          <h2 className={styles.heroTitle}>{opening.title}</h2>
        ) : (
          <h2 className={styles.heroTitle}>
            Dengan penuh rasa syukur, kami bermaksud mengundang
            Bapak/Ibu/Saudara/i untuk berkenan hadir dan memberikan restu
            pada acara pernikahan kami,{" "}
            {invitation.groom.name} &amp; {invitation.bride.name}.
          </h2>
        )}

        <p className={styles.heroDesc}>
          {opening?.description ||
            "Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai."}
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <p className={styles.heroVerse}>
          {opening?.quote ||
            `"Cinta anu leres moal weléh, sanajan wates jeung waktu ngahalangan - cinta sejati tak akan pudar, meski jarak dan waktu merintangi."`}
        </p>

        <span className={styles.heroVerseSource}>
          {opening?.quoteSource || "Paribasa Sunda"}
        </span>
      </Reveal>
    </div>
  );
}
