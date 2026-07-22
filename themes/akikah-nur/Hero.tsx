"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Hero({ invitation }: { invitation: AqiqahInvitationData }) {
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
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang
            Bapak/Ibu/Saudara/i untuk turut mendoakan dan menghadiri acara
            aqiqah putra/putri kami, {invitation.baby.name}.
          </h2>
        )}
      </Reveal>

      <Reveal delay={0.15}>
        <p className={styles.heroVerse}>
          {opening?.quote ||
            `"Harta dan anak-anak adalah perhiasan kehidupan dunia, tetapi amal kebajikan yang terus-menerus adalah lebih baik pahalanya di sisi Tuhanmu."`}
        </p>

        <span className={styles.heroVerseSource}>{opening?.quoteSource || "QS. Al-Kahf : 46"}</span>
      </Reveal>
    </div>
  );
}
