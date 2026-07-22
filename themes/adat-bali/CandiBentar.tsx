type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// One tower of a candi bentar - the split ceremonial gate that stands at
// the entrance of every Balinese temple and traditional wedding venue.
// Rendered twice (mirrored via CSS scaleX) with a gap between the two
// copies, the way real candi bentar are literally built as two identical
// mirror-image halves flanking a walkway. Tiered stepped silhouette
// tapering to a slender spire - this theme's one strong architectural
// shape, used at the cover and loading screen rather than as a border.
const TIERS = [
  { y: 210, h: 46, wTop: 74, wBottom: 92 },
  { y: 168, h: 42, wTop: 60, wBottom: 78 },
  { y: 128, h: 40, wTop: 46, wBottom: 64 },
  { y: 90, h: 38, wTop: 32, wBottom: 50 },
  { y: 54, h: 36, wTop: 18, wBottom: 36 },
];

export default function CandiBentar({ className, style }: Props) {
  const cx = 60;

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* base plinth */}
      <rect x="8" y="256" width="104" height="30" fill="currentColor" opacity="0.9" />
      <rect x="0" y="286" width="120" height="10" fill="currentColor" />

      {TIERS.map((tier, i) => {
        const top = tier.y;
        const bottom = tier.y + tier.h;
        const capH = 14;

        return (
          <g key={i} opacity={0.72 + i * 0.06}>
            {/* tier body */}
            <polygon
              points={`${cx - tier.wBottom / 2},${bottom} ${cx + tier.wBottom / 2},${bottom} ${cx + tier.wTop / 2},${top + capH} ${cx - tier.wTop / 2},${top + capH}`}
              fill="currentColor"
            />
            {/* tier roof cap, overhanging slightly wider than the body below it */}
            <polygon
              points={`${cx - (tier.wBottom / 2 + 6)},${top + capH} ${cx + (tier.wBottom / 2 + 6)},${top + capH} ${cx + tier.wTop / 2},${top} ${cx - tier.wTop / 2},${top}`}
              fill="currentColor"
            />
          </g>
        );
      })}

      {/* spire */}
      <polygon points={`${cx - 9},54 ${cx + 9},54 ${cx},4`} fill="currentColor" />
      <circle cx={cx} cy="4" r="3.4" fill="currentColor" />
    </svg>
  );
}
