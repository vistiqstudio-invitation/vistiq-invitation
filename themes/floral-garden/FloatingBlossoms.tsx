"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./style.module.css";

type Blossom = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
};

function PetalShape() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g>
        <ellipse cx="12" cy="7" rx="4.5" ry="6" fill="#e8b4b8" opacity="0.85" />
        <ellipse cx="17" cy="12" rx="4.5" ry="6" fill="#e8b4b8" opacity="0.7" transform="rotate(72 17 12)" />
        <ellipse cx="15" cy="18" rx="4.5" ry="6" fill="#e8b4b8" opacity="0.7" transform="rotate(144 15 18)" />
        <ellipse cx="9" cy="18" rx="4.5" ry="6" fill="#e8b4b8" opacity="0.7" transform="rotate(216 9 18)" />
        <ellipse cx="7" cy="12" rx="4.5" ry="6" fill="#e8b4b8" opacity="0.7" transform="rotate(288 7 12)" />
        <circle cx="12" cy="13" r="2.4" fill="#c9a15a" />
      </g>
    </svg>
  );
}

export default function FloatingBlossoms() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const blossoms = useMemo<Blossom[]>(
    () =>
      Array.from({ length: 6 }, (_, id) => ({
        id,
        left: Math.round((id / 6) * 100 + (id % 2) * 5),
        size: 16 + (id % 3) * 6,
        duration: 20 + (id % 4) * 6,
        delay: id * 2.8,
        rotate: id % 2 === 0 ? 320 : -320,
      })),
    []
  );

  if (!mounted || prefersReducedMotion) return null;

  return (
    <div className={styles.blossomField} aria-hidden="true">
      {blossoms.map((b) => (
        <motion.span
          key={b.id}
          className={styles.blossom}
          style={{ left: `${b.left}%`, width: b.size, height: b.size }}
          initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [0, 1, 1, 0],
            rotate: b.rotate,
            x: [0, 18, -14, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <PetalShape />
        </motion.span>
      ))}
    </div>
  );
}
