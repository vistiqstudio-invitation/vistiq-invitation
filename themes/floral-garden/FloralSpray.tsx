type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A small illustrated floral spray (sage leaves + blush blossoms) used as a
// corner accent. Flat, simple shapes on purpose - reads as a light garden
// motif rather than a busy botanical illustration.
export default function FloralSpray({ className, style }: Props) {
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
        stroke="#8a9a7e"
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
        stroke="#8a9a7e"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <ellipse cx="108" cy="26" rx="9" ry="5" fill="#8a9a7e" opacity="0.55" transform="rotate(35 108 26)" />

      <g transform="translate(92 4)">
        <circle cx="0" cy="0" r="6" fill="#e8b4b8" opacity="0.9" />
        <circle cx="8" cy="-3" r="5" fill="#e8b4b8" opacity="0.75" />
        <circle cx="-7" cy="-4" r="5" fill="#e8b4b8" opacity="0.75" />
        <circle cx="1" cy="-8" r="5" fill="#e8b4b8" opacity="0.8" />
        <circle cx="0" cy="0" r="2.5" fill="#c9a15a" />
      </g>

      <g transform="translate(36 54) scale(0.7)">
        <circle cx="0" cy="0" r="6" fill="#e8b4b8" opacity="0.85" />
        <circle cx="7" cy="-3" r="5" fill="#e8b4b8" opacity="0.7" />
        <circle cx="-6" cy="-4" r="5" fill="#e8b4b8" opacity="0.7" />
        <circle cx="0" cy="0" r="2.2" fill="#c9a15a" />
      </g>
    </svg>
  );
}
