"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./style.module.css";

type AccentProps = {
  className?: string;
  mirrored?: boolean;
};

export function DinoFootprints({ className, mirrored = false }: AccentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ transform: mirrored ? "scaleX(-1)" : undefined }}
    >
      <g className={styles.footprint} transform="translate(20 170) rotate(-18)">
        <ellipse cx="0" cy="0" rx="11" ry="15" />
        <ellipse cx="-13" cy="-16" rx="4" ry="6" transform="rotate(-20 -13 -16)" />
        <ellipse cx="0" cy="-20" rx="4" ry="6" />
        <ellipse cx="13" cy="-16" rx="4" ry="6" transform="rotate(20 13 -16)" />
      </g>
      <g className={styles.footprint} transform="translate(72 118) rotate(-10)">
        <ellipse cx="0" cy="0" rx="9" ry="12" />
        <ellipse cx="-10" cy="-13" rx="3.2" ry="5" transform="rotate(-20 -10 -13)" />
        <ellipse cx="0" cy="-16" rx="3.2" ry="5" />
        <ellipse cx="10" cy="-13" rx="3.2" ry="5" transform="rotate(20 10 -13)" />
      </g>
      <g className={styles.footprint} transform="translate(118 70) rotate(-4)">
        <ellipse cx="0" cy="0" rx="7.2" ry="9.6" />
        <ellipse cx="-8" cy="-10.4" rx="2.6" ry="4" transform="rotate(-20 -8 -10.4)" />
        <ellipse cx="0" cy="-13" rx="2.6" ry="4" />
        <ellipse cx="8" cy="-10.4" rx="2.6" ry="4" transform="rotate(20 8 -10.4)" />
      </g>
      <g className={styles.leafSprig} transform="translate(150 32)">
        <path d="M0 30C-6 16-4 4 8 -6C16 6 12 20 0 30Z" />
        <path d="M0 30C10 20 20 20 26 10C20 2 8 4 0 30Z" />
      </g>
    </svg>
  );
}

export function DinoDivider({ className }: { className?: string }) {
  return (
    <div className={`${styles.dinoDivider} ${className || ""}`} aria-hidden="true">
      <span className={styles.dividerLine} />
      <span className={styles.dividerLeaf} />
      <svg viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 34C4 20 10 10 18 6C22 12 20 18 16 22C24 20 30 12 30 4C38 8 42 18 38 28C34 36 22 38 14 34C10 32 6 34 4 34Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="30" cy="14" r="1.6" fill="currentColor" />
      </svg>
      <span className={styles.dividerLeaf} />
      <span className={styles.dividerLine} />
    </div>
  );
}

const leaves = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  left: 3 + ((index * 19) % 94),
  top: 2 + ((index * 31) % 92),
  size: 10 + (index % 4) * 4,
  duration: 9 + (index % 5) * 1.6,
  delay: (index % 6) * 0.8,
  rotate: (index % 2 === 0 ? 1 : -1) * (20 + index * 7),
}));

export function FloatingLeaves() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.leafField} aria-hidden="true">
      {leaves.map((leaf) => (
        <motion.svg
          key={leaf.id}
          className={styles.floatingLeaf}
          style={{ left: `${leaf.left}%`, top: `${leaf.top}%`, width: leaf.size, height: leaf.size }}
          viewBox="0 0 24 24"
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -12, 0], rotate: [0, leaf.rotate, 0], opacity: [0.25, 0.65, 0.25] }
          }
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 2C4 8 3 16 12 22C21 16 20 8 12 2Z" />
          <path d="M12 2V22" stroke="rgba(20,40,30,0.25)" strokeWidth="0.8" />
        </motion.svg>
      ))}
    </div>
  );
}
