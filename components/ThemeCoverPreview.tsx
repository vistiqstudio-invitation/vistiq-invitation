import Image from "next/image";
import styles from "./ThemeCoverPreview.module.css";

type Props = {
  coverImage?: string | null;
  label: string;
  swatch?: [string, string];
};

/** A lightweight, motion-free cover used in theme catalog cards. */
export default function ThemeCoverPreview({ coverImage, label, swatch }: Props) {
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
          alt={`Cover tema ${label}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1040px) 33vw, 260px"
          className={styles.image}
        />
      ) : (
        <span className={styles.fallbackLabel}>{label}</span>
      )}
    </div>
  );
}
