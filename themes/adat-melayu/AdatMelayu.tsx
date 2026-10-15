"use client";

import { useCallback, useEffect, useRef } from "react";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import { prepareMelayu } from "./prepareMelayu";
import styles from "./style.module.css";

export default function AdatMelayu({ invitation }: { invitation: InvitationData }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const cleanup = useRef<(() => void) | undefined>(undefined);
  const prepared = useRef<{ doc: Document; invitation: InvitationData } | null>(null);
  const { setOpened } = useInvitation();
  const load = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (!doc || !doc.querySelector("#sec")) return;
    if (prepared.current?.doc === doc && prepared.current.invitation === invitation) return;
    cleanup.current?.();
    cleanup.current = prepareMelayu(doc, invitation, () => setOpened(true));
    prepared.current = { doc, invitation };
  }, [invitation, setOpened]);
  useEffect(() => {
    // The static iframe can finish before React hydrates and attaches onLoad.
    if (frame.current?.contentDocument?.readyState === "complete") load();
    return () => { cleanup.current?.(); prepared.current = null; };
  }, [load]);
  return (
    <main className={styles.root}>
      <iframe ref={frame} className={styles.frame}
        src="/themes/adat-melayu/source.html"
        title={`Undangan ${invitation.groom.name} dan ${invitation.bride.name}`}
        allow="autoplay; fullscreen" onLoad={load} />
    </main>
  );
}
