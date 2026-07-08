type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A soft, rounded cloud silhouette built from overlapping circles - flat
// and low-opacity so it reads as atmosphere, not a cartoon sticker.
export default function Cloud({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 90"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="55" rx="55" ry="30" />
      <ellipse cx="120" cy="45" rx="65" ry="38" />
      <ellipse cx="170" cy="58" rx="40" ry="24" />
      <ellipse cx="30" cy="62" rx="34" ry="20" />
    </svg>
  );
}
