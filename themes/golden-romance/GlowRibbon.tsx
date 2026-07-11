type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A soft flowing S-curve ribbon - used as a gentle divider between the
// bride and groom photos instead of a hard line or crest.
export default function GlowRibbon({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 40 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 2 C 34 22, 6 42, 20 60 C 34 78, 6 98, 20 118"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="20" cy="2" r="2.4" fill="currentColor" />
      <circle cx="20" cy="118" r="2.4" fill="currentColor" />
    </svg>
  );
}
