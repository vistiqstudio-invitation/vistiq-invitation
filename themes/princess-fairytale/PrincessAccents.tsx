"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./style.module.css";

type AccentProps = {
  className?: string;
  mirrored?: boolean;
};

export function PrincessCorner({ className, mirrored = false }: AccentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ transform: mirrored ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M7 246C44 207 48 163 76 126C99 95 128 80 161 64C190 50 216 32 245 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M29 224C67 207 78 174 83 143M67 154C48 153 34 160 22 175M99 105C115 110 129 108 142 99M141 74C143 54 155 42 172 34"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />

      <g className={styles.cornerLeaves}>
        <path d="M48 202C65 194 78 198 87 211C68 218 55 215 48 202Z" />
        <path d="M74 161C61 147 60 133 69 120C84 133 87 146 74 161Z" />
        <path d="M107 102C107 84 116 72 132 68C136 87 128 98 107 102Z" />
        <path d="M148 72C141 55 146 42 159 33C169 48 164 62 148 72Z" />
        <path d="M177 54C181 37 192 28 208 27C209 45 199 54 177 54Z" />
      </g>

      <g className={styles.cornerFlower} transform="translate(93 126)">
        <path d="M0 8C-18 1-24-13-15-24C-2-21 5-11 0 8Z" />
        <path d="M0 8C2-12 13-22 27-18C30-5 21 5 0 8Z" />
        <path d="M0 8C18 6 29 14 27 27C14 33 4 25 0 8Z" />
        <path d="M0 8C-5 26-17 34-29 27C-31 14-20 7 0 8Z" />
        <circle cx="0" cy="7" r="6" />
      </g>

      <g className={styles.cornerFlowerSmall} transform="translate(177 57)">
        <ellipse cx="0" cy="-8" rx="7" ry="11" />
        <ellipse cx="8" cy="0" rx="7" ry="11" transform="rotate(90 8 0)" />
        <ellipse cx="0" cy="8" rx="7" ry="11" />
        <ellipse cx="-8" cy="0" rx="7" ry="11" transform="rotate(90 -8 0)" />
        <circle r="4" />
      </g>

      <g className={styles.cornerPearls}>
        <circle cx="32" cy="222" r="3" />
        <circle cx="43" cy="210" r="2.3" />
        <circle cx="207" cy="30" r="3" />
        <circle cx="220" cy="22" r="2.2" />
        <circle cx="232" cy="13" r="1.7" />
      </g>
    </svg>
  );
}

export function PrincessDivider({ className }: { className?: string }) {
  return (
    <div className={`${styles.princessDivider} ${className || ""}`} aria-hidden="true">
      <span className={styles.dividerLine} />
      <span className={styles.dividerPearl} />
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 27C17 23 14 14 19 7C27 8 31 15 28 27Z" />
        <path d="M29 27C32 16 39 12 47 16C46 24 39 29 29 27Z" />
        <path d="M29 29C40 30 45 37 42 45C33 45 28 39 29 29Z" />
        <path d="M27 29C24 40 17 44 9 40C10 32 17 27 27 29Z" />
        <circle cx="28" cy="28" r="5" />
      </svg>
      <span className={styles.dividerPearl} />
      <span className={styles.dividerLine} />
    </div>
  );
}

const pearls = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: 4 + ((index * 17) % 92),
  top: 6 + ((index * 29) % 88),
  size: 4 + (index % 4) * 2,
  duration: 7 + (index % 5),
  delay: (index % 6) * 0.7,
}));

export function FloatingPearls() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.floatingPearls} aria-hidden="true">
      {pearls.map((pearl) => (
        <motion.span
          key={pearl.id}
          className={styles.floatingPearl}
          style={{
            left: `${pearl.left}%`,
            top: `${pearl.top}%`,
            width: pearl.size,
            height: pearl.size,
          }}
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -14, 0], opacity: [0.22, 0.72, 0.22], scale: [1, 1.2, 1] }
          }
          transition={{
            duration: pearl.duration,
            delay: pearl.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

