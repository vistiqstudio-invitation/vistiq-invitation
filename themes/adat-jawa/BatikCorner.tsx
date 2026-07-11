type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A geometric corner ornament in the spirit of batik parang/kawung
// motifs: diagonal repeating strokes fanning from the corner plus a
// four-petal kawung mark. Stroke-only so it reads as fine linework,
// not a sticker, echoing carved wood panel corners.
export default function BatikCorner({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2 2 L34 2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 2 L2 34" stroke="currentColor" strokeWidth="1.2" />

      <path d="M10 22 L22 10" stroke="currentColor" strokeWidth="1" />
      <path d="M16 30 L30 16" stroke="currentColor" strokeWidth="1" />
      <path d="M22 38 L38 22" stroke="currentColor" strokeWidth="1" />
      <path d="M28 46 L46 28" stroke="currentColor" strokeWidth="0.8" />
      <path d="M34 54 L54 34" stroke="currentColor" strokeWidth="0.6" />

      <g transform="translate(50 50)">
        <circle r="10" stroke="currentColor" strokeWidth="1" />
        <path d="M0 -10 C 5 -6, 5 -4, 0 0 C -5 -4, -5 -6, 0 -10 Z" stroke="currentColor" strokeWidth="0.8" />
        <path d="M10 0 C 6 5, 4 5, 0 0 C 4 -5, 6 -5, 10 0 Z" stroke="currentColor" strokeWidth="0.8" />
        <path d="M0 10 C -5 6, -5 4, 0 0 C 5 4, 5 6, 0 10 Z" stroke="currentColor" strokeWidth="0.8" />
        <path d="M-10 0 C -6 -5, -4 -5, 0 0 C -4 5, -6 5, -10 0 Z" stroke="currentColor" strokeWidth="0.8" />
        <circle r="2.2" stroke="currentColor" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
