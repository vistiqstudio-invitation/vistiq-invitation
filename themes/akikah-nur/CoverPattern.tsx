import styles from "./style.module.css";

// Full-bleed scattered star/moon pattern behind the cover content - reads
// clearly even shrunk down to a ~150px phone-mockup thumbnail, unlike a
// single small ornament icon which disappears at that scale. Original
// tessellated pattern, not a reference asset.
export default function CoverPattern() {
  return (
    <svg
      className={styles.coverPattern}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="nurPattern" width="100" height="100" patternUnits="userSpaceOnUse">
          <path
            d="M78 14a16 16 0 1 0 11 27 13 13 0 0 1-11-27Z"
            fill="#c9a15a"
            opacity="0.5"
          />
          <path d="M24 40l1.6 4.4L30 46l-4.4 1.6L24 52l-1.6-4.4L18 46l4.4-1.6L24 40Z" fill="#5b8bb0" opacity="0.5" />
          <path d="M58 72l1.1 3 3 1.1-3 1.1-1.1 3-1.1-3-3-1.1 3-1.1 1.1-3Z" fill="#c9a15a" opacity="0.4" />
          <circle cx="12" cy="82" r="2" fill="#5b8bb0" opacity="0.4" />
          <circle cx="88" cy="90" r="1.6" fill="#c9a15a" opacity="0.45" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#nurPattern)" />
    </svg>
  );
}
