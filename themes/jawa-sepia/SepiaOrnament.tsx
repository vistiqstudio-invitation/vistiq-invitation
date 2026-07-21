export default function SepiaOrnament({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 120" fill="none" aria-hidden="true">
      <path d="M12 108C48 108 44 24 112 38c24 5 31 30 48 30s24-25 48-30c68-14 64 70 100 70" />
      <path d="M48 96c18-10 20-34 12-48 18 0 36 12 42 30M272 96c-18-10-20-34-12-48-18 0-36 12-42 30" />
      <path d="M160 14l12 20-12 20-12-20 12-20Z" />
      <circle cx="160" cy="68" r="5" />
      <path d="M132 86c10-10 18-12 28-4 10-8 18-6 28 4" />
    </svg>
  );
}
