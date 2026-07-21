// Original thin-line eagle emblem - the signature motif of this modern
// minimalist khitan theme, distinct from khitan-warna's medallion,
// khitan-ksatria's laurel crest, khitan-raja's crown, khitan-berani's
// medal, and khitan-petualang's compass.
export default function Eagle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 70" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M50 20 C40 8, 20 4, 2 10 C16 14, 26 20, 34 30 C20 28, 6 32, 0 42 C14 38, 28 38, 38 44 C28 48, 20 56, 18 66 C28 58, 38 52, 48 50" />
      <path d="M50 20 C60 8, 80 4, 98 10 C84 14, 74 20, 66 30 C80 28, 94 32, 100 42 C86 38, 72 38, 62 44 C72 48, 80 56, 82 66 C72 58, 62 52, 52 50" />
      <circle cx="50" cy="22" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}
