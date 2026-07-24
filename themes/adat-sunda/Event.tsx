"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import SundaLattice from "./SundaLattice";
import styles from "./style.module.css";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function dateParts(rawDate: string) {
  const [datePart] = rawDate.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  return { day: String(d).padStart(2, "0"), month: MONTHS[m - 1] || "", year: y };
}

// rawDate is a naive "YYYY-MM-DDTHH:mm:00" local string with no timezone
// (see toRawDate() in lib/invitation.ts) - stamps are built by direct
// string manipulation rather than via Date/toISOString, which would
// silently convert through UTC and shift the time shown to guests.
function addHours(rawDate: string, hours: number) {
  const [datePart, timePart] = rawDate.split("T");
  const [h, m] = (timePart || "00:00:00").split(":").map(Number);

  let totalMinutes = h * 60 + m + hours * 60;
  let dayOffset = Math.floor(totalMinutes / (24 * 60));
  totalMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);

  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;

  const date = new Date(`${datePart}T00:00:00`);
  date.setDate(date.getDate() + dayOffset);
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}${mo}${d}T${String(newH).padStart(2, "0")}${String(newM).padStart(2, "0")}00`;
}

function calendarUrl(name: string, rawDate: string, location: string) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: name,
    dates: `${addHours(rawDate, 0)}/${addHours(rawDate, 3)}`,
    location,
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export default function Event({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Waktu &amp; Tempat</p>
        <h2 className={styles.title}>Rangkaian Upacara</h2>
        <SundaLattice className={styles.divider} />
      </Reveal>

      <div className={styles.eventGrid}>
        {invitation.events.map((event, index) => {
          const parts = event.rawDate ? dateParts(event.rawDate) : null;

          return (
            <Reveal key={event.name} delay={index * 0.15}>
              <div className={styles.eventCard}>
                <p className={styles.eventEyebrow}>Upacara Adat</p>

                {parts && (
                  <>
                    <p className={styles.eventNumeral}>{parts.day}</p>
                    <p className={styles.eventMonthYear}>
                      {parts.month} {parts.year}
                    </p>
                  </>
                )}

                <h3 className={styles.eventName}>{event.name}</h3>

                {event.time && (
                  <p className={styles.eventDetail}>
                    Pukul <strong>{event.time}</strong>
                  </p>
                )}

                {event.location && <p className={styles.eventDetail}>{event.location}</p>}

                <p className={styles.eventHint}>*Silakan klik tombol untuk membuka lokasi acara</p>

                {event.rawDate && (
                  <a
                    className={styles.eventCalendar}
                    href={calendarUrl(event.name, event.rawDate, event.location)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Simpan Tanggal
                  </a>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
