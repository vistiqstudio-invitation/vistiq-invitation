"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Gallery({ invitation }: { invitation: InvitationData }) {
  const photos = invitation.gallery.slice(0, 10);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const showPrevious = () => {
    setSelectedIndex((current) => (current - 1 + photos.length) % photos.length);
  };

  const showNext = () => {
    setSelectedIndex((current) => (current + 1) % photos.length);
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Our Moments</p>
        <h2 className={styles.title}>Gallery</h2>
        <div className={styles.ornament}><span className={styles.ornamentMark} /></div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.gallerySlider}>
          <div className={styles.galleryShowcase}>
            <button
              className={styles.galleryMain}
              type="button"
              onClick={() => setActiveIndex(selectedIndex)}
              aria-label={`Buka foto ${selectedIndex + 1}`}
            >
              <img src={photos[selectedIndex]} alt="Momen pasangan" />
              <span className={styles.galleryCounter}>
                {String(selectedIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
              </span>
            </button>

            {photos.length > 1 && (
              <div className={styles.galleryArrows}>
                <button type="button" onClick={showPrevious} aria-label="Foto sebelumnya">‹</button>
                <button type="button" onClick={showNext} aria-label="Foto berikutnya">›</button>
              </div>
            )}
          </div>

          <div
            className={styles.galleryThumbs}
            role="tablist"
            aria-label="Pilih foto galeri"
            style={{ gridTemplateColumns: `repeat(${Math.min(photos.length, 5)}, minmax(0, 1fr))` }}
          >
            {photos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                role="tab"
                aria-selected={selectedIndex === index}
                className={`${styles.galleryThumb} ${selectedIndex === index ? styles.galleryThumbActive : ""}`}
                onClick={() => setSelectedIndex(index)}
              >
                <img src={photo} alt={`Momen ${index + 1}`} loading="lazy" />
              </button>
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
              initial={{ scale: 0.92, opacity: 0 }}
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
