"use client";

import { useRef, useState } from "react";

export default function MusicPlayer({ url }: { url?: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!url) return null;

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="none" />

      <button
        onClick={toggleMusic}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 999,
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "none",
          background: "#c9a86a",
          color: "white",
          fontSize: 22,
          cursor: "pointer",
        }}
      >
        {isPlaying ? "⏸" : "♪"}
      </button>
    </>
  );
}