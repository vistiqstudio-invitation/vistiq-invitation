type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// Original crescent-moon-and-stars motif (no reference asset) - reused as
// the cover ornament, corner accents on Baby/Event/Gift cards, and the
// medallion's empty-state fallback when no baby photo has been uploaded
// yet, so the ring never looks like a broken/missing image.
export default function MoonStar({ className, style }: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M40 10a18 18 0 1 0 13 30 15 15 0 0 1-13-30Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M50 6l1.6 4.4L56 12l-4.4 1.6L50 18l-1.6-4.4L44 12l4.4-1.6L50 6Z"
        fill="currentColor"
      />
      <path
        d="M16 34l1.1 3 3 1.1-3 1.1-1.1 3-1.1-3-3-1.1 3-1.1 1.1-3Z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M12 48l0.8 2.2 2.2 0.8-2.2 0.8-0.8 2.2-0.8-2.2-2.2-0.8 2.2-0.8L12 48Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}
