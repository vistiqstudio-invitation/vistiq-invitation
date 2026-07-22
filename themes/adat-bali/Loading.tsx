"use client";

import { motion } from "framer-motion";
import CandiBentar from "./CandiBentar";
import styles from "./style.module.css";

export default function Loading() {
  return (
    <motion.div
      className={styles.loading}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <motion.div
        className={styles.loadingGate}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <CandiBentar />
      </motion.div>

      <motion.span
        className={styles.loadingMark}
        initial={{ opacity: 0, letterSpacing: "0.02em" }}
        animate={{ opacity: 1, letterSpacing: "0.12em" }}
        transition={{ duration: 1.3, ease: "easeOut" }}
      >
        Vistiq Invitation
      </motion.span>
    </motion.div>
  );
}
