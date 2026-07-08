type Props = {
  className?: string;
  style?: React.CSSProperties;
};

function Blossom({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  const petal = (rotate: number) => (
    <ellipse
      cx={cx}
      cy={cy - 4.2 * scale}
      rx={2.8 * scale}
      ry={4.3 * scale}
      fill="#eeb8c4"
      opacity={0.9}
      transform={`rotate(${rotate} ${cx} ${cy})`}
    />
  );

  return (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle}>{petal(angle)}</g>
      ))}
      <circle cx={cx} cy={cy} r={1.8 * scale} fill="#c9a15a" />
    </g>
  );
}

// A branch that arches across the top of the cover, the classic
// cherry-blossom-frame look, instead of only quiet corner accents.
export default function SakuraCanopy({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 400 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M-10 10 C 60 30, 120 8, 180 22 C 240 34, 300 14, 410 26"
        stroke="#8f435a"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path d="M50 22 C 46 40, 50 54, 58 66" stroke="#8f435a" strokeWidth="1" opacity="0.5" />
      <path d="M110 16 C 116 34, 112 48, 118 60" stroke="#8f435a" strokeWidth="1" opacity="0.5" />
      <path d="M195 26 C 190 42, 196 54, 190 68" stroke="#8f435a" strokeWidth="1" opacity="0.5" />
      <path d="M270 22 C 276 38, 270 50, 278 64" stroke="#8f435a" strokeWidth="1" opacity="0.5" />
      <path d="M330 22 C 324 38, 330 50, 324 62" stroke="#8f435a" strokeWidth="1" opacity="0.5" />

      <Blossom cx={20} cy={16} scale={1.1} />
      <Blossom cx={58} cy={66} scale={0.8} />
      <Blossom cx={90} cy={14} scale={0.9} />
      <Blossom cx={118} cy={60} scale={0.7} />
      <Blossom cx={150} cy={18} scale={1} />
      <Blossom cx={190} cy={68} scale={0.85} />
      <Blossom cx={230} cy={20} scale={0.9} />
      <Blossom cx={278} cy={64} scale={0.75} />
      <Blossom cx={310} cy={16} scale={1} />
      <Blossom cx={324} cy={62} scale={0.65} />
      <Blossom cx={370} cy={22} scale={0.95} />
    </svg>
  );
}
