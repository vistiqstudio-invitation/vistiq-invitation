export default function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 2 L24.5 15 L38 16 L27.5 24.5 L31 38 L20 30 L9 38 L12.5 24.5 L2 16 L15.5 15Z"
        fill="#FFC93C"
        stroke="#fff"
        strokeWidth="2"
      />
    </svg>
  );
}
