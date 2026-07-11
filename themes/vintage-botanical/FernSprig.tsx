type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A pressed-botanical engraving sprig - thin stroke-only fern/eucalyptus
// line art, the kind found on old scientific illustration plates. Used
// sparingly (couple frames, footer) rather than as a repeated border.
export default function FernSprig({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 140 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4 52 C 40 40, 90 34, 136 30" stroke="currentColor" strokeWidth="1" />
      <path d="M20 47 C 24 40, 30 36, 34 34" stroke="currentColor" strokeWidth="0.8" />
      <path d="M20 47 C 24 53, 30 55, 35 55" stroke="currentColor" strokeWidth="0.8" />
      <path d="M42 42 C 46 35, 52 31, 57 29" stroke="currentColor" strokeWidth="0.8" />
      <path d="M42 42 C 46 48, 52 50, 58 50" stroke="currentColor" strokeWidth="0.8" />
      <path d="M64 38 C 68 31, 74 27, 79 25" stroke="currentColor" strokeWidth="0.8" />
      <path d="M64 38 C 68 44, 74 46, 80 46" stroke="currentColor" strokeWidth="0.8" />
      <path d="M86 34 C 90 28, 95 24, 100 22" stroke="currentColor" strokeWidth="0.7" />
      <path d="M86 34 C 90 39, 95 41, 100 41" stroke="currentColor" strokeWidth="0.7" />
      <path d="M108 31 C 111 26, 115 23, 119 21" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="136" cy="30" r="2" fill="currentColor" />
    </svg>
  );
}
