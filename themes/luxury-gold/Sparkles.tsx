"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./style.module.css";

type Particle = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

export default function Sparkles() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 14 }, (_, id) => ({
        id,
        left: Math.round((id / 14) * 100 + (id % 3) * 2),
        size: 3 + (id % 3),
        duration: 14 + (id % 5) * 3,
        delay: id * 1.1,
      })),
    []
  );

  if (!mounted || prefersReducedMotion) return null;

  return (
    <div className={styles.sparkleField} aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={styles.sparkle}
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
