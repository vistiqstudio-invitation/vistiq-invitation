type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// The stepped triangular gable (timpalaja) of a rumah Saoraja - each
// tier historically marking social rank. This theme's one strong
// architectural shape, used sparingly at the cover crown and couple
// frame rather than repeated as a border.
export default function TimpalajaRoof({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M10 70 L190 70 L158 46 L42 46 Z" fill="currentColor" opacity="0.55" />
      <path d="M46 44 L154 44 L131 24 L69 24 Z" fill="currentColor" opacity="0.78" />
      <path d="M71 22 L129 22 L100 2 Z" fill="currentColor" />
    </svg>
  );
}
