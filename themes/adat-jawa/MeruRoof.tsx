type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A stepped tiered-roof silhouette (meru/joglo roofline) used to crest
// the cover card and the couple frame - the one strong architectural
// shape that carries this theme's identity, used sparingly at 1-2 spots
// rather than repeated as a border.
export default function MeruRoof({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 160 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M80 2 L96 20 L64 20 Z" fill="currentColor" opacity="0.9" />
      <path d="M80 14 L108 34 L52 34 Z" fill="currentColor" opacity="0.75" />
      <path d="M80 26 L140 56 L20 56 Z" fill="currentColor" opacity="0.55" />
      <circle cx="80" cy="8" r="2.5" fill="currentColor" />
    </svg>
  );
}
