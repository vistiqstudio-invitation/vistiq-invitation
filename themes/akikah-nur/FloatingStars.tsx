"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import MoonStar from "./MoonStar";
import styles from "./style.module.css";

type Star = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

export default function FloatingStars() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 7 }, (_, id) => ({
        id,
        left: Math.round((id / 7) * 100 + (id % 2) * 6),
        size: 14 + (id % 3) * 8,
        duration: 22 + (id % 4) * 7,
        delay: id * 3.1,
      })),
    []
  );

  if (!mounted || prefersReducedMotion) return null;

  return (
    <div className={styles.starField} aria-hidden="true">
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className={styles.floatStar}
          style={{ left: `${s.left}%`, width: s.size, height: s.size }}
          initial={{ y: "-8vh", opacity: 0 }}
          animate={{
            y: "108vh",
            opacity: [0, 0.8, 0.8, 0],
            x: [0, 14, -10, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <MoonStar />
        </motion.span>
      ))}
    </div>
  );
}
