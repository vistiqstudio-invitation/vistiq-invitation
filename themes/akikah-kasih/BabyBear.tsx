// Original cute bear-cub doodle - the signature illustration of this
// theme, a genuinely different illustration language from the other
// five aqiqah themes (moon/stars, florals, bunting/balloons, fine line
// wreaths, geometric stars).
export default function BabyBear({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="10" fill="var(--mint-deep)" />
      <circle cx="72" cy="28" r="10" fill="var(--mint-deep)" />
      <circle cx="50" cy="52" r="34" fill="var(--peach)" />
      <circle cx="34" cy="48" r="4.5" fill="var(--ink)" />
      <circle cx="66" cy="48" r="4.5" fill="var(--ink)" />
      <ellipse cx="50" cy="58" rx="9" ry="7" fill="#fff" />
      <circle cx="50" cy="56" r="4" fill="var(--ink)" />
      <path
        d="M42 66c3 4 13 4 16 0"
        stroke="var(--ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="22" cy="62" r="6" fill="var(--accent)" opacity="0.55" />
      <circle cx="78" cy="62" r="6" fill="var(--accent)" opacity="0.55" />
    </svg>
  );
}
