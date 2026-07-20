// Original crown line-art - the signature motif of this "raja sehari"
// (king for a day) khitan theme, distinct from khitan-warna's plain
// medallion and khitan-ksatria's laurel crest.
export default function Crown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 52 L4 20 L26 36 L37 12 L50 32 L63 12 L74 36 L96 20 L92 52 Z" />
      <circle cx="50" cy="10" r="4" fill="currentColor" stroke="none" />
      <circle cx="8" cy="18" r="3.4" fill="currentColor" stroke="none" />
      <circle cx="92" cy="18" r="3.4" fill="currentColor" stroke="none" />
      <line x1="8" y1="52" x2="92" y2="52" />
    </svg>
  );
}
