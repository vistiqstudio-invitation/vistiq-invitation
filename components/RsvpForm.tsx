"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function RsvpForm({ invitation }: { invitation?: any }) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("Hadir");
  const [totalGuest, setTotalGuest] = useState(1);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!supabase) {
      setError(
        "RSVP belum aktif: konfigurasi database belum lengkap. Silakan hubungi admin."
      );
      return;
    }

    const { error: insertError } = await supabase.from("rsvp").insert({
      invitation_id: invitation?.id ?? null,
      invitation_slug: invitation?.slug ?? null,
      guest_name: name,
      attendance,
      total_guest: totalGuest,
      message,
    });

    if (insertError) {
      setError("Gagal mengirim RSVP. Silakan coba lagi.");
      return;
    }

    setName("");
    setAttendance("Hadir");
    setTotalGuest(1);
    setMessage("");
    setSuccess(true);
  }

  return (
    <form onSubmit={submit} style={form}>
      <input style={input} placeholder="Nama Anda" value={name} onChange={(e) => setName(e.target.value)} required />
      <input style={input} type="number" min={1} value={totalGuest} onChange={(e) => setTotalGuest(Number(e.target.value))} />
      <textarea style={textarea} placeholder="Pesan untuk mempelai" value={message} onChange={(e) => setMessage(e.target.value)} />
      <select style={input} value={attendance} onChange={(e) => setAttendance(e.target.value)}>
        <option>Hadir</option>
        <option>Masih Ragu</option>
        <option>Tidak Hadir</option>
      </select>
      <button style={button}>Kirim RSVP</button>
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {success && <p>Terima kasih, konfirmasi Anda sudah terkirim.</p>}
    </form>
  );
}

const form = {
  maxWidth: 520,
  margin: "30px auto",
  display: "grid",
  gap: 14,
  background: "white",
  padding: 28,
  borderRadius: 28,
  border: "1px solid #d2b46d",
} as const;

const input = {
  padding: 15,
  borderRadius: 14,
  border: "1px solid #d2b46d",
  fontSize: 16,
} as const;

const textarea = {
  ...input,
  minHeight: 110,
} as const;

const button = {
  padding: 15,
  borderRadius: 14,
  border: "none",
  background: "#c49b4f",
  color: "white",
  fontWeight: "bold",
} as const;