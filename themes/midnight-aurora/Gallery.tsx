"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Gallery({ invitation }: { invitation: InvitationData }) {
  const photos = invitation.gallery.slice(0, 10);
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen]);

  if (photos.length === 0) return null;

  const prevPhoto = photos[(index - 1 + photos.length) % photos.length];
  const nextPhoto = photos[(index + 1) % photos.length];

  const goPrev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const goNext = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Our Moments</p>
        <h2 className={styles.title}>Gallery</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.carousel}>
          <button className={styles.carouselArrow} onClick={goPrev} aria-label="Sebelumnya">
            ‹
          </button>

          {photos.length > 1 && (
            <div className={styles.carouselPeek}>
              <img src={prevPhoto} alt="" />
            </div>
          )}

          <div className={styles.carouselStage} onClick={() => setLightboxOpen(true)}>
            <img src={photos[index]} alt="" />
          </div>

          {photos.length > 1 && (
            <div className={styles.carouselPeek}>
              <img src={nextPhoto} alt="" />
            </div>
          )}

          <button className={styles.carouselArrow} onClick={goNext} aria-label="Berikutnya">
            ›
          </button>
        </div>

        {photos.length > 1 && (
          <div className={styles.carouselNav}>
            {photos.map((photo, i) => (
              <button
                key={photo}
                className={`${styles.carouselDot} ${i === index ? styles.carouselDotActive : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        )}
      </Reveal>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className={styles.lightboxClose}
              onClick={() => setLightboxOpen(false)}
              aria-label="Tutup"
            >
              ✕
            </button>

            <motion.img
              className={styles.lightboxImage}
              src={photos[index]}
              alt=""
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
