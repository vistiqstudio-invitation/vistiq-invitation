"use client";

import { motion } from "framer-motion";
import SunburstFan from "./SunburstFan";
import styles from "./style.module.css";

export default function Loading() {
  return (
    <motion.div
      className={styles.loading}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: 70 }}
      >
        <SunburstFan className={styles.loadingFan} />
      </motion.div>

      <motion.span
        className={styles.loadingMark}
        initial={{ opacity: 0, letterSpacing: "0.02em" }}
        animate={{ opacity: 1, letterSpacing: "0.16em" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        Vistiq Invitation
      </motion.span>
    </motion.div>
  );
}
