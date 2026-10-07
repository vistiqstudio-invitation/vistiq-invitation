"use client";

import { usePathname, useRouter } from "next/navigation";

export default function InvitationEventsShortcut({ mode }: { mode: "reseller" | "client" }) {
  const pathname = usePathname();
  const router = useRouter();

  let href: string | null = null;

  if (mode === "reseller") {
    const match = pathname.match(/^\/reseller\/invitations\/([^/]+)$/);
    if (match) href = `/reseller/invitations/${match[1]}/events`;
  } else if (pathname === "/client/edit") {
    href = "/client/events";
  }

  if (!href) return null;

  return (
    <button
      type="button"
      onClick={() => router.push(href!)}
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 9999,
        border: 0,
        borderRadius: 999,
        padding: "12px 18px",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        background: "#0f172a",
        color: "white",
        boxShadow: "0 10px 30px rgba(15, 23, 42, .22)",
      }}
      aria-label="Kelola beberapa acara"
    >
      + Kelola Acara
    </button>
  );
}
