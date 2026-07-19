// Scallop-frame fallback for when no baby photo exists yet.
export default function Monogram({ letter }: { letter: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        background: "var(--mint-deep)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "38%",
          color: "var(--ink)",
        }}
      >
        {letter}
      </span>
    </div>
  );
}
