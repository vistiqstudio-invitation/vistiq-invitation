type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// An ornate acanthus-scroll corner flourish, the kind of linework found on
// royal certificates and crests. Stroke-only, no fill, so it stays quiet
// against a dark background instead of reading as a sticker.
export default function RoyalCrest({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 4 C 40 4, 45 4, 45 4"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M4 4 C 4 40, 4 45, 4 45"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M4 4 C 30 6, 55 22, 60 55"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M18 4 C 34 14, 42 28, 44 46"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M4 18 C 14 34, 28 42, 46 44"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <circle cx="60" cy="55" r="3.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="44" cy="46" r="2" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="46" cy="44" r="2" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}
