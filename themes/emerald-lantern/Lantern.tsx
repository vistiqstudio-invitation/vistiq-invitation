type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A simple paper lantern silhouette (string, cap, ribbed body, warm glow)
// used as a hanging decorative accent for the evening-garden mood.
export default function Lantern({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 60 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M30 0 V 22" stroke="currentColor" strokeWidth="1" />

      <rect x="20" y="22" width="20" height="6" rx="2" fill="currentColor" opacity="0.9" />

      <path
        d="M18 30 C 14 42, 14 66, 18 78 C 22 84, 38 84, 42 78 C 46 66, 46 42, 42 30 Z"
        fill="currentColor"
        opacity="0.16"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      <path d="M22 34 C 19 46, 19 62, 22 74" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      <path d="M30 32 C 27 46, 27 62, 30 76" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      <path d="M38 34 C 41 46, 41 62, 38 74" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />

      <circle cx="30" cy="54" r="6" fill="currentColor" opacity="0.5" />

      <rect x="22" y="82" width="16" height="5" rx="2" fill="currentColor" opacity="0.9" />
      <path d="M30 87 V 96" stroke="currentColor" strokeWidth="1" />
      <circle cx="30" cy="99" r="2.4" fill="currentColor" opacity="0.8" />
    </svg>
  );
}
