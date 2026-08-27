import Image from "next/image";
import styles from "./ThemeCoverPreview.module.css";

type Props = {
  coverImage?: string | null;
  label: string;
  swatch?: [string, string];
};

/** A motion-free screenshot-like preview of the theme's complete invitation opening screen. */
export default function ThemeCoverPreview({ coverImage, label, swatch }: Props) {
  const isChampagneRomance = label.toLowerCase().includes("champagne romance");

  return (
    <div
      className={styles.cover}
      style={
        coverImage
          ? undefined
          : {
              background: swatch
                ? `linear-gradient(155deg, ${swatch[0]}, ${swatch[1]})`
                : "#e8eef5",
            }
      }
    >
      {coverImage ? (
        <Image
          src={coverImage}
          alt={`Tampilan pembuka undangan tema ${label}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1040px) 33vw, 260px"
          className={`${styles.image} ${isChampagneRomance ? styles.champagneImage : ""}`}
        />
      ) : (
        <span className={styles.fallbackLabel}>{label}</span>
      )}

      {isChampagneRomance && coverImage ? (
        <div className={styles.champagneOverlay} aria-hidden="true">
          <div className={styles.champagneCopy}>
            <span className={styles.champagneArc}>THE WEDDING OF</span>
            <strong>Alya <i>&amp;</i> Raka</strong>
            <div className={styles.champagneGuest}>
              <span>Kepada Yth.</span>
              <b>Bpk/Ibu/Saudara/i</b>
              <span>di Tempat</span>
            </div>
            <span className={styles.champagneButton}>✉ &nbsp; Buka Undangan</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
