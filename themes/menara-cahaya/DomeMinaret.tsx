type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A mosque skyline - central onion dome flanked by two slender minarets -
// this theme's one strong architectural shape, used sparingly at the
// cover crown rather than repeated as a border.
export default function DomeMinaret({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 220 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="16" y="40" width="10" height="40" fill="currentColor" opacity="0.65" />
      <path d="M15 40 C15 30, 27 30, 27 40 Z" fill="currentColor" opacity="0.65" />
      <circle cx="21" cy="26" r="2.4" fill="currentColor" opacity="0.65" />

      <rect x="194" y="40" width="10" height="40" fill="currentColor" opacity="0.65" />
      <path d="M193 40 C193 30, 205 30, 205 40 Z" fill="currentColor" opacity="0.65" />
      <circle cx="199" cy="26" r="2.4" fill="currentColor" opacity="0.65" />

      <path
        d="M60 80 L60 46 C60 20, 78 8, 110 6 C142 8, 160 20, 160 46 L160 80 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M92 6 C92 -2, 104 -2, 104 6 L104 14 L92 14 Z"
        fill="currentColor"
      />
      <circle cx="98" cy="-6" r="3" fill="currentColor" />
      <rect x="96" y="-2" width="4" height="8" fill="currentColor" />
    </svg>
  );
}
