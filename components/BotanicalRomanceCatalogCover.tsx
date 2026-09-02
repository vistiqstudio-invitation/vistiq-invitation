import Image from "next/image";
import styles from "./BotanicalRomanceCatalogCover.module.css";

/** The catalog uses the same cover artwork shown at the start of the live invitation. */
export default function BotanicalRomanceCatalogCover() {
  return (
    <div className={styles.cover}>
      <Image
        src="/theme-previews/wedding/botanical-romance-cover.png"
        alt="Aurelia & Damar — Botanical Romance"
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1040px) 33vw, 260px"
        quality={95}
        className={styles.coverImage}
      />
    </div>
  );
}
