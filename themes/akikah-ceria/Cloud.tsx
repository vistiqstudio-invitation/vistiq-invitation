type Props = {
  className?: string;
};

// Original cloud silhouette (own artwork) - used as the countdown badge
// shape, filled via currentColor.
export default function Cloud({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 70"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M26 54C13 54 4 45 4 34C4 24 12 16 22 15C25 7 33 2 42 2C52 2 60 8 63 17C64 17 65 17 66 17C79 17 90 27 90 39C90 47 85 53 78 55C77 55 76 55 75 55L26 55Z"
        fill="currentColor"
      />
    </svg>
  );
}
