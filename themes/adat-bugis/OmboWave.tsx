type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A rolling sea-wave line (ombak) nodding to Bugis-Makassar seafaring
// heritage (the phinisi schooner) - used as the section-ornament
// divider and the wave-edge on event cards, one motif doing several
// jobs rather than a repeated border-image chain.
export default function OmboWave({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0 14 Q 25 2, 50 14 T 100 14 T 150 14 T 200 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="50" cy="14" r="2.2" fill="currentColor" />
      <circle cx="150" cy="14" r="2.2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
