"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { themeList, aqiqahThemeList, khitanThemeList } from "@/lib/theme";
import styles from "@/styles/dashboard.module.css";

const BUCKET = "invitation-assets";

type PhotoField = "cover_photo" | "bride_photo" | "groom_photo" | "music_url";

const initialForm = {
  category: "wedding" as "wedding" | "aqiqah" | "khitan",
  theme: "luxury-gold",
  is_active: true,

  groom_name: "",
  bride_name: "",
  groom_parent: "",
  bride_parent: "",
  groom_instagram: "",
  bride_instagram: "",

  akad_date: "",
  akad_time: "",
  akad_location: "",
  resepsi_date: "",
  reception_time: "",
  reception_location: "",
  maps_url: "",

  opening_greeting: "",
  opening_title: "",
  opening_description: "",
  opening_quote: "",
  opening_quote_source: "",

  youtube_url: "",

  story_1_year: "",
  story_1_title: "",
  story_1_desc: "",
  story_2_year: "",
  story_2_title: "",
  story_2_desc: "",
  story_3_year: "",
  story_3_title: "",
  story_3_desc: "",

  groom_bank_name: "",
  groom_bank_account: "",
  groom_bank_holder: "",
  bride_bank_name: "",
  bride_bank_account: "",
  bride_bank_holder: "",
  music_url: "",

  cover_photo: "",
  bride_photo: "",
  groom_photo: "",
  gallery_photos: [] as string[],

  baby_name: "",
  baby_gender: "",
  father_name: "",
  mother_name: "",
  birth_date: "",
  birth_place: "",
  aqiqah_date: "",
  aqiqah_time: "",
  aqiqah_location: "",
  gift_bank_name: "",
  gift_account_number: "",
  gift_account_name: "",
};

type FormState = typeof initialForm;

