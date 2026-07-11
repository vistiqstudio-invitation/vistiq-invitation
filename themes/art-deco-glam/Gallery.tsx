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
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Our Moments</p>
        <h2 className={styles.title}>Gallery</h2>
        <div className={styles.ornament}>
          <span className={styles.ornamentDiamond} />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.honeycomb}>
          {photos.map((photo, index) => (
            <div
              key={photo}
              className={styles.honeyItem}
              onClick={() => setActiveIndex(index)}
            >
              <img src={photo} alt="" loading="lazy" />
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
