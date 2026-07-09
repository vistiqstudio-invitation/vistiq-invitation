type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A large, layered watercolor-style corner bouquet: gradient-shaded magnolia
// blossoms, sage leaves, and a thin gold accent arc. Designed to sit in a
// page corner (top-left orientation) - mirror with CSS transform for the
// opposite corner. Much bigger and denser than SakuraBranch, meant to read
// as a real illustrated bouquet rather than a quiet line-art accent.
function Petal({
  x,
  y,
  rotate,
  scale = 1,
  fill,
}: {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
  fill: string;
}) {
  return (
    <path
      d="M0,0 C -9,-15 -7,-32 0,-42 C 7,-32 9,-15 0,0 Z"
      fill={fill}
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
    />
  );
}

function Magnolia({
  cx,
  cy,
  scale = 1,
  rotate = 0,
  petals = 6,
}: {
  cx: number;
  cy: number;
  scale?: number;
  rotate?: number;
  petals?: number;
}) {
  const step = 360 / petals;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}>
      {Array.from({ length: petals }).map((_, i) => (
        <Petal key={i} x={0} y={0} rotate={i * step} fill="url(#bouquetPetal)" />
      ))}
      <circle r="6" fill="url(#bouquetCenter)" />
      {[0, 120, 240].map((a) => (
        <circle
          key={a}
          cx={0}
          cy={-2.5}
          r="1.1"
          fill="#8f435a"
          opacity="0.7"
          transform={`rotate(${a})`}
        />
      ))}
    </g>
  );
}

function Leaf({
  x,
  y,
  rotate,
  scale = 1,
}: {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0,0 C 12,-5 22,-17 17,-34 C 9,-24 -2,-12 0,0 Z" fill="url(#bouquetLeaf)" />
      <path d="M2,-3 C 8,-10 12,-19 14,-29" stroke="#5f6e49" strokeWidth="0.7" opacity="0.5" fill="none" />
    </g>
  );
}

export default function SakuraCornerBouquet({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bouquetPetal" cx="30%" cy="20%" r="85%">
          <stop offset="0%" stopColor="#fce7ea" />
          <stop offset="55%" stopColor="#eeb8c4" />
          <stop offset="100%" stopColor="#c2607a" />
        </radialGradient>
        <radialGradient id="bouquetCenter" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f3d9a6" />
          <stop offset="100%" stopColor="#c9a15a" />
        </radialGradient>
        <linearGradient id="bouquetLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#aebd97" />
          <stop offset="100%" stopColor="#71835a" />
        </linearGradient>
      </defs>

      <path
        d="M4 60 A 130 130 0 0 1 130 4"
        stroke="#c9a15a"
        strokeWidth="1.4"
        opacity="0.55"
        fill="none"
      />

      <Leaf x={30} y={96} rotate={-35} scale={1.5} />
      <Leaf x={78} y={34} rotate={35} scale={1.35} />
      <Leaf x={14} y={44} rotate={-70} scale={1.1} />
      <Leaf x={104} y={62} rotate={80} scale={1} />

      <Magnolia cx={38} cy={40} scale={2.05} rotate={-12} />
      <Magnolia cx={84} cy={20} scale={1.3} rotate={18} />
      <Magnolia cx={14} cy={88} scale={1.15} rotate={-30} />
      <Magnolia cx={110} cy={44} scale={0.75} rotate={40} />
    </svg>
  );
}
