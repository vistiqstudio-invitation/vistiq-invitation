type Props = {
  variant?: "full" | "corner" | "divider";
  className?: string;
};

export default function AuroraAccents({ variant = "full", className }: Props) {
  if (variant === "divider") {
    return (
      <div className={className} aria-hidden="true">
        <svg viewBox="0 0 360 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 17C70 2 108 32 180 17C252 2 290 32 358 17" stroke="currentColor" strokeOpacity=".55" />
          <path d="M56 17H304" stroke="url(#auroraDivider)" strokeWidth="1.4" />
          <circle cx="180" cy="17" r="4" fill="currentColor" />
          <circle cx="180" cy="17" r="9" stroke="currentColor" strokeOpacity=".38" />
          <circle cx="80" cy="12" r="1.5" fill="currentColor" fillOpacity=".7" />
          <circle cx="280" cy="22" r="1.5" fill="currentColor" fillOpacity=".7" />
          <defs>
            <linearGradient id="auroraDivider" x1="56" y1="17" x2="304" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="currentColor" stopOpacity="0" />
              <stop offset=".5" stopColor="currentColor" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === "corner") {
    return (
      <svg className={className} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 174C11 75 68 14 174 8" stroke="currentColor" strokeOpacity=".5" />
        <path d="M28 174C30 89 83 35 174 28" stroke="currentColor" strokeOpacity=".2" />
        <circle cx="54" cy="80" r="3" fill="currentColor" />
        <circle cx="90" cy="42" r="2" fill="currentColor" fillOpacity=".75" />
        <circle cx="126" cy="20" r="1.5" fill="currentColor" fillOpacity=".6" />
        <path d="M44 92L54 80L74 68L90 42L112 34" stroke="currentColor" strokeOpacity=".28" strokeDasharray="2 6" />
        <path d="M18 130C35 125 42 117 48 100C54 117 62 125 78 130C62 135 54 143 48 160C42 143 35 135 18 130Z" fill="currentColor" fillOpacity=".22" />
      </svg>
    );
  }

  return (
    <div className={className} aria-hidden="true">
      <span data-band="violet" />
      <span data-band="cyan" />
      <span data-band="rose" />
      <i data-star="one" />
      <i data-star="two" />
      <i data-star="three" />
      <i data-star="four" />
      <i data-star="five" />
      <b data-orbit="outer" />
      <b data-orbit="inner" />
    </div>
  );
}
