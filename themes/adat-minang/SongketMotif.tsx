type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// A row of interlocking diamonds evoking songket weave (pucuak rabuang /
// bamboo-shoot lattice patterns woven with gold thread). Used as the
// section-ornament divider, a corner accent, and the marawa-flag-style
// bunting along event cards - one motif, several jobs, rather than a
// repeated border-image chain.
export default function SongketMotif({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${20 + i * 40} 2 L${32 + i * 40} 12 L${20 + i * 40} 22 L${8 + i * 40} 12 Z`}
          stroke="currentColor"
          strokeWidth="1.4"
          opacity={i === 2 ? 1 : 0.55}
        />
      ))}
      <path d="M0 12 L200 12" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
    </svg>
  );
}
