"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function OpeningScreen({
  groomName,
  brideName,
  eventDate,
}: {
  groomName: string;
  brideName: string;
  eventDate: string;
}) {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background:
          "linear-gradient(180deg, rgba(248,241,227,.95), rgba(255,250,241,.98))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
        color: "#6b4516",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          padding: "54px 28px",
          border: "1px solid rgba(212,175,55,.8)",
          borderRadius: "220px 220px 36px 36px",
          background: "rgba(255,255,255,.72)",
          boxShadow: "0 30px 80px rgba(94,58,12,.16)",
        }}
      >
        <p style={{ letterSpacing: 6, fontSize: 12, color: "#a8792a" }}>
          THE WEDDING OF
        </p>

        <h1 style={{ fontSize: 48, fontWeight: 400, lineHeight: 1.15 }}>
          {groomName}
          <br />&<br />
          {brideName}
        </h1>

        <p style={{ marginBottom: 34 }}>{eventDate}</p>

        <p style={{ marginBottom: 6 }}>Kepada Yth.</p>
        <h3 style={{ fontSize: 28, fontWeight: 400, marginTop: 0 }}>
          {guestName}
        </h3>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            marginTop: 28,
            border: "none",
            padding: "15px 36px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #a46f1d, #d8b35f, #a46f1d)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 14px 30px rgba(139,92,20,.28)",
          }}
        >
          Buka Undangan
        </button>
      </div>
    </div>
  );
}