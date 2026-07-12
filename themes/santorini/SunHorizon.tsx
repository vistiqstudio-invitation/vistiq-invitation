type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A sun sinking to the horizon line - the caldera sunset Santorini is
// famous for. Used as the section-ornament divider, standing in for
// the border-image chains this theme deliberately avoids.
export default function SunHorizon({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="0" y1="16" x2="120" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path
        d="M42 16 A18 18 0 0 1 78 16"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}
