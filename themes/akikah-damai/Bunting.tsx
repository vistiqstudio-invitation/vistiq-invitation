import styles from "./style.module.css";

export default function Bunting({ className }: { className?: string }) {
  return (
    <div className={`${styles.buntingRow} ${className ?? ""}`}>
      {Array.from({ length: 7 }).map((_, i) => (
        <span key={i} className={styles.buntingFlag} style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  );
}
