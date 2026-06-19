"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function WishForm({ invitationId }: { invitationId: number }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await supabase.from("wishes").insert({
      invitation_id: invitationId,
      guest_name: name,
      message,
    });

    setName("");
    setMessage("");
    setSuccess(true);
  }

  return (
    <form onSubmit={submit} style={form}>
      <input style={input} placeholder="Nama Anda" value={name} onChange={(e) => setName(e.target.value)} required />
      <textarea style={textarea} placeholder="Tulis ucapan dan doa terbaik" value={message} onChange={(e) => setMessage(e.target.value)} required />
      <button style={button}>Kirim Ucapan</button>
      {success && <p>Ucapan berhasil dikirim.</p>}
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
  minHeight: 120,
} as const;

const button = {
  padding: 15,
  borderRadius: 14,
  border: "none",
  background: "#c49b4f",
  color: "white",
  fontWeight: "bold",
} as const;