"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./style.module.css";

type Petal = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
};

function SakuraPetal() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2 C 16 4, 16 10, 12 13 C 8 10, 8 4, 12 2 Z"
        fill="#eeb8c4"
        opacity="0.85"
      />
      <path d="M12 2 C 13 5, 13 9, 12 13" stroke="#c2607a" strokeWidth="0.4" opacity="0.6" />
    </svg>
  );
}

export default function FallingSakura() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: 7 }, (_, id) => ({
        id,
        left: Math.round((id / 7) * 100 + (id % 2) * 5),
        size: 12 + (id % 3) * 5,
        duration: 18 + (id % 4) * 6,
        delay: id * 2.2,
        rotate: id % 2 === 0 ? 300 : -300,
      })),
    []
  );

  if (!mounted || prefersReducedMotion) return null;

  return (
    <div className={styles.petalField} aria-hidden="true">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className={styles.petal}
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [0, 1, 1, 0],
            rotate: p.rotate,
            x: [0, 20, -16, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <SakuraPetal />
        </motion.span>
      ))}
    </div>
  );
}
