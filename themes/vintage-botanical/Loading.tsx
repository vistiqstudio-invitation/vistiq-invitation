"use client";

import { motion } from "framer-motion";
import styles from "./style.module.css";

export default function Loading() {
  return (
    <motion.div
      className={styles.loading}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <motion.span
        className={styles.loadingMark}
        initial={{ opacity: 0, filter: "blur(6px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        Vistiq Invitation
      </motion.span>
    </motion.div>
  );
}
