"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Gallery({ invitation }: { invitation: InvitationData }) {
  const photos = invitation.gallery.slice(0, 10);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, photos.length]);

  if (photos.length === 0) return null;

  const track = [...photos, ...photos];

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Our Moments</p>
        <h2 className={styles.title}>Galeri</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.marqueeOuter}>
          <div className={styles.marqueeTrack}>
            {track.map((photo, i) => (
              <div
                className={styles.marqueeItem}
                key={`${photo}-${i}`}
                onClick={() => setActiveIndex(i % photos.length)}
              >
                <img src={photo} alt="" />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <button
              className={styles.lightboxClose}
              onClick={() => setActiveIndex(null)}
              aria-label="Tutup"
            >
              ✕
            </button>

            <motion.img
              className={styles.lightboxImage}
              src={photos[activeIndex]}
              alt=""
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />

            {photos.length > 1 && (
              <div className={styles.lightboxNav} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.lightboxArrow}
                  onClick={() => setActiveIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))}
                  aria-label="Sebelumnya"
                >
                  ‹
                </button>
                <button
                  className={styles.lightboxArrow}
                  onClick={() => setActiveIndex((i) => (i === null ? i : (i + 1) % photos.length))}
                  aria-label="Berikutnya"
                >
                  ›
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
