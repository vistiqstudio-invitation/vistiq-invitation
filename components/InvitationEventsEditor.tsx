"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

type Mode = "reseller" | "client";

type EditableEvent = {
  name: string;
  date: string;
  time: string;
  location: string;
  mapsUrl: string;
};

const emptyEvent = (): EditableEvent => ({
  name: "",
  date: "",
  time: "",
  location: "",
  mapsUrl: "",
});

function dateInput(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  return match?.[0] || "";
}

function storedEvents(value: unknown): EditableEvent[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 4).map((item) => {
    const raw = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      name: typeof raw.name === "string" ? raw.name : "",
      date: dateInput(raw.date),
      time: typeof raw.time === "string" ? raw.time : "",
      location: typeof raw.location === "string" ? raw.location : "",
      mapsUrl: typeof raw.mapsUrl === "string" ? raw.mapsUrl : "",
    };
  });
}

function legacyEvents(invitation: Record<string, unknown>) {
  const result: EditableEvent[] = [];
  const akad: EditableEvent = {
    name: "Akad Nikah",
    date: dateInput(invitation.akad_date),
    time: typeof invitation.akad_time === "string" ? invitation.akad_time : "",
    location: typeof invitation.akad_location === "string" ? invitation.akad_location : "",
    mapsUrl: "",
  };
  const reception: EditableEvent = {
    name: "Resepsi",
    date: dateInput(invitation.resepsi_date),
    time: typeof invitation.reception_time === "string" ? invitation.reception_time : "",
    location:
      typeof invitation.reception_location === "string"
        ? invitation.reception_location
        : typeof invitation.resepsi_location === "string"
          ? invitation.resepsi_location
          : "",
    mapsUrl: typeof invitation.maps_url === "string" ? invitation.maps_url : "",
  };

  if (akad.date || akad.time || akad.location) result.push(akad);
  if (reception.date || reception.time || reception.location || reception.mapsUrl) result.push(reception);
  return result.length > 0 ? result : [{ ...emptyEvent(), name: "Akad Nikah" }, { ...emptyEvent(), name: "Resepsi" }];
}

