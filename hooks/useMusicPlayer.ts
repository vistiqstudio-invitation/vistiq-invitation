"use client";

import { useEffect, useRef, useState } from "react";

export function useMusicPlayer(url: string | null | undefined, autoPlay = true) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!url || !autoPlay || hasInteracted) return;

    const tryPlay = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch {
        // Autoplay blocked until the user interacts with the page - the
        // floating button lets them start playback manually.
      }
    };

    tryPlay();
  }, [url, autoPlay, hasInteracted]);

  const toggle = async () => {
    setHasInteracted(true);

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return { audioRef, isPlaying, toggle };
}
