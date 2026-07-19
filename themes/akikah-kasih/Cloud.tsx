export default function Cloud({ className, color = "#fff" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 60" fill="none" aria-hidden="true">
      <path
        d="M20 46c-9 0-16-6.5-16-15 0-7.8 6-14 13.6-14.8C20.4 8 27.7 2 36.5 2c9.6 0 17.6 6.8 19.4 15.8C64 18.6 70 25.4 70 33.6 70 42 63 49 54 49H20z"
        fill={color}
      />
    </svg>
  );
}
