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

function LeafShape() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2 C 18 6, 20 13, 12 22 C 4 13, 6 6, 12 2 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M12 5 V 19" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}

export default function FloatingPetals() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: 7 }, (_, id) => ({
        id,
        left: Math.round((id / 7) * 100 + (id % 2) * 4),
        size: 14 + (id % 3) * 6,
        duration: 22 + (id % 4) * 6,
        delay: id * 2.4,
        rotate: id % 2 === 0 ? 360 : -360,
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
            x: [0, 16, -12, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <LeafShape />
        </motion.span>
      ))}
    </div>
  );
}
