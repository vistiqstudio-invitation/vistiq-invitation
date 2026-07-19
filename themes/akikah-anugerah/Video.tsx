"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

function toEmbedUrl(url: string) {
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return url;
}

export default function Video({ invitation }: { invitation: AqiqahInvitationData }) {
  if (!invitation.videoUrl) return null;

  return (
    <div className={styles.section}>
      <Reveal>
        <h2 className={styles.title}>Video</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.mediaBox}>
          <iframe
            src={toEmbedUrl(invitation.videoUrl)}
            title="Video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Reveal>
    </div>
  );
}
