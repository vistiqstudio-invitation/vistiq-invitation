import Image from "next/image";
import BotanicalRomanceCatalogCover from "./BotanicalRomanceCatalogCover";
import ChampagneRomanceCatalogCover from "./ChampagneRomanceCatalogCover";
import LoveParadiseCatalogCover from "./LoveParadiseCatalogCover";
import styles from "./ThemeCoverPreview.module.css";

type Props = {
  coverImage?: string | null;
  label: string;
  swatch?: [string, string];
  demoPath?: string;
  themeKey?: string;
};

/** A motion-free preview of the theme's complete invitation opening screen. */
export default function ThemeCoverPreview({
  coverImage,
  label,
  swatch,
  demoPath,
  themeKey,
}: Props) {
  const normalizedLabel = label.toLowerCase();
  const isBotanicalRomance =
    themeKey === "3d-motion" ||
    themeKey === "3d-montion-1" ||
    normalizedLabel.includes("botanical romance") ||
    normalizedLabel.includes("3d motion");
  const isChampagneRomance = normalizedLabel.includes("champagne romance");
  const isLoveParadise = normalizedLabel.includes("love paradise");
  const isLiveKhitanPreview = demoPath === "/demo-khitan" && Boolean(themeKey);
  const hasLiveCover = isBotanicalRomance || isChampagneRomance || isLoveParadise;

  return (
    <div
      className={`${styles.cover} ${isLiveKhitanPreview ? styles.liveKhitanCover : ""}`}
      style={
        coverImage || hasLiveCover
          ? undefined
          : {
              background: swatch
                ? `linear-gradient(155deg, ${swatch[0]}, ${swatch[1]})`
                : "#e8eef5",
            }
      }
    >
      {isLiveKhitanPreview ? (
        <iframe
          src={`${demoPath}/${themeKey}?preview=1`}
          title={`Preview cover tema ${label}`}
          className={styles.liveFrame}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          scrolling="no"
        />
      ) : isChampagneRomance ? (
        <ChampagneRomanceCatalogCover />
      ) : isLoveParadise ? (
        <LoveParadiseCatalogCover />
      ) : isBotanicalRomance ? (
        <BotanicalRomanceCatalogCover />
      ) : coverImage ? (
        <Image
          src={coverImage}
          alt={`Tampilan pembuka undangan tema ${label}`}
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
