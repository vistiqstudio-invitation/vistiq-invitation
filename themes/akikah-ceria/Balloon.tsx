type Props = {
  className?: string;
  color?: string;
};

// Original balloon-and-string shape (own artwork).
export default function Balloon({ className, color = "#e8927c" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M40 4C18 4 4 24 4 48C4 74 22 96 40 96C58 96 76 74 76 48C76 24 62 4 40 4Z"
        fill={color}
      />
      <ellipse cx="28" cy="30" rx="7" ry="12" fill="#fff" opacity="0.35" />
      <path d="M40 96L36 106L44 112L38 122L40 130" stroke={color} strokeWidth="2" fill="none" opacity="0.8" />
    </svg>
  );
}
