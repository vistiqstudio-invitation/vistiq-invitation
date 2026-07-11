type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A radiating fan of lines from a single point - the Art Deco sunburst
// motif seen on 1920s theater marquees and fountain reliefs. Used as a
// one-off accent (cover, couple divider) rather than a repeated border.
export default function SunburstFan({ className, style }: Props) {
  const rays = Array.from({ length: 13 }, (_, i) => {
    const angle = -90 + (i - 6) * 12;
    const rad = (angle * Math.PI) / 180;
    const len = 56 - Math.abs(i - 6) * 2.2;
    const x2 = 60 + len * Math.cos(rad);
    const y2 = 60 + len * Math.sin(rad);
    return { x2, y2, key: i };
  });

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {rays.map((r) => (
        <line key={r.key} x1="60" y1="60" x2={r.x2} y2={r.y2} stroke="currentColor" strokeWidth="1.4" />
      ))}
      <circle cx="60" cy="60" r="4" fill="currentColor" />
    </svg>
  );
}
