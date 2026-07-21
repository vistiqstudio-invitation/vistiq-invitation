export default function Monogram({ letter }: { letter: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        background: "var(--cream-deep)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: "36%",
          color: "var(--terracotta-deep)",
        }}
      >
        {letter}
      </span>
    </div>
  );
}
