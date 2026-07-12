type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A line-drawn Cycladic doorway - the rounded whitewashed archways of
// Santorini's alleyways. This theme's one strong architectural shape,
// used sparingly at the cover crown rather than repeated as a border.
export default function CycladicArch({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 140 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 88 L14 42 C14 16, 34 4, 70 4 C106 4, 126 16, 126 42 L126 88"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M30 88 L30 46 C30 26, 44 18, 70 18 C96 18, 110 26, 110 46 L110 88"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.55"
      />
    </svg>
  );
}
