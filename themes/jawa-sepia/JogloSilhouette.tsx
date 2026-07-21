type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// An original two-tone illustration of a Javanese joglo pavilion - tiered
// roof, open pillar hall, and a stepped platform. Used once as the Hero
// centerpiece, not repeated as a border motif.
export default function JogloSilhouette({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* roof tiers */}
      <path d="M160 12 L188 40 L132 40 Z" fill="currentColor" opacity="0.95" />
      <path d="M160 30 L214 62 L106 62 Z" fill="currentColor" opacity="0.85" />
      <path d="M160 50 L252 92 L68 92 Z" fill="currentColor" opacity="0.7" />
      <path d="M160 76 L292 122 L28 122 Z" fill="currentColor" opacity="0.55" />

      {/* roof tile lines */}
      <path
        d="M60 116 L280 116 M50 120 L270 120"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.4"
      />

      {/* pillar hall */}
      <rect x="40" y="122" width="6" height="58" fill="currentColor" opacity="0.5" />
      <rect x="84" y="122" width="6" height="58" fill="currentColor" opacity="0.5" />
      <rect x="128" y="122" width="6" height="58" fill="currentColor" opacity="0.5" />
      <rect x="186" y="122" width="6" height="58" fill="currentColor" opacity="0.5" />
      <rect x="230" y="122" width="6" height="58" fill="currentColor" opacity="0.5" />
      <rect x="274" y="122" width="6" height="58" fill="currentColor" opacity="0.5" />

      {/* inner archway */}
      <path
        d="M132 180 L132 152 C132 138 148 128 160 128 C172 128 188 138 188 152 L188 180 Z"
        fill="currentColor"
        opacity="0.28"
      />

      {/* platform + steps */}
      <rect x="24" y="180" width="272" height="8" fill="currentColor" opacity="0.6" />
      <rect x="60" y="188" width="200" height="7" fill="currentColor" opacity="0.45" />
      <rect x="96" y="195" width="128" height="7" fill="currentColor" opacity="0.32" />
    </svg>
  );
}
