"use client";

import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import styles from "./style.module.css";

export default function MusicPlayer({ url }: { url: string | null }) {
  const { audioRef, isPlaying, toggle } = useMusicPlayer(url);

  if (!url) return null;

  return (
    <>
      <audio ref={audioRef} src={url} loop />

      <button
        className={styles.musicButton}
        onClick={toggle}
        aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
      >
        <span className={isPlaying ? styles.spinning : ""}>
          {isPlaying ? "❚❚" : "♪"}
        </span>
      </button>
    </>
  );
}
