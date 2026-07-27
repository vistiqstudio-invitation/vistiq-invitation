"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./style.module.css";

type AccentProps = {
  className?: string;
  mirrored?: boolean;
};

export function SpaceCorner({ className, mirrored = false }: AccentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ transform: mirrored ? "scaleX(-1)" : undefined }}
    >
      <path d="M4 4H60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 4V60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 84V96" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <path d="M84 4H96" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <circle cx="30" cy="30" r="2.4" fill="currentColor" />
      <g className={styles.cornerOrbit}>
        <circle cx="120" cy="70" r="34" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="120" cy="70" r="3.4" fill="currentColor" />
        <circle cx="154" cy="70" r="2.4" fill="currentColor" />
      </g>
      <g className={styles.cornerStars}>
        <path d="M150 24l2.4 6.4 6.4 2.4-6.4 2.4-2.4 6.4-2.4-6.4-6.4-2.4 6.4-2.4z" fill="currentColor" />
        <path d="M172 50l1.6 4.2 4.2 1.6-4.2 1.6-1.6 4.2-1.6-4.2-4.2-1.6 4.2-1.6z" fill="currentColor" />
        <path d="M60 130l1.6 4.2 4.2 1.6-4.2 1.6-1.6 4.2-1.6-4.2-4.2-1.6 4.2-1.6z" fill="currentColor" />
      </g>
    </svg>
  );
}

export function SpaceDivider({ className }: { className?: string }) {
  return (
    <div className={`${styles.spaceDivider} ${className || ""}`} aria-hidden="true">
      <span className={styles.dividerLine} />
      <span className={styles.dividerDiamond} />
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 5c5 4 7 9 7 15-2 1-4 2-7 2s-5-1-7-2c0-6 2-11 7-15Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="20" cy="18" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M14 24l-4 8M26 24l4 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className={styles.dividerDiamond} />
      <span className={styles.dividerLine} />
    </div>
  );
}

const stars = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  left: 2 + ((index * 13) % 96),
  top: 3 + ((index * 23) % 94),
  size: 2 + (index % 3) * 1.6,
  duration: 2.4 + (index % 5) * 0.6,
  delay: (index % 7) * 0.5,
}));

export function FloatingStars() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.starField} aria-hidden="true">
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className={styles.floatingStar}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
          }}
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.15, 1, 0.15], scale: [1, 1.3, 1] }
          }
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
