// Small, dependency-free stroke icons for dashboard sidebars. Plain SVG so
// there's no new npm package to install - each one is sized to sit inline
// with a nav label (18x18, currentColor so it follows the button's text
// color in both active and inactive states).

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconDashboard() {
  return (
    <svg {...base}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

export function IconInvitation() {
  return (
    <svg {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </svg>
  );
}

export function IconUsers() {
  return (
    <svg {...base}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.5 14.3c2.4.3 4.2 2.3 4.7 5.2" />
    </svg>
  );
}

export function IconWallet() {
  return (
    <svg {...base}>
      <rect x="3" y="6" width="18" height="13" rx="2.2" />
      <path d="M3 9.5h18" />
      <circle cx="16.5" cy="14" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPalette() {
  return (
    <svg {...base}>
      <path d="M12 3.5c-4.7 0-8.5 3.6-8.5 8 0 3.3 2.6 4.6 4.6 4.6.8 0 1.2-.5 1.2-1.1 0-.5-.4-1-.4-1.7 0-1.1.9-2 2.2-2h2c2.7 0 5.4-1.9 5.4-5.4 0-3.6-3-6.4-6.5-6.4z" />
      <circle cx="7.6" cy="10.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.4" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.8" cy="10.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGlobe() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.6 2.3 4 5.3 4 8.5s-1.4 6.2-4 8.5c-2.6-2.3-4-5.3-4-8.5s1.4-6.2 4-8.5z" />
    </svg>
  );
}

export function IconRsvp() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.3 2.3 4.7-5" />
    </svg>
  );
}
