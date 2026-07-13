"use client";

import Reveal from "@/components/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import type { InvitationData } from "@/types/invitation";
import LotusMark from "./LotusMark";
import styles from "./style.module.css";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toCalendarStamp(date: Date) {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    "00Z"
  );
}

function buildCalendarLinks(invitation: InvitationData, rawDate: string) {
  const start = new Date(rawDate);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const title = `Pernikahan ${invitation.groom.name} & ${invitation.bride.name}`;
  const location = invitation.events[0]?.location || "";

  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${toCalendarStamp(start)}/${toCalendarStamp(end)}` +
    `&location=${encodeURIComponent(location)}`;

  const outlook =
    "https://outlook.office.com/owa/?path=%2Fcalendar%2Faction%2Fcompose" +
    `&subject=${encodeURIComponent(title)}` +
    `&startdt=${start.toISOString()}` +
    `&enddt=${end.toISOString()}` +
    `&location=${encodeURIComponent(location)}`;

  return { google, outlook };
}

export default function Countdown({
  invitation,
  targetDate,
  embedded = false,
}: {
  invitation: InvitationData;
  targetDate: string;
  embedded?: boolean;
}) {
  const time = useCountdown(targetDate);

  if (time.isPast) return null;

  const items = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  const { google, outlook } = buildCalendarLinks(invitation, targetDate);

  const body = (
    <>
      <div className={styles.countdownRow}>
        {items.map((item) => (
          <div className={styles.countdownPlaque} key={item.label}>
            <span className={styles.countdownValue}>{pad(item.value)}</span>
            <span className={styles.countdownLabel}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.saveDateRow}>
        <a
          className={styles.saveDateButton}
          href={google}
          target="_blank"
          rel="noreferrer"
        >
          Simpan ke Google Calendar
        </a>
        <a
          className={styles.saveDateButton}
          href={outlook}
          target="_blank"
          rel="noreferrer"
        >
          Simpan ke Outlook
        </a>
      </div>
    </>
  );

  if (embedded) {
    return <div className={styles.countdownEmbedded}>{body}</div>;
  }

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Hitung Mundur</p>
        <h2 className={styles.title}>Menuju Hari Bahagia</h2>
        <LotusMark className={styles.ornament} />
      </Reveal>

      <Reveal delay={0.1}>{body}</Reveal>
    </div>
  );
}
