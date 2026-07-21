// Octagon-frame fallback for when no child photo exists yet.
export default function Monogram({ letter }: { letter: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        background: "var(--olive-deep)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "40%",
          color: "var(--cream)",
        }}
      >
        {letter}
      </span>
    </div>
  );
}
