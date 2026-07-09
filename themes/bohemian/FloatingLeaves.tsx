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

const LEAF_COLORS = ["#c17a54", "#b08968", "#d9a894"];

function PetalShape({ colorIndex }: { colorIndex: number }) {
  const fill = LEAF_COLORS[colorIndex % LEAF_COLORS.length];
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2 C 18 6, 20 14, 12 22 C 4 14, 6 6, 12 2 Z"
        fill={fill}
        opacity="0.8"
      />
      <path d="M12 4 L12 20" stroke="#5c4530" strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}

export default function FloatingLeaves() {
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
          <PetalShape colorIndex={b.id} />
        </motion.span>
      ))}
    </div>
  );
}
