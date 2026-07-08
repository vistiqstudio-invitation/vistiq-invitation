type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// An eight-pointed star (rub el hizb), the classic Islamic geometric motif,
// drawn as two overlapping squares. Stroke-only so it reads as an emblem
// rather than a sticker.
export default function IslamicMotif({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="50"
        y="50"
        width="56"
        height="56"
        transform="rotate(0 50 50) translate(-28 -28)"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="50"
        y="50"
        width="56"
        height="56"
        transform="rotate(45 50 50) translate(-28 -28)"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
