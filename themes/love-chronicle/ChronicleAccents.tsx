type AccentProps = { className?: string; text?: string };

export function PostalStamp({ className, text = "LOVE POST" }: AccentProps) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 120 145" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H116V141H4V4Z" className="stampPaper" />
        <path d="M13 13H107V132H13V13Z" className="stampLine" />
        <path d="M60 38C48 20 24 30 26 50C28 70 60 88 60 88C60 88 92 70 94 50C96 30 72 20 60 38Z" className="stampHeart" />
        <path d="M31 101H89M38 110H82" className="stampRule" />
        <text x="60" y="125" textAnchor="middle" className="stampText">{text}</text>
      </svg>
    </div>
  );
}

export function WaxSeal({ className, initials = "V" }: AccentProps & { initials?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 4L62 9L75 8L83 18L94 25L92 39L98 50L91 62L92 76L80 83L73 94L59 91L48 97L36 91L22 93L15 82L5 74L9 60L3 49L10 37L8 23L20 16L28 6L42 9Z" />
        <circle cx="50" cy="50" r="35" />
        <text x="50" y="63" textAnchor="middle">{initials}</text>
      </svg>
    </span>
  );
}

export function ChronicleRule({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <span />
      <i>◆</i>
      <b>THE WEDDING EDITION</b>
      <i>◆</i>
      <span />
    </div>
  );
}

