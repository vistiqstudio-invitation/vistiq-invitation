import styles from "./style.module.css";

// Fine-line monogram used inside the photo frame whenever no baby photo
// exists yet - an elegant stand-in (like a wax-seal monogram on fine
// stationery) rather than leaving the frame empty.
export default function Monogram({ letter }: { letter: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        background: "var(--blush)",
      }}
    >
      <svg viewBox="0 0 100 100" width="52%" aria-hidden="true">
        <circle cx="50" cy="50" r="34" fill="none" stroke="var(--gold)" strokeWidth="1" />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className={styles.monogramLetter}
          fill="var(--charcoal)"
        >
          {letter}
        </text>
      </svg>
    </div>
  );
}
