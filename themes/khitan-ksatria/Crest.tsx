// Original laurel-and-star crest ornament - the signature motif of this
// "little knight" khitan theme, distinct from khitan-warna's plain
// medallion styling.
export default function Crest({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polygon
        points="50,8 56,24 73,22 62,35 68,52 50,44 32,52 38,35 27,22 44,24"
        fill="currentColor"
        stroke="none"
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 58 + i * 7;
        const scale = 1 - i * 0.08;
        return (
          <g key={`l-${i}`} transform={`translate(${47 - i * 1.5} ${y})`}>
            <path d={`M0 0 C -8 -1, -13 3, -14 ${8 * scale} C -9 ${6 * scale}, -3 ${3 * scale}, 0 0 Z`} fill="currentColor" stroke="none" />
          </g>
        );
      })}
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 58 + i * 7;
        const scale = 1 - i * 0.08;
        return (
          <g key={`r-${i}`} transform={`translate(${53 + i * 1.5} ${y}) scale(-1,1)`}>
            <path d={`M0 0 C -8 -1, -13 3, -14 ${8 * scale} C -9 ${6 * scale}, -3 ${3 * scale}, 0 0 Z`} fill="currentColor" stroke="none" />
          </g>
        );
      })}
    </svg>
  );
}
