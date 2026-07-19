// An 8-point Islamic star (rub el hizb), the signature ornament of this
// theme - used on the cover, event card, and footer instead of the
// moon/floral/bunting/wreath motifs the other four aqiqah themes use.
export default function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <polygon points="50,4 61,32 89,20 68,42 96,50 68,58 89,80 61,68 50,96 39,68 11,80 32,58 4,50 32,42 11,20 39,32" />
    </svg>
  );
}
