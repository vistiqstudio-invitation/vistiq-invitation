type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A small illustrated pampas grass plume + dried palm frond, used as a
// corner accent. Flat, simple shapes on purpose - reads as a quiet boho
// motif rather than a busy botanical illustration.
function PampasPlume({ x, y, rotate, scale = 1 }: { x: number; y: number; rotate: number; scale?: number }) {
  const strands = [-34, -24, -14, -5, 5, 14, 24, 34];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {strands.map((a, i) => (
        <path
          key={a}
          d={`M0 0 Q ${a * 0.4} -16, ${a} -34`}
          stroke="#d9c2a8"
          strokeWidth={i % 2 === 0 ? 2.4 : 1.6}
          strokeLinecap="round"
          opacity={0.55 + (i % 3) * 0.12}
        />
      ))}
      <path d="M0 0 Q 0 -18, 0 -34" stroke="#c17a54" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

function PalmFrond({ x, y, rotate, scale = 1 }: { x: number; y: number; rotate: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0 C 8 -4, 14 -14, 12 -30" stroke="#8a6a4a" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {[6, 12, 18, 24].map((t) => (
        <path
          key={t}
          d={`M0 ${-t * 0.9} C 6 ${-t}, 10 ${-t - 6}, 9 ${-t - 12}`}
          stroke="#a3835f"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      ))}
    </g>
  );
}

export default function PampasSprig({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 140 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M70 155 C 64 115, 68 80, 74 45 C 77 28, 82 14, 92 4"
        stroke="#8a7a5c"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M75 90 C 58 84, 44 72, 36 54"
        stroke="#a3835f"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <PampasPlume x={92} y={38} rotate={4} scale={1.05} />
      <PampasPlume x={106} y={64} rotate={-10} scale={0.7} />

      <PalmFrond x={36} y={54} rotate={-20} scale={0.8} />
    </svg>
  );
}
