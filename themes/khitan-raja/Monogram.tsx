// Arch-frame fallback for when no child photo exists yet.
export default function Monogram({ letter }: { letter: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        background: "var(--maroon)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "42%",
          color: "var(--gold)",
        }}
      >
        {letter}
      </span>
    </div>
  );
}