export default function InvitationEventsEditor({
  mode,
  invitationId,
}: {
  mode: Mode;
  invitationId?: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("Undangan");
  const [events, setEvents] = useState<EditableEvent[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      if (!user) {
        router.replace("/login");
        return;
      }

      let row: Record<string, unknown> | null = null;

      if (mode === "reseller") {
        const { data: reseller } = await supabase
          .from("resellers")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!reseller || !invitationId) {
          setError("Undangan tidak ditemukan.");
          setLoading(false);
          return;
        }

        const { data: invitation } = await supabase
          .from("invitations")
          .select("id, client_id, slug, category, groom_name, bride_name, events, cover_event_index, akad_date, akad_time, akad_location, resepsi_date, reception_time, reception_location, resepsi_location, maps_url, clients!inner(reseller_id)")
          .eq("id", invitationId)
          .eq("clients.reseller_id", reseller.id)
          .maybeSingle();
        row = invitation as Record<string, unknown> | null;
      } else {
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!client) {
          setError("Akun client belum terhubung.");
          setLoading(false);
          return;
        }

        const { data: invitation } = await supabase
          .from("invitations")
          .select("id, slug, category, groom_name, bride_name, events, cover_event_index, akad_date, akad_time, akad_location, resepsi_date, reception_time, reception_location, resepsi_location, maps_url")
          .eq("client_id", client.id)
          .maybeSingle();
        row = invitation as Record<string, unknown> | null;
      }

      if (!row || row.category !== "wedding") {
        setError("Fitur beberapa acara saat ini tersedia untuk undangan wedding.");
        setLoading(false);
        return;
      }

      if (cancelled) return;
      const saved = storedEvents(row.events);
      setEvents(saved.length > 0 ? saved : legacyEvents(row));
      setCoverIndex(
        typeof row.cover_event_index === "number" && row.cover_event_index >= 0
          ? Math.min(row.cover_event_index, Math.max((saved.length || legacyEvents(row).length) - 1, 0))
          : saved.length > 1
            ? 1
            : 0,
      );
      setSlug(typeof row.slug === "string" ? row.slug : "");
      const groom = typeof row.groom_name === "string" ? row.groom_name : "";
      const bride = typeof row.bride_name === "string" ? row.bride_name : "";
      setTitle([groom, bride].filter(Boolean).join(" & ") || "Undangan Wedding");
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [invitationId, mode, router, supabase]);

  const setEvent = (index: number, field: keyof EditableEvent, value: string) => {
    setEvents((current) =>
      current.map((event, eventIndex) =>
        eventIndex === index ? { ...event, [field]: value } : event,
      ),
    );
  };

  const addEvent = () => {
    if (events.length >= 4) return;
    setEvents((current) => [...current, emptyEvent()]);
  };

  const removeEvent = (index: number) => {
    setEvents((current) => current.filter((_, eventIndex) => eventIndex !== index));
    setCoverIndex((current) => {
      if (current === index) return 0;
      if (current > index) return current - 1;
      return current;
    });
  };

  const moveEvent = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= events.length) return;
    setEvents((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setCoverIndex((current) => {
      if (current === index) return target;
      if (current === target) return index;
      return current;
    });
  };

  const save = async () => {
    const cleaned = events
      .slice(0, 4)
      .map((event) => ({
        name: event.name.trim(),
        date: event.date.trim(),
        time: event.time.trim(),
        location: event.location.trim(),
        mapsUrl: event.mapsUrl.trim(),
      }))
      .filter((event) => event.name || event.date || event.time || event.location || event.mapsUrl);

    if (cleaned.length === 0) {
      alert("Isi minimal satu acara.");
      return;
    }

    if (cleaned.some((event) => !event.name)) {
      alert("Setiap acara yang digunakan wajib memiliki nama acara.");
      return;
    }

    const safeCoverIndex = Math.min(Math.max(coverIndex, 0), cleaned.length - 1);
    const first = cleaned[0];
    const second = cleaned[1];
    const cover = cleaned[safeCoverIndex];

    setSaving(true);
    setError("");

    let query = supabase
      .from("invitations")
      .update({
        events: cleaned,
        cover_event_index: safeCoverIndex,
        // Keep legacy fields in sync as a safety net for older theme code.
        akad_date: first?.date || null,
        akad_time: first?.time || "",
        akad_location: first?.location || "",
        resepsi_date: second?.date || null,
        reception_time: second?.time || "",
        reception_location: second?.location || "",
        maps_url: cover?.mapsUrl || cleaned.find((event) => event.mapsUrl)?.mapsUrl || "",
      });

    if (mode === "reseller") query = query.eq("id", invitationId || "");
    else if (slug) query = query.eq("slug", slug);

    const { error: saveError } = await query;
    setSaving(false);

    if (saveError) {
      setError(`Gagal menyimpan acara: ${saveError.message}`);
      return;
    }

    setEvents(cleaned);
    setCoverIndex(safeCoverIndex);
    alert("Daftar acara berhasil disimpan.");
  };

  if (loading) {
    return <main className={styles.editPage}><h2>Memuat acara...</h2></main>;
  }

  return (
    <main className={styles.editPage}>
      <div className={styles.editCard}>
        <div className={styles.editHeader}>
          <div>
            <p className={styles.label}>{mode === "reseller" ? "RESELLER DASHBOARD" : "CLIENT DASHBOARD"}</p>
            <h1 className={styles.title} style={{ fontSize: 34 }}>Kelola Acara</h1>
            <p className={styles.subtitle}>{title} · maksimal 4 acara</p>
          </div>
          <button
            className={styles.secondaryButton}
            onClick={() => router.push(mode === "reseller" ? `/reseller/invitations/${invitationId}` : "/client/edit")}
          >
            Kembali ke Editor
          </button>
        </div>

        {error && <p style={{ color: "#b91c1c", marginBottom: 16 }}>{error}</p>}

        {!error && (
          <>
            <p className={styles.helpText}>
              Nama acara bebas, misalnya Akad Nikah, Resepsi, Ngunduh Mantu, Pemberkatan, Acara Adat, atau After Party. Pilih satu sebagai acara utama untuk tanggal cover.
            </p>

            <div style={{ display: "grid", gap: 18, marginTop: 18 }}>
              {events.map((event, index) => (
                <section
                  key={index}
                  style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 16, background: "#fff" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                    <strong>Acara {index + 1}</strong>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 14 }}>
                        <input
                          type="radio"
                          name="cover-event"
                          checked={coverIndex === index}
                          onChange={() => setCoverIndex(index)}
                        />
                        Acara utama / cover
                      </label>
                      <button type="button" className={styles.secondaryButton} onClick={() => moveEvent(index, -1)} disabled={index === 0}>↑</button>
                      <button type="button" className={styles.secondaryButton} onClick={() => moveEvent(index, 1)} disabled={index === events.length - 1}>↓</button>
                      {events.length > 1 && (
                        <button type="button" className={styles.secondaryButton} onClick={() => removeEvent(index)}>Hapus</button>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <input
                      className={styles.input}
                      placeholder="Nama acara, contoh: Ngunduh Mantu"
                      value={event.name}
                      onChange={(e) => setEvent(index, "name", e.target.value)}
                    />
                    <input
                      className={styles.input}
                      type="date"
                      value={event.date}
                      onChange={(e) => setEvent(index, "date", e.target.value)}
                    />
                    <input
                      className={styles.input}
                      placeholder="Jam, contoh: 10.00 WIB"
                      value={event.time}
                      onChange={(e) => setEvent(index, "time", e.target.value)}
                    />
                    <input
                      className={styles.input}
                      placeholder="Lokasi acara"
                      value={event.location}
                      onChange={(e) => setEvent(index, "location", e.target.value)}
                    />
                    <input
                      className={styles.input}
                      style={{ gridColumn: "1 / -1" }}
                      placeholder="Google Maps acara ini (opsional)"
                      value={event.mapsUrl}
                      onChange={(e) => setEvent(index, "mapsUrl", e.target.value)}
                    />
                  </div>
                </section>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              {events.length < 4 && (
                <button type="button" className={styles.secondaryButton} onClick={addEvent}>
                  + Tambah Acara
                </button>
              )}
              <button type="button" className={styles.primaryButton} onClick={save} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Daftar Acara"}
              </button>
              {slug && mode === "reseller" && (
                <button type="button" className={styles.secondaryButton} onClick={() => window.open(`/preview/${slug}`, "_blank")}>
                  Preview Undangan
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
