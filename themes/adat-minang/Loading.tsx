"use client";

import { motion } from "framer-motion";
import GonjongRoof from "./GonjongRoof";
import styles from "./style.module.css";

export default function Loading() {
  return (
    <motion.div
      className={styles.loading}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        style={{ width: 90 }}
      >
        <GonjongRoof />
      </motion.div>

      <motion.span
        className={styles.loadingMark}
        initial={{ opacity: 0, letterSpacing: "0.02em" }}
        animate={{ opacity: 1, letterSpacing: "0.1em" }}
        transition={{ duration: 1.3, ease: "easeOut" }}
      >
        Vistiq Invitation
      </motion.span>
    </motion.div>
  );
}
