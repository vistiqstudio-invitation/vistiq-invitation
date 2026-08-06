"use client";

import PhoneMockup from "@/components/PhoneMockup";

const DEMO_PATH: Record<string, string> = {
  wedding: "/demo",
  aqiqah: "/demo-akikah",
  khitan: "/demo-khitan",
  birthday: "/demo-ulang-tahun",
};

// Live preview shown next to a theme <select> across the create/edit forms
// (client, reseller, admin) - so picking a theme by name isn't a guess.
export default function ThemePreviewPanel({
  category,
  themeKey,
}: {
  category: string;
  themeKey: string;
}) {
  if (!themeKey) return null;

  const demoPath = DEMO_PATH[category] ?? "/demo";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "16px 0",
      }}
    >
      <PhoneMockup themeKey={themeKey} demoPath={demoPath} width={160} />
      <a
        href={`${demoPath}/${themeKey}`}
        target="_blank"
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: "#1167b2",
          textDecoration: "none",
        }}
      >
        Lihat Demo Penuh ↗
      </a>
    </div>
  );
}
