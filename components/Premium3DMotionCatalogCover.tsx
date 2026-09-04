import styles from "./Premium3DMotionCatalogCover.module.css";

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

export default function Premium3DMotionCatalogCover() {
  return (
    <div className={styles.cover}>
      <div className={styles.coverBackground} aria-hidden="true" />
      <div className={styles.coverShade} aria-hidden="true" />
      <div className={styles.coverGardenOverlay} aria-hidden="true" />
      <div className={styles.coverFloral} aria-hidden="true" />

      <div className={styles.coverPortraitPair} aria-hidden="true">
        <div className={styles.coverPortraitFrame}>
          <div className={styles.coverPortrait} />
        </div>
      </div>

      <div className={styles.coverFrame} aria-hidden="true" />

      <div className={styles.coverStack}>
        <p className={styles.coverEyebrow}>The Wedding of</p>
        <h3>Nayla &amp; Farhan</h3>
        <div className={styles.coverGuest}>
          <p>
            <span>Kepada Yth:</span>
            <strong>Bapak/Ibu/Saudara/i</strong>
          </p>
          <div className={styles.button}>
            <EnvelopeIcon />
            <b>Buka Undangan</b>
          </div>
        </div>
      </div>

    </div>
  );
}
