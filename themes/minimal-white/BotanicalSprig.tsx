type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A single-line botanical sketch (branch + leaves + a small blossom) used as
// a quiet decorative accent. Kept as one stroke-only path group so it reads
// as a sketch, not a sticker - fits the "minimal, not empty" brief without
// tipping into busy/floral-clipart territory.
export default function BotanicalSprig({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M60 155 C 55 120, 58 90, 62 60 C 65 40, 70 22, 82 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M61 100 C 46 95, 34 84, 28 68"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M63 78 C 76 72, 86 60, 90 46"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M60 130 C 47 127, 37 118, 32 106"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="82" cy="8" r="4.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="90" cy="46" r="2.5" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="28" cy="68" r="2.5" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}
