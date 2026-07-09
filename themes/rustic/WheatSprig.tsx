type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A small illustrated wheat stalk + dried terracotta bloom, used as a
// corner accent. Flat, simple shapes on purpose - reads as a quiet rustic
// motif rather than a busy botanical illustration.
function WheatEar({ x, y, rotate, scale = 1 }: { x: number; y: number; rotate: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="2.6" ry="6" fill="#c9a15a" />
      <ellipse cx="-3.4" cy="4" rx="2.3" ry="5.4" fill="#c9a15a" opacity="0.9" />
      <ellipse cx="3.4" cy="4" rx="2.3" ry="5.4" fill="#c9a15a" opacity="0.9" />
      <ellipse cx="-2.6" cy="10.5" rx="2" ry="4.8" fill="#c9a15a" opacity="0.8" />
      <ellipse cx="2.6" cy="10.5" rx="2" ry="4.8" fill="#c9a15a" opacity="0.8" />
    </g>
  );
}

export default function WheatSprig({ className, style }: Props) {
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
        stroke="#8a9a7e"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <ellipse cx="34" cy="50" rx="9" ry="5" fill="#8a9a7e" opacity="0.55" transform="rotate(-30 34 50)" />

      <path
        d="M78 65 C 92 58, 102 46, 106 30"
        stroke="#8a7a5c"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <g transform="translate(92 4) rotate(8)">
        <WheatEar x={0} y={0} rotate={0} scale={1.1} />
      </g>
      <g transform="translate(106 30) rotate(-6)">
        <WheatEar x={0} y={0} rotate={0} scale={0.85} />
      </g>

      <g transform="translate(36 54) scale(0.75)">
        <circle cx="0" cy="0" r="6" fill="#c17a54" opacity="0.85" />
        <circle cx="7" cy="-3" r="5" fill="#c17a54" opacity="0.7" />
        <circle cx="-6" cy="-4" r="5" fill="#c17a54" opacity="0.7" />
        <circle cx="0" cy="0" r="2.2" fill="#8a6a4a" />
      </g>
    </svg>
  );
}
