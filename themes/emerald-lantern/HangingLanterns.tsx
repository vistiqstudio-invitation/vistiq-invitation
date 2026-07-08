"use client";

import { motion, useReducedMotion } from "framer-motion";
import Lantern from "./Lantern";
import styles from "./style.module.css";

const lanterns = [
  { left: "12%", size: 46, delay: 0, duration: 4.5 },
  { left: "78%", size: 36, delay: 0.6, duration: 3.8 },
  { left: "48%", size: 30, delay: 1.1, duration: 5.2 },
];

export default function HangingLanterns() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={styles.lanternRow} aria-hidden="true">
      {lanterns.map((lantern, index) => (
        <motion.div
          key={index}
          className={styles.hangingLantern}
          style={{ left: lantern.left, width: lantern.size }}
          animate={prefersReducedMotion ? undefined : { rotate: [-4, 4, -4] }}
          transition={{
            duration: lantern.duration,
            delay: lantern.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Lantern />
        </motion.div>
      ))}
    </div>
  );
}
