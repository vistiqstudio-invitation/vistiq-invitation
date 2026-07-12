type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// An eight-pointed rub el hizb star (two overlapping squares) - the
// geometric motif that carries this theme's ornament dividers and
// small accent marks, standing in for the border-image chains this
// theme deliberately avoids.
export default function IslamicStar({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="8"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(0 20 20)"
      />
      <rect
        x="8"
        y="8"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(45 20 20)"
      />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}
