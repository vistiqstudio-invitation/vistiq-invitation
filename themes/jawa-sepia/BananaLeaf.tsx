type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A single original banana-leaf frond silhouette, flanking the joglo
// illustration in Hero - mirrored via CSS transform for the opposite side.
export default function BananaLeaf({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 258 C4 190 8 118 46 60 C70 24 96 8 112 2 C110 40 96 78 70 108 C88 96 104 92 118 92 C104 130 78 156 44 168 C64 162 82 164 96 172 C76 202 46 220 14 224 C28 220 40 224 48 234 C34 246 22 254 20 258 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M22 250 C34 190 46 130 78 78"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}
