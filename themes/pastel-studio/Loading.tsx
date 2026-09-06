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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Vistiq Invitation
      </motion.span>
    </motion.div>
  );
}
