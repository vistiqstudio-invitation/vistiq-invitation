"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import JogloSilhouette from "./JogloSilhouette";
import BananaLeaf from "./BananaLeaf";
import Countdown from "./Countdown";
import styles from "./style.module.css";

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

export default function Hero({ invitation }: { invitation: InvitationData }) {
  const weddingDate = invitation.events[0]?.rawDate || null;

  return (
    <div className={styles.hero}>
      <img
        className={styles.heroCornerTL}
        src="/decor/jawa-merah/corner-foliage.png"
        alt=""
        onError={hideOnError}
      />
      <img
        className={styles.heroCornerTR}
        src="/decor/jawa-merah/corner-foliage.png"
        alt=""
        onError={hideOnError}
      />

      <Reveal>
        <p className={styles.heroVerse}>
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
          untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapat
          ketenangan hati padanya, dan dijadikan-Nya di antaramu rasa kasih
          dan sayang."
        </p>

        <span className={styles.heroVerseSource}>QS. Ar-Rum : 21</span>
      </Reveal>

      {weddingDate && (
        <Reveal delay={0.1}>
          <Countdown invitation={invitation} targetDate={weddingDate} embedded />
        </Reveal>
      )}

      <Reveal delay={0.2}>
        <div className={styles.heroStage}>
          <BananaLeaf className={styles.heroLeaf} />
          <JogloSilhouette className={styles.heroJoglo} />
          <BananaLeaf className={styles.heroLeafRight} />

          <img
            className={styles.heroButterfly}
            src="/decor/jawa-merah/butterfly.png"
            alt=""
            onError={hideOnError}
          />

          <img
            className={styles.heroSpray}
            src="/decor/jawa-merah/floral-spray.png"
            alt=""
            onError={hideOnError}
          />
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <p className={styles.heroDesc}>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
          kepada {invitation.groom.name} &amp; {invitation.bride.name}.
        </p>
      </Reveal>
    </div>
  );
}
