// Shield-frame fallback for when no child photo exists yet.
export default function Monogram({ letter }: { letter: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        background: "var(--forest)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: "40%",
          color: "var(--gold)",
        }}
      >
        {letter}
      </span>
    </div>
  );
}
