"use client";

import { useCallback, useEffect, useRef } from "react";
import { useInvitation } from "@/components/InvitationProvider";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { InvitationData } from "@/types/invitation";

const CHANNEL = "vistiq-minang-v1";

/** Isolate the original visual CSS; all personal data and RSVP stay in Vistiq. */
export default function AdatMinang({ invitation }: { invitation: InvitationData }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const { setOpened } = useInvitation();
  const { entries, counts, hasMore, loadMore, submit } = useRsvpWishes(invitation.id);
  const busy = useRef(false);
  const send = useCallback((type: string, payload: Record<string, unknown> = {}) => {
    frame.current?.contentWindow?.postMessage({ channel: CHANNEL, type, ...payload }, window.location.origin);
  }, []);
  const initialize = useCallback(() => {
    const guest = new URLSearchParams(window.location.search).get("to") || "";
    send("init", { invitation, guest });
    send("wishes", { state: { entries, counts, hasMore } });
  }, [invitation, entries, counts, hasMore, send]);

  useEffect(() => {
    const receive = async (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== window.location.origin || event.data?.channel !== CHANNEL) return;
      if (event.data.type === "ready") initialize();
      else if (event.data.type === "opened") setOpened(true);
      else if (event.data.type === "loadMore") loadMore();
      else if (event.data.type === "submit" && !busy.current) {
        const input = event.data.input;
        if (!input || typeof input.name !== "string" || typeof input.message !== "string" || !input.name.trim() || !input.message.trim() || !["Hadir", "Tidak Hadir", "Masih Ragu"].includes(input.attendance)) {
          send("result", { error: "Nama, ucapan, dan kehadiran wajib diisi." });
          return;
        }
        if (!invitation.id) {
          send("result", { error: "Ini halaman demo. RSVP tersedia pada undangan klien." });
          return;
        }
        busy.current = true;
        try {
          const result = await submit({ name: input.name.trim(), message: input.message.trim(), whatsapp: "", attendance: input.attendance as Attendance });
          send("result", result);
        } catch {
          send("result", { error: "Gagal mengirim. Silakan coba lagi." });
        } finally {
          busy.current = false;
        }
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [initialize, invitation.id, loadMore, send, setOpened, submit]);

  useEffect(() => {
    send("wishes", { state: { entries, counts, hasMore } });
  }, [entries, counts, hasMore, send]);

  return <iframe ref={frame} src="/themes/adat-minang/index.html" title="Undangan Adat Minang" onLoad={initialize} allow="autoplay; clipboard-write" style={{ display: "block", width: "100%", height: "100dvh", border: 0 }} />;
}
