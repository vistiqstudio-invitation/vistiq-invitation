import Image from "next/image";
import styles from "./BotanicalRomanceCatalogCover.module.css";

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

/**
 * Static, high-resolution rendition of the live Botanical Romance opening cover.
 * It reuses the same source photo and bouquet asset as the invitation itself,
 * so the catalog never has to enlarge a low-resolution screenshot.
 */
export default function BotanicalRomanceCatalogCover() {
  return (
    <div className={styles.cover}>
      <Image
        src="/photos/luxury-art-love-paradise/couple-cover.webp"
        alt="Aurelia & Damar — Botanical Romance"
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1040px) 33vw, 260px"
        quality={100}
        className={styles.background}
      />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.frame} aria-hidden="true" />

      <Image
        src="/themes/3d-motion/bouquet.webp"
        alt=""
        fill
        sizes="260px"
        className={`${styles.floral} ${styles.floralLeft}`}
        aria-hidden="true"
      />
      <Image
        src="/themes/3d-motion/bouquet.webp"
        alt=""
        fill
        sizes="260px"
        className={`${styles.floral} ${styles.floralRight}`}
        aria-hidden="true"
      />

      <div className={styles.title}>
        <p>The Wedding of</p>
        <h3>
          <em>Aurelia</em>
          <span>&amp;</span>
          <em>Damar</em>
        </h3>
        <small>SABTU, 24 OKTOBER 2026</small>
      </div>

      <div className={styles.monogram} aria-hidden="true">
        <span>A</span>
        <i>&amp;</i>
        <span>D</span>
      </div>

      <div className={styles.guest}>
        <p>
          <span>Kepada Yth.</span>
          <strong>Bapak/Ibu/Saudara/i</strong>
        </p>
        <div className={styles.button}>
          <EnvelopeIcon />
          <b>Buka Undangan</b>
        </div>
      </div>
    </div>
  );
}
