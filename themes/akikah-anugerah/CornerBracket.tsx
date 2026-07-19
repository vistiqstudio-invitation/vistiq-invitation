export default function CornerBracket({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M0 26V4a4 4 0 0 1 4-4h22" />
    </svg>
  );
}
