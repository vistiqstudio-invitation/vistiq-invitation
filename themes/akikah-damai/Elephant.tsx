export default function Elephant({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27 55c-8 0-14-6.5-14-15 0-7.5 5.5-13.5 12.5-14.7C28 15 38 8 50 8c14 0 25 10 27.5 23 6 1.5 10.5 7 10.5 13.5 0 7.7-6.3 14-14 14h-2v9c0 4-3 7-7 7h-3v6c0 2-1.5 3.5-3.5 3.5S54.5 82 54.5 80v-6H45v6c0 2-1.5 3.5-3.5 3.5S38 82 38 80v-6h-3c-4 0-7-3-7-7v-8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 55c-3 4-4 9-3 15"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="63" cy="30" r="2.4" fill="currentColor" />
      <path
        d="M74 39c3 1.5 4.5 4.5 4 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
