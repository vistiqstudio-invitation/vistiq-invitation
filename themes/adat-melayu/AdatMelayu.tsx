"use client";

import { useCallback, useEffect, useRef } from "react";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import { prepareMelayu } from "./prepareMelayu";
import styles from "./style.module.css";

export default function AdatMelayu({ invitation }: { invitation: InvitationData }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const cleanup = useRef<(() => void) | undefined>(undefined);
  const { setOpened } = useInvitation();
  const load = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    cleanup.current?.();
    cleanup.current = prepareMelayu(doc, invitation, () => setOpened(true));
  }, [invitation, setOpened]);
  useEffect(() => () => cleanup.current?.(), []);
  return (
    <main className={styles.root}>
      <iframe ref={frame} className={styles.frame}
        src="/themes/adat-melayu/source.html"
        title={`Undangan ${invitation.groom.name} dan ${invitation.bride.name}`}
        allow="autoplay; fullscreen" onLoad={load} />
    </main>
  );
}
