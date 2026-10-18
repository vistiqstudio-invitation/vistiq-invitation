"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ExpiredBrandGate() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const blockExpiredAccount = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();

      if (!active) return;

      alert("Masa aktif Mitra Brand Anda telah habis. Silakan hubungi admin untuk melakukan perpanjangan.");
      router.replace("/login");
      router.refresh();
    };

    blockExpiredAccount();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f8fbff",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          padding: 28,
          borderRadius: 20,
          background: "#fff",
          boxShadow: "0 18px 45px rgba(15, 78, 138, 0.12)",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0 0 10px", fontSize: 24, color: "#0f3658" }}>
          Masa Aktif Habis
        </h1>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#64748b" }}>
          Masa aktif Mitra Brand Anda telah habis. Silakan hubungi admin untuk melakukan perpanjangan.
        </p>
      </div>
    </main>
  );
}
