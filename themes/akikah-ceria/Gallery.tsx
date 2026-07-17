"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Gallery({ invitation }: { invitation: AqiqahInvitationData }) {
  const photos = invitation.gallery.slice(0, 10);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  if (photos.length === 0) return null;

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Momen Bahagia</p>
        <h2 className={styles.title}>Galeri</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.galleryStrip}>
          {photos.map((photo, i) => (
            <div className={styles.galleryItem} key={photo} onClick={() => setActiveIndex(i)}>
              <span className={styles.galleryTape} />
              <img src={photo} alt="" />
            </div>
          ))}
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
            <button className={styles.lightboxClose} onClick={() => setActiveIndex(null)} aria-label="Tutup">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
