type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// Original marigold-and-leaf corner illustration (own SVG artwork, not a
// downloaded asset) - matches the reference site's visual genre (a warm
// gold/orange bloom over sage-green eucalyptus-style leaves) without
// reusing its likely-licensed PNG decoration.
export default function FloralCorner({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* leaf sprigs */}
      <g opacity="0.9">
        <path d="M10 150C30 120 50 100 90 90C60 110 45 130 34 156Z" fill="#7d8a5a" />
        <path d="M18 158C42 132 66 116 104 108C76 126 58 144 44 162Z" fill="#929979" />
        <path d="M2 128C24 108 44 96 78 92C52 106 34 118 22 138Z" fill="#6c7e2f" opacity="0.85" />
      </g>

      {/* marigold bloom */}
      <g transform="translate(46 108)">
        <ellipse cx="0" cy="-20" rx="9" ry="15" fill="#e8a53a" transform="rotate(0)" />
        <ellipse cx="14" cy="-14" rx="9" ry="15" fill="#eab54f" transform="rotate(45 14 -14)" />
        <ellipse cx="20" cy="0" rx="9" ry="15" fill="#e8a53a" transform="rotate(90 20 0)" />
        <ellipse cx="14" cy="14" rx="9" ry="15" fill="#eab54f" transform="rotate(135 14 14)" />
        <ellipse cx="0" cy="20" rx="9" ry="15" fill="#e8a53a" transform="rotate(180 0 20)" />
        <ellipse cx="-14" cy="14" rx="9" ry="15" fill="#eab54f" transform="rotate(225 -14 14)" />
        <ellipse cx="-20" cy="0" rx="9" ry="15" fill="#e8a53a" transform="rotate(270 -20 0)" />
        <ellipse cx="-14" cy="-14" rx="9" ry="15" fill="#eab54f" transform="rotate(315 -14 -14)" />
        <circle cx="0" cy="0" r="9" fill="#c9861f" />
        <circle cx="0" cy="0" r="9" fill="#6c7e2f" opacity="0.18" />
      </g>

      {/* small bud */}
      <g transform="translate(88 132)">
        <circle r="6" fill="#eab54f" />
        <circle r="6" fill="#6c7e2f" opacity="0.15" />
      </g>
    </svg>
  );
}
