"use client";

import { motion } from "framer-motion";
import styles from "./style.module.css";
import Cloud from "./Cloud";

const CLOUDS = [
  { top: "8%", left: "6%", size: 60, delay: 0, duration: 9 },
  { top: "16%", left: "72%", size: 44, delay: 1.2, duration: 11 },
  { top: "68%", left: "10%", size: 38, delay: 0.6, duration: 10 },
  { top: "76%", left: "76%", size: 52, delay: 1.8, duration: 8.5 },
];

export default function FloatingClouds({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          className={styles.floatCloud}
          style={{ top: c.top, left: c.left, width: c.size }}
          animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
          transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud />
        </motion.div>
      ))}
    </div>
  );
}
