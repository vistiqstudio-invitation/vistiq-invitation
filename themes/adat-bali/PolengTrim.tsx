type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A short strip of poleng - the black-and-white checkered cloth wrapped
// around trees, statues and shrines across Bali, symbolising rwa bhineda
// (the balance of opposing forces). Always rendered in its real black/
// ivory colours (not currentColor) since poleng is unmistakably two-tone;
// only the trim line above/below picks up the theme's gold via
// currentColor. Used once per section as a divider, never repeated as a
// border around cards.
export default function PolengTrim({ className, style }: Props) {
  const cols = 10;
  const w = 200 / cols;

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="0" y1="1" x2="200" y2="1" stroke="currentColor" strokeWidth="1" opacity="0.6" />

      {Array.from({ length: cols }).map((_, i) => (
        <rect
          key={i}
          x={i * w}
          y="6"
          width={w}
          height="8"
          fill={i % 2 === 0 ? "#171310" : "#f2ece0"}
        />
      ))}

      <line x1="0" y1="19" x2="200" y2="19" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
