"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function RSVP({ invitation }: { invitation: InvitationData }) {
  const { counts, submit, submitting, submitted } = useRsvpWishes(invitation.id);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !message.trim()) {
      setError("Nama dan ucapan wajib diisi.");
      return;
    }

    const result = await submit({ name, whatsapp, attendance, message });

    if (result.error) {
      setError(result.error);
      return;
    }

    setName("");
    setWhatsapp("");
    setAttendance("Hadir");
    setMessage("");
  };

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>RSVP</p>
        <h2 className={styles.title}>Konfirmasi Kehadiran</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.divider} src="/decor/adat-bali/divider.png" alt="" aria-hidden="true" />
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.rsvpCounts}>
          <div className={styles.rsvpCount}>
            <span className={styles.rsvpCountValue}>{counts.hadir}</span>
            <span className={styles.rsvpCountLabel}>Hadir</span>
          </div>

          <div className={styles.rsvpCount}>
            <span className={styles.rsvpCountValue}>{counts.tidakHadir}</span>
            <span className={styles.rsvpCountLabel}>Tidak Hadir</span>
          </div>

          <div className={styles.rsvpCount}>
            <span className={styles.rsvpCountValue}>{counts.raguRagu}</span>
            <span className={styles.rsvpCountLabel}>Masih Ragu</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        {submitted ? (
          <p className={styles.formMessage}>
            Suksma, konfirmasi dan ucapan Anda sudah terkirim.
          </p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              className={styles.input}
              placeholder="Nomor WhatsApp (opsional)"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />

            <select
              className={styles.select}
              value={attendance}
              onChange={(e) => setAttendance(e.target.value as Attendance)}
            >
              <option>Hadir</option>
              <option>Tidak Hadir</option>
              <option>Masih Ragu</option>
            </select>

            <textarea
              className={styles.textarea}
              placeholder="Ucapan dan doa untuk kedua mempelai"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button
              className={`${styles.button} ${styles.solid}`}
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Mengirim..." : "Kirim RSVP"}
            </button>

            {error && <p className={styles.formError}>{error}</p>}
          </form>
        )}
      </Reveal>
    </div>
  );
}
