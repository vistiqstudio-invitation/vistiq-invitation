export default function LineDivider({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <line x1="0" y1="8" x2="76" y2="8" />
      <rect x="86" y="4" width="8" height="8" transform="rotate(45 90 8)" fill="currentColor" stroke="none" />
      <line x1="104" y1="8" x2="180" y2="8" />
    </svg>
  );
}
