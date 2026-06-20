"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const BUCKET = "invitation-assets";

type PhotoField = "cover_photo" | "bride_photo" | "groom_photo";

export default function ClientEditPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [invitationId, setInvitationId] = useState("");

  const [form, setForm] = useState({
    groom_name: "",
    bride_name: "",
    event_date: "",
    akad_location: "",
    reception_location: "",
    maps_url: "",
    bank_name: "",
    bank_account: "",
    bank_holder: "",
    music_url: "",
    cover_photo: "",
    bride_photo: "",
    groom_photo: "",
    gallery_photos: [] as string[],
  });

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    loadInvitation();
  }, []);

  const loadInvitation = async () => {
    try {
      const savedUser = localStorage.getItem("vistiq_user");

      if (!savedUser) {
        router.push("/admin-login");
        return;
      }

      const user = JSON.parse(savedUser);

      if (user.role !== "client") {
        router.push("/admin-login");
        return;
      }

      const clientRes = await fetch(
        `${SUPABASE_URL}/rest/v1/clients?user_id=eq.${user.id}&select=*`,
        { headers }
      );

      const clients = await clientRes.json();

      if (!Array.isArray(clients) || clients.length === 0) {
        setLoading(false);
        return;
      }

      const invitationRes = await fetch(
        `${SUPABASE_URL}/rest/v1/invitations?client_id=eq.${clients[0].id}&select=*`,
        { headers }
      );

      const invitations = await invitationRes.json();

      if (!Array.isArray(invitations) || invitations.length === 0) {
        setLoading(false);
        return;
      }

      const invitation = invitations[0];

      setInvitationId(invitation.id);

      setForm({
        groom_name: invitation.groom_name || "",
        bride_name: invitation.bride_name || "",
        event_date: invitation.event_date || "",
        akad_location: invitation.akad_location || "",
        reception_location: invitation.reception_location || "",
        maps_url: invitation.maps_url || "",
        bank_name: invitation.bank_name || "",
        bank_account: invitation.bank_account || "",
        bank_holder: invitation.bank_holder || "",
        music_url: invitation.music_url || "",
        cover_photo: invitation.cover_photo || "",
        bride_photo: invitation.bride_photo || "",
        groom_photo: invitation.groom_photo || "",
        gallery_photos: Array.isArray(invitation.gallery_photos)
          ? invitation.gallery_photos
          : [],
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const uploadToStorage = async (file: File, folder: string) => {
    if (!invitationId) {
      alert("Undangan tidak ditemukan.");
      return "";
    }

    const ext = file.name.split(".").pop();
    const fileName = `${invitationId}/${folder}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": file.type,
        },
        body: file,
      }
    );

    if (!uploadRes.ok) {
      alert("Upload gagal. Cek policy Storage Supabase.");
      return "";
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
  };

  const uploadSingleFile = async (file: File, field: PhotoField) => {
    const publicUrl = await uploadToStorage(file, field);
    if (!publicUrl) return;

    setForm((prev) => ({
      ...prev,
      [field]: publicUrl,
    }));

    alert("Foto berhasil diupload. Klik Simpan Perubahan.");
  };

  const uploadGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    if (form.gallery_photos.length + selectedFiles.length > 10) {
      alert("Maksimal 10 foto gallery.");
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const url = await uploadToStorage(file, "gallery");
      if (url) uploadedUrls.push(url);
    }

    setForm((prev) => ({
      ...prev,
      gallery_photos: [...prev.gallery_photos, ...uploadedUrls],
    }));

    alert(`${uploadedUrls.length} foto gallery berhasil diupload.`);
  };

  const removeGalleryPhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery_photos: prev.gallery_photos.filter((_, i) => i !== index),
    }));
  };

  const saveData = async () => {
    if (!invitationId) {
      alert("Undangan tidak ditemukan.");
      return;
    }

    setSaving(true);

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/invitations?id=eq.${invitationId}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(form),
      }
    );

    setSaving(false);

    if (!res.ok) {
      alert("Gagal menyimpan data.");
      return;
    }

    alert("Data undangan berhasil disimpan.");
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <h2>Memuat data...</h2>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <p style={styles.label}>CLIENT DASHBOARD</p>
            <h1 style={styles.title}>Edit Undangan</h1>
            <p style={styles.subtitle}>
              Ubah data undangan dan upload foto langsung dari dashboard.
            </p>
          </div>

          <button
            onClick={() => router.push("/client")}
            style={styles.secondaryButton}
          >
            Kembali
          </button>
        </div>

        <h2 style={styles.sectionTitle}>Data Mempelai</h2>

        <div style={styles.grid}>
          <input
            placeholder="Nama Mempelai Pria"
            value={form.groom_name}
            onChange={(e) => setForm({ ...form, groom_name: e.target.value })}
            style={styles.input}
          />

          <input
            placeholder="Nama Mempelai Wanita"
            value={form.bride_name}
            onChange={(e) => setForm({ ...form, bride_name: e.target.value })}
            style={styles.input}
          />

          <input
            type="date"
            value={form.event_date}
            onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            style={styles.input}
          />
        </div>

        <h2 style={styles.sectionTitle}>Lokasi Acara</h2>

        <div style={styles.grid}>
          <input
            placeholder="Lokasi Akad"
            value={form.akad_location}
            onChange={(e) =>
              setForm({ ...form, akad_location: e.target.value })
            }
            style={styles.input}
          />

          <input
            placeholder="Lokasi Resepsi"
            value={form.reception_location}
            onChange={(e) =>
              setForm({ ...form, reception_location: e.target.value })
            }
            style={styles.input}
          />

          <input
            placeholder="Google Maps URL"
            value={form.maps_url}
            onChange={(e) => setForm({ ...form, maps_url: e.target.value })}
            style={styles.input}
          />
        </div>

        <h2 style={styles.sectionTitle}>Amplop Digital & Musik</h2>

        <div style={styles.grid}>
          <input
            placeholder="Nama Bank"
            value={form.bank_name}
            onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
            style={styles.input}
          />

          <input
            placeholder="Nomor Rekening"
            value={form.bank_account}
            onChange={(e) =>
              setForm({ ...form, bank_account: e.target.value })
            }
            style={styles.input}
          />

          <input
            placeholder="Atas Nama"
            value={form.bank_holder}
            onChange={(e) => setForm({ ...form, bank_holder: e.target.value })}
            style={styles.input}
          />

          <input
            placeholder="URL Musik MP3"
            value={form.music_url}
            onChange={(e) => setForm({ ...form, music_url: e.target.value })}
            style={styles.input}
          />
        </div>

        <h2 style={styles.sectionTitle}>Upload Foto Utama</h2>

        <div style={styles.uploadGrid}>
          <UploadBox
            title="Foto Cover"
            value={form.cover_photo}
            onUpload={(file) => uploadSingleFile(file, "cover_photo")}
          />

          <UploadBox
            title="Foto Mempelai Wanita"
            value={form.bride_photo}
            onUpload={(file) => uploadSingleFile(file, "bride_photo")}
          />

          <UploadBox
            title="Foto Mempelai Pria"
            value={form.groom_photo}
            onUpload={(file) => uploadSingleFile(file, "groom_photo")}
          />
        </div>

        <h2 style={styles.sectionTitle}>Galeri Foto</h2>

        <div style={styles.galleryUploadBox}>
          <p style={styles.helpText}>
            Upload maksimal 10 foto galeri. Foto akan tampil di undangan setelah
            klik Simpan Perubahan.
          </p>

          <label
            style={styles.galleryDropZone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              uploadGalleryFiles(e.dataTransfer.files);
            }}
          >
            <div style={styles.uploadIcon}>☁</div>
            <strong>Drag & drop foto galeri di sini</strong>
            <span>atau klik untuk pilih file</span>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => uploadGalleryFiles(e.target.files)}
              style={styles.hiddenInput}
            />
          </label>

          <p style={styles.galleryCounter}>
            Maksimal 10 foto • Saat ini: {form.gallery_photos.length} foto
          </p>

          <div style={styles.galleryGrid}>
            {form.gallery_photos.length === 0 ? (
              <div style={styles.emptyGallery}>Belum ada foto galeri</div>
            ) : (
              form.gallery_photos.map((photo, index) => (
                <div key={photo} style={styles.galleryItem}>
                  <img
                    src={photo}
                    alt={`Gallery ${index + 1}`}
                    style={styles.galleryImage}
                  />

                  <button
                    type="button"
                    onClick={() => removeGalleryPhoto(index)}
                    style={styles.deleteButton}
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button onClick={saveData} style={styles.button}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </main>
  );
}

function UploadBox({
  title,
  value,
  onUpload,
}: {
  title: string;
  value: string;
  onUpload: (file: File) => void;
}) {
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div style={styles.uploadBox}>
      <strong>{title}</strong>

      <label
        style={styles.dropZone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {value ? (
          <img src={value} alt={title} style={styles.preview} />
        ) : (
          <div style={styles.dropContent}>
            <div style={styles.uploadIcon}>☁</div>
            <strong>Drag & drop foto di sini</strong>
            <span>atau klik untuk pilih file</span>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
          style={styles.hiddenInput}
        />
      </label>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    padding: "40px",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#0f172a",
  },

  card: {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "28px",
  },

  label: {
    color: "#1167b2",
    fontWeight: 800,
    letterSpacing: "2px",
    fontSize: "12px",
    margin: 0,
  },

  title: {
    margin: "8px 0",
    fontSize: "36px",
  },

  subtitle: {
    color: "#64748b",
    margin: 0,
  },

  sectionTitle: {
    marginTop: "30px",
    marginBottom: "16px",
    fontSize: "22px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "14px",
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#0f172a",
    fontSize: "15px",
  },

  uploadGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "16px",
  },

  uploadBox: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "16px",
    background: "#f8fafc",
    display: "grid",
    gap: "12px",
  },

  dropZone: {
    minHeight: "230px",
    border: "2px dashed #9bb8dd",
    borderRadius: "16px",
    background: "#ffffff",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    overflow: "hidden",
  },

  dropContent: {
    display: "grid",
    placeItems: "center",
    gap: "10px",
    textAlign: "center",
    color: "#334155",
  },

  uploadIcon: {
    fontSize: "54px",
    lineHeight: 1,
    color: "#1167b2",
  },

  hiddenInput: {
    display: "none",
  },

  preview: {
    width: "100%",
    height: "100%",
    minHeight: "230px",
    objectFit: "cover",
    borderRadius: "14px",
  },

  galleryUploadBox: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "18px",
    background: "#f8fafc",
  },

  helpText: {
    marginTop: 0,
    color: "#64748b",
  },

  galleryDropZone: {
    minHeight: "160px",
    border: "2px dashed #9bb8dd",
    borderRadius: "16px",
    background: "#ffffff",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    gap: "8px",
    cursor: "pointer",
    color: "#334155",
  },

  galleryCounter: {
    marginTop: "14px",
    color: "#64748b",
  },

  galleryGrid: {
    marginTop: "18px",
    display: "grid",
    gridTemplateColumns: "repeat(5,1fr)",
    gap: "12px",
  },

  galleryItem: {
    background: "white",
    borderRadius: "14px",
    padding: "10px",
    display: "grid",
    gap: "8px",
    border: "1px solid #e2e8f0",
  },

  galleryImage: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  emptyGallery: {
    gridColumn: "1 / -1",
    height: "120px",
    borderRadius: "14px",
    background: "#e2e8f0",
    display: "grid",
    placeItems: "center",
    color: "#64748b",
  },

  deleteButton: {
    border: "none",
    background: "#dc2626",
    color: "white",
    padding: "8px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  },

  button: {
    marginTop: "28px",
    border: "none",
    background: "#1167b2",
    color: "white",
    padding: "14px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
  },

  secondaryButton: {
    border: "none",
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
  },
};