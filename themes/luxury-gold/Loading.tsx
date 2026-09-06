"use client";

import { motion } from "framer-motion";
import styles from "./style.module.css";

export default function Loading() {
  return (
    <motion.div
      className={styles.loading}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <motion.span
        className={styles.loadingMark}
        initial={{ opacity: 0, letterSpacing: "0.02em" }}
        animate={{ opacity: 1, letterSpacing: "0.08em" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Vistiq Invitation
      </motion.span>
    </motion.div>
  );
}