export default function AdminInvitationEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [slug, setSlug] = useState("");
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    loadInvitation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInvitation = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      if (!profile || profile.role !== "owner") {
        router.push("/login");
        return;
      }

      // Owner sees every invitation regardless of client assignment - no
      // ownership scoping needed here (unlike the reseller editor).
      const { data: invitation } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!invitation) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setSlug(invitation.slug || "");

      setForm({
        category:
          invitation.category === "aqiqah" ? "aqiqah" : invitation.category === "khitan" ? "khitan" : "wedding",
        theme:
          invitation.theme ||
          (invitation.category === "aqiqah"
            ? "akikah-nur"
            : invitation.category === "khitan"
            ? "khitan-warna"
            : "luxury-gold"),
        is_active: invitation.is_active !== false,

        groom_name: invitation.groom_name || "",
        bride_name: invitation.bride_name || "",
        groom_parent: invitation.groom_parent || "",
        bride_parent: invitation.bride_parent || "",
        groom_instagram: invitation.groom_instagram || "",
        bride_instagram: invitation.bride_instagram || "",

        akad_date: invitation.akad_date || "",
        akad_time: invitation.akad_time || "",
        akad_location: invitation.akad_location || "",
        resepsi_date: invitation.resepsi_date || "",
        reception_time: invitation.reception_time || "",
        reception_location: invitation.reception_location || "",
        maps_url: invitation.maps_url || "",

        opening_greeting: invitation.opening_greeting || "",
        opening_title: invitation.opening_title || "",
        opening_description: invitation.opening_description || "",
        opening_quote: invitation.opening_quote || "",
        opening_quote_source: invitation.opening_quote_source || "",

        youtube_url: invitation.youtube_url || "",

        story_1_year: invitation.story_1_year || "",
        story_1_title: invitation.story_1_title || "",
        story_1_desc: invitation.story_1_desc || "",
        story_2_year: invitation.story_2_year || "",
        story_2_title: invitation.story_2_title || "",
        story_2_desc: invitation.story_2_desc || "",
        story_3_year: invitation.story_3_year || "",
        story_3_title: invitation.story_3_title || "",
        story_3_desc: invitation.story_3_desc || "",

        groom_bank_name: invitation.groom_bank_name || "",
        groom_bank_account: invitation.groom_bank_account || "",
        groom_bank_holder: invitation.groom_bank_holder || "",
        bride_bank_name: invitation.bride_bank_name || "",
        bride_bank_account: invitation.bride_bank_account || "",
        bride_bank_holder: invitation.bride_bank_holder || "",
        music_url: invitation.music_url || "",

        cover_photo: invitation.cover_photo || "",
        bride_photo: invitation.bride_photo || "",
        groom_photo: invitation.groom_photo || "",
        gallery_photos: Array.isArray(invitation.gallery_photos)
          ? invitation.gallery_photos
          : [],

        baby_name: invitation.baby_name || "",
        baby_gender: invitation.baby_gender || "",
        father_name: invitation.father_name || "",
        mother_name: invitation.mother_name || "",
        birth_date: invitation.birth_date || "",
        birth_place: invitation.birth_place || "",
        aqiqah_date: invitation.aqiqah_date || "",
        aqiqah_time: invitation.aqiqah_time || "",
        aqiqah_location: invitation.aqiqah_location || "",
        gift_bank_name: invitation.gift_bank_name || "",
        gift_account_number: invitation.gift_account_number || "",
        gift_account_name: invitation.gift_account_name || "",
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadToStorage = async (file: File, folder: string) => {
    const ext = file.name.split(".").pop();
    const fileName = `${params.id}/${folder}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      alert(`Upload gagal: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      return "";
    }

    return supabase.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
  };

  const uploadSingleFile = async (file: File, field: PhotoField) => {
    const publicUrl = await uploadToStorage(file, field);
    if (!publicUrl) return;

    setForm((prev) => ({ ...prev, [field]: publicUrl }));
    alert("Foto berhasil diupload. Klik Simpan Perubahan.");
  };

  const uploadGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    if (form.gallery_photos.length + selectedFiles.length > 10) {
      alert("Maksimal 10 foto galeri.");
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

    alert(`${uploadedUrls.length} foto galeri berhasil diupload.`);
  };

  const removeGalleryPhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery_photos: prev.gallery_photos.filter((_, i) => i !== index),
    }));
  };

  const saveData = async () => {
    setSaving(true);

    // Date-type columns reject an empty string ("" from an untouched
    // <input type="date">), and baby_gender's check constraint only
    // allows 'L'/'P' or null, never "" - null is the correct "not set"
    // value for all of these.
    const payload = {
      ...form,
      akad_date: form.akad_date || null,
      resepsi_date: form.resepsi_date || null,
      aqiqah_date: form.aqiqah_date || null,
      birth_date: form.birth_date || null,
      baby_gender: form.baby_gender || null,
    };

    const { error } = await supabase
      .from("invitations")
      .update(payload)
      .eq("id", params.id);

    setSaving(false);

    if (error) {
      alert(`Gagal menyimpan data: ${error.message}`);
      return;
    }

    alert("Data undangan berhasil disimpan.");
  };

  if (loading) {
    return (
      <main className={styles.editPage}>
        <h2>Memuat data...</h2>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className={styles.editPage}>
        <div className={styles.editCard}>
          <h2>Undangan tidak ditemukan.</h2>
          <button
            onClick={() => router.push("/admin/invitations")}
            className={styles.secondaryButton}
            style={{ marginTop: 16 }}
          >
            Kembali
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.editPage}>
      <div className={styles.editCard}>
        <div className={styles.editHeader}>
          <div>
            <p className={styles.label}>OWNER MENU</p>
            <h1 className={styles.title} style={{ fontSize: 36 }}>
              Lengkapi Undangan
            </h1>
            <p className={styles.subtitle}>
              {slug ? `/${slug} - ` : ""}Isi semua data agar undangan siap dibagikan ke tamu.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/invitations")}
            className={styles.secondaryButton}
          >
            Kembali
          </button>
        </div>

        <h2 className={styles.editSectionTitle}>Tema &amp; Status</h2>

        <div className={styles.formGrid}>
          <select
            value={form.theme}
            onChange={(e) => set("theme", e.target.value)}
            className={styles.input}
          >
            {(form.category === "aqiqah"
              ? aqiqahThemeList
              : form.category === "khitan"
              ? khitanThemeList
              : themeList
            ).map((theme) => (
              <option key={theme.key} value={theme.key}>
                {theme.label}
              </option>
            ))}
          </select>

          <select
            value={form.is_active ? "active" : "inactive"}
            onChange={(e) => setForm({ ...form, is_active: e.target.value === "active" })}
            className={styles.input}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {form.category === "aqiqah" || form.category === "khitan" ? (
          <>
            <h2 className={styles.editSectionTitle}>
              {form.category === "khitan" ? "Data Anak & Orang Tua" : "Data Bayi & Orang Tua"}
            </h2>

            <div className={styles.formGrid}>
              <input
                placeholder={form.category === "khitan" ? "Nama Anak" : "Nama Bayi"}
                value={form.baby_name}
                onChange={(e) => set("baby_name", e.target.value)}
                className={styles.input}
              />

              {form.category === "aqiqah" && (
                <select
                  value={form.baby_gender}
                  onChange={(e) => set("baby_gender", e.target.value)}
                  className={styles.input}
                >
                  <option value="">Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              )}

              <input
                type="date"
                placeholder="Tanggal Lahir"
                value={form.birth_date}
                onChange={(e) => set("birth_date", e.target.value)}
                className={styles.input}
              />

              <input
                placeholder="Tempat Lahir"
                value={form.birth_place}
                onChange={(e) => set("birth_place", e.target.value)}
                className={styles.input}
              />

              <input
                placeholder="Nama Ayah"
                value={form.father_name}
                onChange={(e) => set("father_name", e.target.value)}
                className={styles.input}
              />

              <input
                placeholder="Nama Ibu"
                value={form.mother_name}
                onChange={(e) => set("mother_name", e.target.value)}
                className={styles.input}
              />
            </div>

            <h2 className={styles.editSectionTitle}>
              Jadwal &amp; Lokasi Acara {form.category === "khitan" ? "Khitan" : "Aqiqah"}
            </h2>

            <div className={styles.formGrid}>
              <input
                type="date"
                value={form.aqiqah_date}
                onChange={(e) => set("aqiqah_date", e.target.value)}
                className={styles.input}
              />

              <input
                placeholder="Jam Acara, contoh: 10.00 WIB"
                value={form.aqiqah_time}
                onChange={(e) => set("aqiqah_time", e.target.value)}
                className={styles.input}
              />

              <input
                placeholder="Lokasi Acara"
                value={form.aqiqah_location}
                onChange={(e) => set("aqiqah_location", e.target.value)}
                className={styles.input}
                style={{ gridColumn: "1 / -1" }}
              />

              <input
                placeholder="Google Maps URL"
                value={form.maps_url}
                onChange={(e) => set("maps_url", e.target.value)}
                className={styles.input}
                style={{ gridColumn: "1 / -1" }}
              />
            </div>

            <h2 className={styles.editSectionTitle}>Kata Pembuka (opsional)</h2>
            <p className={styles.helpText} style={{ marginTop: -8 }}>
              Kosongkan untuk memakai teks bawaan tema ini.
            </p>

            <div className={styles.formGrid}>
              <input
                placeholder="Ucapan pembuka, contoh: Assalamu'alaikum Warahmatullahi Wabarakatuh"
                value={form.opening_greeting}
                onChange={(e) => set("opening_greeting", e.target.value)}
                className={styles.input}
                style={{ gridColumn: "1 / -1" }}
              />

              <textarea
                placeholder="Kalimat pembuka utama"
                value={form.opening_title}
                onChange={(e) => set("opening_title", e.target.value)}
                className={styles.textarea}
                style={{ gridColumn: "1 / -1" }}
              />

              <textarea
                placeholder="Kalimat ajakan/kehormatan"
                value={form.opening_description}
                onChange={(e) => set("opening_description", e.target.value)}
                className={styles.textarea}
                style={{ gridColumn: "1 / -1" }}
              />

              <textarea
                placeholder="Kutipan/ayat (opsional)"
                value={form.opening_quote}
                onChange={(e) => set("opening_quote", e.target.value)}
                className={styles.textarea}
                style={{ gridColumn: "1 / -1" }}
              />

              <input
                placeholder="Sumber kutipan, contoh: QS. Ar-Rum : 21"
                value={form.opening_quote_source}
                onChange={(e) => set("opening_quote_source", e.target.value)}
                className={styles.input}
                style={{ gridColumn: "1 / -1" }}
              />
            </div>

            <h2 className={styles.editSectionTitle}>Video (opsional)</h2>

            <div className={styles.formGrid}>
              <input
                placeholder="Link YouTube (opsional)"
                value={form.youtube_url}
                onChange={(e) => set("youtube_url", e.target.value)}
                className={styles.input}
                style={{ gridColumn: "1 / -1" }}
              />
            </div>

            <h2 className={styles.editSectionTitle}>
              Amplop Digital - {form.category === "khitan" ? "Kado untuk Ananda" : "Kado untuk Buah Hati"}
            </h2>

            <div className={styles.formGrid}>
              <input
                placeholder="Nama Bank"
                value={form.gift_bank_name}
                onChange={(e) => set("gift_bank_name", e.target.value)}
                className={styles.input}
              />

              <input
                placeholder="Nomor Rekening"
                value={form.gift_account_number}
                onChange={(e) => set("gift_account_number", e.target.value)}
                className={styles.input}
              />

              <input
                placeholder="Atas Nama"
                value={form.gift_account_name}
                onChange={(e) => set("gift_account_name", e.target.value)}
                className={styles.input}
                style={{ gridColumn: "1 / -1" }}
              />
            </div>
          </>
        ) : (
        <>
        <h2 className={styles.editSectionTitle}>Data Mempelai</h2>

        <div className={styles.formGrid}>
          <input
            placeholder="Nama Mempelai Pria"
            value={form.groom_name}
            onChange={(e) => set("groom_name", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Nama Mempelai Wanita"
            value={form.bride_name}
            onChange={(e) => set("bride_name", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Putra dari (nama orang tua pria)"
            value={form.groom_parent}
            onChange={(e) => set("groom_parent", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Putri dari (nama orang tua wanita)"
            value={form.bride_parent}
            onChange={(e) => set("bride_parent", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Instagram Mempelai Pria (opsional)"
            value={form.groom_instagram}
            onChange={(e) => set("groom_instagram", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Instagram Mempelai Wanita (opsional)"
            value={form.bride_instagram}
            onChange={(e) => set("bride_instagram", e.target.value)}
            className={styles.input}
          />
        </div>

        <h2 className={styles.editSectionTitle}>Jadwal &amp; Lokasi Acara</h2>

        <div className={styles.formGrid}>
          <input
            type="date"
            value={form.akad_date}
            onChange={(e) => set("akad_date", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Jam Akad, contoh: 08.00 WIB"
            value={form.akad_time}
            onChange={(e) => set("akad_time", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Lokasi Akad"
            value={form.akad_location}
            onChange={(e) => set("akad_location", e.target.value)}
            className={styles.input}
            style={{ gridColumn: "1 / -1" }}
          />

          <input
            type="date"
            value={form.resepsi_date}
            onChange={(e) => set("resepsi_date", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Jam Resepsi, contoh: 11.00 WIB"
            value={form.reception_time}
            onChange={(e) => set("reception_time", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Lokasi Resepsi"
            value={form.reception_location}
            onChange={(e) => set("reception_location", e.target.value)}
            className={styles.input}
            style={{ gridColumn: "1 / -1" }}
          />

          <input
            placeholder="Google Maps URL"
            value={form.maps_url}
            onChange={(e) => set("maps_url", e.target.value)}
            className={styles.input}
            style={{ gridColumn: "1 / -1" }}
          />
        </div>

        <h2 className={styles.editSectionTitle}>Kata Pembuka (opsional)</h2>
        <p className={styles.helpText} style={{ marginTop: -8 }}>
          Kosongkan untuk memakai teks bawaan tema ini.
        </p>

        <div className={styles.formGrid}>
          <input
            placeholder="Ucapan pembuka, contoh: Assalamu'alaikum Warahmatullahi Wabarakatuh"
            value={form.opening_greeting}
            onChange={(e) => set("opening_greeting", e.target.value)}
            className={styles.input}
            style={{ gridColumn: "1 / -1" }}
          />

          <textarea
            placeholder="Kalimat pembuka utama"
            value={form.opening_title}
            onChange={(e) => set("opening_title", e.target.value)}
            className={styles.textarea}
            style={{ gridColumn: "1 / -1" }}
          />

          <textarea
            placeholder="Kalimat ajakan/kehormatan"
            value={form.opening_description}
            onChange={(e) => set("opening_description", e.target.value)}
            className={styles.textarea}
            style={{ gridColumn: "1 / -1" }}
          />

          <textarea
            placeholder="Kutipan/ayat (opsional)"
            value={form.opening_quote}
            onChange={(e) => set("opening_quote", e.target.value)}
            className={styles.textarea}
            style={{ gridColumn: "1 / -1" }}
          />

          <input
            placeholder="Sumber kutipan, contoh: QS. Ar-Rum : 21"
            value={form.opening_quote_source}
            onChange={(e) => set("opening_quote_source", e.target.value)}
            className={styles.input}
            style={{ gridColumn: "1 / -1" }}
          />
        </div>

        <h2 className={styles.editSectionTitle}>Love Story</h2>

        {[1, 2, 3].map((n) => {
          const yearKey = `story_${n}_year` as keyof FormState;
          const titleKey = `story_${n}_title` as keyof FormState;
          const descKey = `story_${n}_desc` as keyof FormState;

          return (
            <div key={n} className={styles.storyBlock}>
              <div className={styles.storyGrid}>
                <input
                  placeholder="Tahun / Label, contoh: 2021"
                  value={form[yearKey] as string}
                  onChange={(e) => set(yearKey, e.target.value)}
                  className={styles.input}
                />

                <input
                  placeholder="Judul momen, contoh: Pertama Bertemu"
                  value={form[titleKey] as string}
                  onChange={(e) => set(titleKey, e.target.value)}
                  className={styles.input}
                />
              </div>

              <textarea
                placeholder="Ceritakan momen ini..."
                value={form[descKey] as string}
                onChange={(e) => set(descKey, e.target.value)}
                className={styles.textarea}
              />
            </div>
          );
        })}

        <h2 className={styles.editSectionTitle}>Video Pre-Wedding</h2>

        <div className={styles.formGrid}>
          <input
            placeholder="Link YouTube (opsional)"
            value={form.youtube_url}
            onChange={(e) => set("youtube_url", e.target.value)}
            className={styles.input}
            style={{ gridColumn: "1 / -1" }}
          />
        </div>

        <h2 className={styles.editSectionTitle}>Amplop Digital - Mempelai Pria</h2>

        <div className={styles.formGrid}>
          <input
            placeholder="Nama Bank"
            value={form.groom_bank_name}
            onChange={(e) => set("groom_bank_name", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Nomor Rekening"
            value={form.groom_bank_account}
            onChange={(e) => set("groom_bank_account", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Atas Nama"
            value={form.groom_bank_holder}
            onChange={(e) => set("groom_bank_holder", e.target.value)}
            className={styles.input}
            style={{ gridColumn: "1 / -1" }}
          />
        </div>

        <h2 className={styles.editSectionTitle}>Amplop Digital - Mempelai Wanita</h2>

        <div className={styles.formGrid}>
          <input
            placeholder="Nama Bank"
            value={form.bride_bank_name}
            onChange={(e) => set("bride_bank_name", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Nomor Rekening"
            value={form.bride_bank_account}
            onChange={(e) => set("bride_bank_account", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Atas Nama"
            value={form.bride_bank_holder}
            onChange={(e) => set("bride_bank_holder", e.target.value)}
            className={styles.input}
            style={{ gridColumn: "1 / -1" }}
          />
        </div>
        </>
        )}

        <h2 className={styles.editSectionTitle}>Musik Latar (MP3)</h2>

        <MusicUploadBox value={form.music_url} onUpload={(file) => uploadSingleFile(file, "music_url")} />

        <h2 className={styles.editSectionTitle}>Upload Foto Utama</h2>

        <div className={styles.uploadGrid}>
          <UploadBox
            title={
              form.category === "aqiqah" ? "Foto Bayi" : form.category === "khitan" ? "Foto Anak" : "Foto Cover"
            }
            value={form.cover_photo}
            onUpload={(file) => uploadSingleFile(file, "cover_photo")}
          />

          {form.category === "wedding" && (
            <>
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
            </>
          )}
        </div>

        <h2 className={styles.editSectionTitle}>Galeri Foto</h2>

        <div className={styles.galleryUploadBox}>
          <p className={styles.helpText}>
            Upload maksimal 10 foto galeri. Foto akan tampil sebagai slide di
            undangan setelah klik Simpan Perubahan.
          </p>

          <label
            className={styles.galleryDropZone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              uploadGalleryFiles(e.dataTransfer.files);
            }}
          >
            <div className={styles.uploadIcon}>☁</div>
            <strong>Drag &amp; drop foto galeri di sini</strong>
            <span>atau klik untuk pilih file</span>

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={form.gallery_photos.length >= 10}
              onChange={(e) => uploadGalleryFiles(e.target.files)}
              className={styles.hiddenInput}
            />
          </label>

          <p className={styles.galleryCounter}>
            Maksimal 10 foto - Saat ini: {form.gallery_photos.length}/10 foto
          </p>

          <div className={styles.galleryGrid}>
            {form.gallery_photos.length === 0 ? (
              <div className={styles.emptyGallery}>Belum ada foto galeri</div>
            ) : (
              form.gallery_photos.map((photo, index) => (
                <div key={photo} className={styles.galleryItem}>
                  <img src={photo} alt={`Gallery ${index + 1}`} className={styles.galleryImage} />

                  <button
                    type="button"
                    onClick={() => removeGalleryPhoto(index)}
                    className={styles.deleteButton}
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={saveData}
          className={styles.button}
          disabled={saving}
          style={{ marginTop: 28 }}
        >
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
    <div className={styles.uploadBox}>
      <strong>{title}</strong>

      <label className={styles.dropZone} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        {value ? (
          <img src={value} alt={title} className={styles.preview} />
        ) : (
          <div className={styles.dropContent}>
            <div className={styles.uploadIcon}>☁</div>
            <strong>Drag &amp; drop foto di sini</strong>
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
          className={styles.hiddenInput}
        />
      </label>
    </div>
  );
}

function MusicUploadBox({ value, onUpload }: { value: string; onUpload: (file: File) => void }) {
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div>
      {value && (
        <audio controls src={value} className={styles.musicPlayer} style={{ marginBottom: 10 }} />
      )}

      <label className={styles.musicDropZone} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <div className={styles.dropContent}>
          <div className={styles.uploadIcon}>♪</div>
          <strong>{value ? "Ganti file MP3" : "Drag & drop file MP3 di sini"}</strong>
          <span>atau klik untuk pilih file</span>
        </div>

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
          className={styles.hiddenInput}
        />
      </label>
    </div>
  );
}
