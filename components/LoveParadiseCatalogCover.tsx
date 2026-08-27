import Image from "next/image";
import styles from "./LoveParadiseCatalogCover.module.css";

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

/** Motion-free catalog rendition of the real Luxury Art — Love Paradise cover. */
export default function LoveParadiseCatalogCover() {
  return (
    <div className={styles.cover}>
      <Image
        src="/photos/luxury-art-love-paradise/couple-cover.webp"
        alt="Salsa & Bagas — Luxury Art Love Paradise"
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1040px) 33vw, 260px"
        quality={92}
        className={styles.background}
      />
      <div className={styles.fade} />
      <div className={styles.garden} aria-hidden="true" />

      <div className={styles.title}>
        <p>The Wedding of</p>
        <h3>
          <em>Salsa</em>
          <span>&amp;</span>
          <em>Bagas</em>
        </h3>
      </div>

      <div className={styles.guest}>
        <p>
          <span>Kepada Yth.</span>
          <strong>Bapak/Ibu</strong>
        </p>
        <div className={styles.button}>
          <EnvelopeIcon />
          <b>Buka Undangan</b>
        </div>
      </div>
    </div>
  );
}
