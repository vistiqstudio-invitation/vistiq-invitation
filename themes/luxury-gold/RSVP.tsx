"use client";

import { useState } from "react";
import styles from "./style.module.css";

type Props = {
  invitation: any;
};

export default function RSVP({ invitation }: Props) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [attendance, setAttendance] = useState("Hadir");
  const [message, setMessage] = useState("");

  const submitRSVP = async () => {
    if (!name) {
      alert("Nama wajib diisi.");
      return;
    }

    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitation_id: invitation?.id,
          name,
          whatsapp,
          attendance,
          message,
        }),
      });

      alert("Terima kasih atas konfirmasinya.");

      setName("");
      setWhatsapp("");
      setAttendance("Hadir");
      setMessage("");
    } catch {
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <section className={styles.rsvp}>
      <div className={styles.container}>

        <p className={styles.sectionLabel}>
          RSVP
        </p>

        <h2 className={styles.sectionTitle}>
          Konfirmasi Kehadiran
        </h2>

        <div className={styles.form}>

          <input
            placeholder="Nama"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e)=>setWhatsapp(e.target.value)}
          />

          <select
            value={attendance}
            onChange={(e)=>setAttendance(e.target.value)}
          >
            <option>Hadir</option>
            <option>Tidak Hadir</option>
            <option>Masih Ragu</option>
          </select>

          <textarea
            placeholder="Ucapan"
            rows={5}
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
          />

          <button onClick={submitRSVP}>
            Kirim RSVP
          </button>

        </div>

      </div>
    </section>
  );
}