type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A thin branch with a few five-petal cherry blossoms, used as a corner
// accent. Flat shapes, two shades of pink, kept small so it reads as a
// quiet motif rather than a sticker.
function Blossom({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  const petal = (rotate: number) => (
    <ellipse
      cx={cx}
      cy={cy - 4.2 * scale}
      rx={2.6 * scale}
      ry={4 * scale}
      fill="#eeb8c4"
      opacity={0.85}
      transform={`rotate(${rotate} ${cx} ${cy})`}
    />
  );

  return (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle}>{petal(angle)}</g>
      ))}
      <circle cx={cx} cy={cy} r={1.6 * scale} fill="#c9a15a" />
    </g>
  );
}

export default function SakuraBranch({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 140 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M70 148 C 62 110, 66 78, 74 42 C 78 24, 86 10, 98 2"
        stroke="#8f435a"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M76 86 C 58 80, 44 68, 36 50"
        stroke="#8f435a"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M80 58 C 94 50, 104 38, 108 22"
        stroke="#8f435a"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />

      <Blossom cx={98} cy={2} scale={1.1} />
      <Blossom cx={36} cy={50} scale={0.85} />
      <Blossom cx={108} cy={22} scale={0.75} />
      <Blossom cx={74} cy={42} scale={0.6} />
    </svg>
  );
}
