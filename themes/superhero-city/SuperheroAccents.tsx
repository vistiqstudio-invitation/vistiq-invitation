"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./style.module.css";

type AccentProps = {
  className?: string;
  mirrored?: boolean;
};

export function SpeedLines({ className, mirrored = false }: AccentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ transform: mirrored ? "scaleX(-1)" : undefined }}
    >
      <g className={styles.speedLine} strokeLinecap="round">
        <path d="M4 4L70 4" strokeWidth="6" />
        <path d="M4 24L54 24" strokeWidth="6" />
        <path d="M4 44L40 44" strokeWidth="6" />
        <path d="M4 64L28 64" strokeWidth="5" />
        <path d="M4 4L4 70" strokeWidth="6" />
        <path d="M24 4L24 54" strokeWidth="6" />
        <path d="M44 4L44 40" strokeWidth="6" />
        <path d="M64 4L64 28" strokeWidth="5" />
      </g>
      <g className={styles.speedStar} transform="translate(46 46)">
        <path d="M0 -16L4 -4L16 0L4 4L0 16L-4 4L-16 0L-4 -4Z" />
      </g>
    </svg>
  );
}

export function ComicDivider({ className }: { className?: string }) {
  return (
    <div className={`${styles.comicDivider} ${className || ""}`} aria-hidden="true">
      <span className={styles.dividerLine} />
      <svg viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22 2L8 18H18L14 32L32 14H20L22 2Z"
          fill="currentColor"
          stroke="var(--hero-ink)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.dividerLine} />
    </div>
  );
}

const sparks = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: 4 + ((index * 23) % 92),
  top: 3 + ((index * 37) % 94),
  size: 8 + (index % 4) * 5,
  duration: 7 + (index % 5) * 1.4,
  delay: (index % 6) * 0.7,
  rotate: (index % 2 === 0 ? 1 : -1) * (30 + index * 11),
}));

export function FloatingSparks() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.sparkField} aria-hidden="true">
      {sparks.map((spark) => (
        <motion.svg
          key={spark.id}
          className={styles.floatingSpark}
          style={{ left: `${spark.left}%`, top: `${spark.top}%`, width: spark.size, height: spark.size }}
          viewBox="0 0 24 24"
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -14, 0], rotate: [0, spark.rotate, 0], opacity: [0.2, 0.7, 0.2] }
          }
          transition={{ duration: spark.duration, delay: spark.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5Z" fill="currentColor" />
        </motion.svg>
      ))}
    </div>
  );
}
