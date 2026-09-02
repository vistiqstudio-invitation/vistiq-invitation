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
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.frame} aria-hidden="true" />

      <div className={styles.title}>
        <p>The Wedding of</p>
        <h3>Kirana <span>&amp;</span> Raka</h3>
        <small>SABTU, 24 OKTOBER 2026</small>
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
