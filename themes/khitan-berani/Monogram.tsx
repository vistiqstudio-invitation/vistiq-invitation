// Cert-frame fallback for when no child photo exists yet.
export default function Monogram({ letter }: { letter: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        background: "var(--sky)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "40%",
          color: "#fff",
        }}
      >
        {letter}
      </span>
    </div>
  );
}
