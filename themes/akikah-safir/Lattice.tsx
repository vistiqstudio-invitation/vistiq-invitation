// A tileable geometric star-lattice, used as a low-opacity full-bleed
// backdrop behind the cover - genuinely different motif language from
// CoverPattern.tsx (moon/stars) used in the akikah-nur theme.
export default function Lattice({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
      <defs>
        <pattern id="safir-lattice" width="50" height="50" patternUnits="userSpaceOnUse">
          <polygon
            points="25,4 31,19 46,15 35,25 46,35 31,31 25,46 19,31 4,35 15,25 4,15 19,19"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#safir-lattice)" />
    </svg>
  );
}
