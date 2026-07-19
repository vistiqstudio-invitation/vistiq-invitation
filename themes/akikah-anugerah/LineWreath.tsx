export default function LineWreath({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M60 8c-6 10-10 22-10 34 0 22 8 40 10 68" opacity="0.85" />
      <path d="M60 8c6 10 10 22 10 34 0 22-8 40-10 68" opacity="0.85" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 22 + i * 15;
        const scale = 1 - i * 0.06;
        return (
          <g key={`l-${i}`} transform={`translate(${50 - i * 2} ${y})`}>
            <path
              d={`M0 0 C -10 -2, -16 4, -18 ${10 * scale} C -12 ${8 * scale}, -4 ${4 * scale}, 0 0 Z`}
            />
          </g>
        );
      })}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 22 + i * 15;
        const scale = 1 - i * 0.06;
        return (
          <g key={`r-${i}`} transform={`translate(${70 + i * 2} ${y}) scale(-1,1)`}>
            <path
              d={`M0 0 C -10 -2, -16 4, -18 ${10 * scale} C -12 ${8 * scale}, -4 ${4 * scale}, 0 0 Z`}
            />
          </g>
        );
      })}
      <circle cx="60" cy="14" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
