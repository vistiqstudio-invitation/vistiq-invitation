// Original compass-rose line-art - the signature motif of this "little
// adventurer" khitan theme, distinct from khitan-warna's medallion,
// khitan-ksatria's laurel crest, khitan-raja's crown, and khitan-
// berani's medal.
export default function Compass({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="50" cy="50" r="44" />
      <circle cx="50" cy="50" r="34" strokeDasharray="2 5" />
      <path d="M50 12 L57 45 L50 50 L43 45 Z" fill="currentColor" stroke="none" />
      <path d="M50 88 L43 55 L50 50 L57 55 Z" fill="none" />
      <path d="M12 50 L45 43 L50 50 L45 57 Z" fill="none" />
      <path d="M88 50 L55 57 L50 50 L55 43 Z" fill="none" />
      <circle cx="50" cy="50" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}
