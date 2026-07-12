type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// The curved, upswept twin-horn roofline of a rumah gadang (gonjong) -
// this theme's one strong architectural shape, used sparingly at the
// cover crown and couple frame rather than repeated as a border.
export default function GonjongRoof({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 280 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 88 C 10 60, 26 20, 46 4 C 50 14, 44 34, 34 88 Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M76 88 C 82 54, 96 16, 112 2 C 117 14, 108 40, 100 88 Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M140 88 L140 46 C 140 24, 148 8, 160 0 C 172 8, 180 24, 180 46 L180 88 Z"
        fill="currentColor"
      />
      <path
        d="M180 88 C 184 40, 193 14, 204 2 C 216 16, 222 54, 228 88 Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M246 88 C 250 34, 246 14, 234 4 C 254 20, 270 60, 278 88 Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}
