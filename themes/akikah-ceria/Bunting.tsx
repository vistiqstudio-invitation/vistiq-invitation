type Props = {
  className?: string;
};

// Original triangle-flag garland (own artwork) - the signature accent for
// this theme, draped across Cover and Footer.
export default function Bunting({ className }: Props) {
  const flags = [
    "#e8927c",
    "#8fa888",
    "#e0ac4c",
    "#e8927c",
    "#8fa888",
    "#e0ac4c",
    "#e8927c",
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 700 90"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0 14C120 34 580 34 700 14"
        stroke="#c9a15a"
        strokeWidth="2"
        fill="none"
      />
      {flags.map((color, i) => {
        const x = 40 + i * 100;
        const y = 14 + 20 * Math.sin((i / (flags.length - 1)) * Math.PI);
        return (
          <path
            key={i}
            d={`M${x - 22} ${y} L${x + 22} ${y} L${x} ${y + 46} Z`}
            fill={color}
          />
        );
      })}
    </svg>
  );
}
