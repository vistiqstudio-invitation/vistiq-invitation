// Mega Mendung - the signature layered-cloud batik motif of Cirebon, West
// Java. Two nested, offset rows of scalloped lobes evoke the cascading
// cloud tiers the real motif is known for. Used as the cover's "crown"
// ornament and reused (smaller) as a section divider - one motif, several
// jobs, same approach as the Adat Minang theme's GonjongRoof/SongketMotif.
export default function MegaMendung({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 300 100"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 70 C 10 50, 30 30, 50 45 C 60 20, 90 20, 100 45 C 110 15, 145 15, 155 45 C 165 15, 200 15, 210 45 C 220 20, 250 20, 260 45 C 280 30, 290 50, 290 70"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M35 78 C 35 62, 50 48, 65 58 C 73 38, 98 38, 106 58 C 114 34, 145 34, 153 58 C 161 34, 192 34, 200 58 C 208 38, 233 38, 241 58 C 253 48, 265 62, 265 78"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
