// Hexagon-frame fallback for when no baby photo exists yet - initial
// letter set inside the same gem-cut hex shape used everywhere else in
// this theme, so the frame never renders empty.
export default function Monogram({ letter }: { letter: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        background: "var(--navy)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "42%",
          color: "var(--gold)",
        }}
      >
        {letter}
      </span>
    </div>
  );
}
