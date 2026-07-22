"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Hero({ invitation }: { invitation: InvitationData }) {
  const opening = invitation.opening;

  return (
    <div className={styles.hero}>
      <Reveal>
        <span className={styles.heroBali} lang="ban">
          ᬒᬁᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ᭟
        </span>

        <p className={styles.heroLabel}>{opening?.greeting || "Om Swastyastu"}</p>

        {opening?.title ? (
          <h2 className={styles.heroTitle}>{opening.title}</h2>
        ) : (
          <h2 className={styles.heroTitle}>
            Atas asung kertha wara nugraha Ida Sang Hyang Widhi Wasa, kami
            bermaksud mengundang Bapak/Ibu/Saudara/i untuk berkenan hadir
            dan memberikan restu pada upacara pawiwahan kami,{" "}
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
            `"Bagaikan rwa bhineda yang selalu berdampingan dalam keseimbangan, semoga cinta kalian abadi membawa kebahagiaan sepanjang usia."`}
        </p>

        <span className={styles.heroVerseSource}>
          {opening?.quoteSource || "Pitutur Pawiwahan Bali"}
        </span>
      </Reveal>
    </div>
  );
}
