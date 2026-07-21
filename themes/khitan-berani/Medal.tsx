// Original medal-and-ribbon badge - the signature motif of this "anak
// pemberani" (brave child) khitan theme, distinct from khitan-warna's
// medallion, khitan-ksatria's laurel crest, and khitan-raja's crown.
export default function Medal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 110" fill="none" aria-hidden="true">
      <path d="M30 34 L14 76 L34 68 L42 86 L58 44Z" fill="#FF6F5E" />
      <path d="M70 34 L86 76 L66 68 L58 86 L42 44Z" fill="#2F7FB0" />
      <circle cx="50" cy="42" r="30" fill="#FFC93C" stroke="#fff" strokeWidth="4" />
      <circle cx="50" cy="42" r="21" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="4 5" />
      <path
        d="M50 30 L54 39 L64 40 L56.5 47 L58.5 57 L50 52 L41.5 57 L43.5 47 L36 40 L46 39Z"
        fill="#fff"
      />
    </svg>
  );
}
