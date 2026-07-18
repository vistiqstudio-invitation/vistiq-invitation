"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import { khitanThemeList } from "@/lib/theme";

function useMockupWidth() {
  const [width, setWidth] = useState(150);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setWidth(mq.matches ? 84 : 150);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return width;
}

export default function KhitanThemeGrid() {
  const mockupWidth = useMockupWidth();

  return (
    <div className="themeGrid">
      {khitanThemeList.map((theme) => (
        <Link href={`/demo-khitan/${theme.key}`} className="themeCard" key={theme.key}>
          <PhoneMockup
            themeKey={theme.key}
            width={mockupWidth}
            className="themePreview"
            demoPath="/demo-khitan"
          />
          <h3>{theme.label}</h3>
          <p>{theme.description}</p>
        </Link>
      ))}
    </div>
  );
}
