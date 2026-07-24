// A row of diamond outlines strung along a thin line, evoking Sundanese
// anyaman (bamboo weave) lattice work. Reused as the section-title divider,
// a corner accent, and the connector between the Akad/Resepsi event cards -
// one motif, several jobs.
export default function SundaLattice({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const centers = [20, 60, 100, 140, 180];

  return (
    <svg
      viewBox="0 0 200 20"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="0" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
      {centers.map((x) => (
        <path
          key={x}
          d={`M${x} 2 L${x + 10} 10 L${x} 18 L${x - 10} 10 Z`}
          stroke="currentColor"
          strokeWidth="1.3"
          fill="none"
        />
      ))}
    </svg>
  );
}
