type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A small stemmed-flower flourish used as the section-title divider -
// distinct from the diamond-lattice batik background and the joglo
// illustration, kept light so it reads as a rule, not a sticker.
export default function LotusMark({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2 13 L38 13" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path d="M62 13 L98 13" stroke="currentColor" strokeWidth="1" opacity="0.55" />

      <g transform="translate(50 13)">
        <path d="M0 -9 C4 -6 4 -2 0 0 C-4 -2 -4 -6 0 -9 Z" fill="currentColor" opacity="0.85" />
        <path d="M0 9 C4 6 4 2 0 0 C-4 2 -4 6 0 9 Z" fill="currentColor" opacity="0.85" />
        <path d="M-9 0 C-6 -4 -2 -4 0 0 C-2 4 -6 4 -9 0 Z" fill="currentColor" opacity="0.7" />
        <path d="M9 0 C6 -4 2 -4 0 0 C2 4 6 4 9 0 Z" fill="currentColor" opacity="0.7" />
        <circle r="2.4" fill="currentColor" />
      </g>
    </svg>
  );
}
