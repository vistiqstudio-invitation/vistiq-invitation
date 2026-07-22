"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

// Lets an already-logged-in user set a new password directly via their
// live session (supabase.auth.updateUser) - no email link involved, so it
// can't be affected by mail-client link-prescanning invalidating one-time
// reset tokens (the recurring "link kedaluwarsa" problem with the email
// reset flow).
export default function ChangePasswordCard() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak sama.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      alert(`Gagal mengganti password: ${error.message}`);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    alert("Password berhasil diganti. Gunakan password baru ini saat login berikutnya.");
  };

  return (
    <section className={styles.formCard}>
      <h2 className={styles.sectionTitle}>Ganti Password</h2>
      <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b" }}>
        Berlaku langsung begitu disimpan, tidak perlu cek email.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <input
            type="password"
            placeholder="Password baru (min. 8 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            autoComplete="new-password"
          />

          <input
            type="password"
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className={styles.button} disabled={saving} style={{ marginTop: 16 }}>
          {saving ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
      </form>
    </section>
  );
}
