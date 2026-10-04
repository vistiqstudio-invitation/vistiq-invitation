"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isPlatformHostname } from "@/lib/customDomain";

type GateState = "checking" | "platform" | "redirecting" | "not_found";

export default function DomainStorefrontGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>("checking");

  useEffect(() => {
    const hostname = window.location.hostname;
    if (isPlatformHostname(hostname)) {
      const frame = window.requestAnimationFrame(() => setState("platform"));
      return () => window.cancelAnimationFrame(frame);
    }

    let active = true;
    const resolveTenant = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .rpc("get_reseller_by_custom_domain", { p_domain: hostname })
        .maybeSingle();
      const tenant = data as { reseller_id?: string } | null;

      if (!active) return;
      if (!tenant?.reseller_id) {
        setState("not_found");
        return;
      }

      setState("redirecting");
      window.location.replace(`/promo/${tenant.reseller_id}?tenant-domain=1`);
    };

    resolveTenant();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div style={state === "platform" ? undefined : { visibility: "hidden" }}>
        {children}
      </div>
      {state !== "platform" && (
        <div
          role="status"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "grid",
            placeItems: "center",
            padding: 24,
            background: "#f6faff",
            color: "#17324d",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div>
            <strong style={{ display: "block", fontSize: 20, marginBottom: 8 }}>
              {state === "not_found" ? "Katalog Tidak Ditemukan" : "Memuat katalog..."}
            </strong>
            <span style={{ color: "#64748b", fontSize: 14 }}>
              {state === "not_found"
                ? "Domain ini belum terhubung ke katalog yang aktif."
                : "Mohon tunggu sebentar."}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
