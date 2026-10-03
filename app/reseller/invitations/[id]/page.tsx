"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { themeList, aqiqahThemeList, khitanThemeList, birthdayThemeList } from "@/lib/theme";
import ThemePreviewPanel from "@/components/ThemePreviewPanel";
import SmartCoverEditor from "@/components/SmartCoverEditor";
import { MUSIC_LIBRARY } from "@/lib/musicLibrary";
import styles from "@/styles/dashboard.module.css";

const BUCKET = "invitation-assets";

type PhotoField = "cover_photo" | "background_photo" | "bride_photo" | "groom_photo" | "story_1_photo" | "story_2_photo" | "story_3_photo" | "story_4_photo" | "story_5_photo" | "music_url";

const initialForm = {
  category: "wedding" as "wedding" | "aqiqah" | "khitan" | "birthday",
  theme: "luxury-gold",
  client_price: "",

  groom_name: "",
  bride_name: "",
  groom_nickname: "",
  bride_nickname: "",
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
  closing_greeting: "",

  youtube_url: "",

  story_1_year: "",
  story_1_title: "",
  story_1_desc: "",
  story_1_photo: "",
  story_2_year: "",
  story_2_title: "",
  story_2_desc: "",
  story_2_photo: "",
  story_3_year: "",
  story_3_title: "",
  story_3_desc: "",
  story_3_photo: "",
  story_4_year: "",
  story_4_title: "",
  story_4_desc: "",
  story_4_photo: "",
  story_5_year: "",
  story_5_title: "",
  story_5_desc: "",
  story_5_photo: "",

  groom_bank_name: "",
  groom_bank_account: "",
  groom_bank_holder: "",
  bride_bank_name: "",
  bride_bank_account: "",
  bride_bank_holder: "",
  music_url: "",

  cover_photo: "",
  background_photo: "",
  bride_photo: "",
  groom_photo: "",
  gallery_photos: [] as string[],
  gallery_positions: {} as Record<string, { x: number; y: number }>,
  gallery_layout: "auto",

  baby_name: "",
  child_nickname: "",
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

export default function ResellerInvitationEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [slug, setSlug] = useState("");
  const [resellerPackage, setResellerPackage] = useState<"reseller" | "reseller_brand" | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

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

      if (!profile || profile.role !== "reseller") {
        router.push("/login");
        return;
      }

      const { data: resellerData } = await supabase
        .from("resellers")
        .select("id, package")
        .eq("user_id", authUser.id);

      const reseller = resellerData?.[0];

      if (!reseller) {
        setLoading(false);
        return;
      }

      setResellerPackage(reseller.package ?? "reseller");

      const { data: ownClients } = await supabase
        .from("clients")
        .select("id")
        .eq("reseller_id", reseller.id);

      const ownClientIds = new Set((ownClients ?? []).map((c) => c.id));

      const { data: invitation } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!invitation || !ownClientIds.has(invitation.client_id)) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setSlug(invitation.slug || "");

      setForm({
        category:
          invitation.category === "aqiqah"
            ? "aqiqah"
            : invitation.category === "khitan"
            ? "khitan"
            : invitation.category === "birthday"
            ? "birthday"
            : "wedding",
        theme:
          invitation.theme ||
          (invitation.category === "aqiqah"
            ? "akikah-nur"
            : invitation.category === "khitan"
            ? "khitan-warna"
            : invitation.category === "birthday"
            ? birthdayThemeList[0]?.key || "princess-fairytale"
            : "luxury-gold"),
        client_price: invitation.client_price != null ? String(invitation.client_price) : "",

        groom_name: invitation.groom_name || "",
        bride_name: invitation.bride_name || "",
        groom_nickname: invitation.groom_nickname || "",
        bride_nickname: invitation.bride_nickname || "",
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
        closing_greeting: invitation.closing_greeting || "",

        youtube_url: invitation.youtube_url || "",

        story_1_year: invitation.story_1_year || "",
        story_1_title: invitation.story_1_title || "",
        story_1_desc: invitation.story_1_desc || "",
        story_1_photo: invitation.story_1_photo || "",
        story_2_year: invitation.story_2_year || "",
        story_2_title: invitation.story_2_title || "",
        story_2_desc: invitation.story_2_desc || "",
        story_2_photo: invitation.story_2_photo || "",
        story_3_year: invitation.story_3_year || "",
        story_3_title: invitation.story_3_title || "",
        story_3_desc: invitation.story_3_desc || "",
        story_3_photo: invitation.story_3_photo || "",
        story_4_year: invitation.story_4_year || "",
        story_4_title: invitation.story_4_title || "",
        story_4_desc: invitation.story_4_desc || "",
        story_4_photo: invitation.story_4_photo || "",
        story_5_year: invitation.story_5_year || "",
        story_5_title: invitation.story_5_title || "",
        story_5_desc: invitation.story_5_desc || "",
        story_5_photo: invitation.story_5_photo || "",

        groom_bank_name: invitation.groom_bank_name || "",
        groom_bank_account: invitation.groom_bank_account || "",
        groom_bank_holder: invitation.groom_bank_holder || "",
        bride_bank_name: invitation.bride_bank_name || "",
        bride_bank_account: invitation.bride_bank_account || "",
        bride_bank_holder: invitation.bride_bank_holder || "",
        music_url: invitation.music_url || "",

        cover_photo: invitation.cover_photo || "",
        background_photo: invitation.background_photo || "",
        bride_photo: invitation.bride_photo || "",
        groom_photo: invitation.groom_photo || "",
        gallery_photos: Array.isArray(invitation.gallery_photos)
          ? invitation.gallery_photos
          : [],
        gallery_positions:
          invitation.gallery_positions &&
          typeof invitation.gallery_positions === "object" &&
          !Array.isArray(invitation.gallery_positions)
            ? invitation.gallery_positions
            : {},
        gallery_layout: ["portrait", "landscape", "square"].includes(invitation.gallery_layout)
          ? invitation.gallery_layout
          : "auto",

        baby_name: invitation.baby_name || "",
        child_nickname: invitation.child_nickname || "",
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

  useEffect(() => {
    // This effect loads the existing invitation and hydrates the editor once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInvitation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const optimizeImageForUpload = async (file: File): Promise<Blob> => {
    if (!file.type.startsWith("image/") || file.size <= 2 * 1024 * 1024) {
      return file;
    }

    const objectUrl = URL.createObjectURL(file);

    try {
      const img = document.createElement("img");

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Foto tidak dapat dibaca."));
        img.src = objectUrl;
      });

      const maxDimension = 1920;
      const ratio = Math.min(
        1,
        maxDimension / Math.max(img.naturalWidth, img.naturalHeight)
      );

      let width = Math.max(1, Math.round(img.naturalWidth * ratio));
      let height = Math.max(1, Math.round(img.naturalHeight * ratio));
      let quality = 0.82;
      let compressed: Blob | null = null;

      for (let attempt = 0; attempt < 6; attempt += 1) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Browser tidak mendukung kompresi foto.");

        context.drawImage(img, 0, 0, width, height);

        compressed = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, "image/jpeg", quality);
        });

        if (!compressed) throw new Error("Foto gagal dikompres.");
        if (compressed.size <= 2 * 1024 * 1024) break;

        quality = Math.max(0.55, quality - 0.07);
        width = Math.max(1, Math.round(width * 0.9));
        height = Math.max(1, Math.round(height * 0.9));
      }

      if (!compressed) throw new Error("Foto gagal dikompres.");
      return compressed;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const uploadToStorage = async (file: File, folder: string) => {
    try {
      const isImage = file.type.startsWith("image/");
      const uploadBody = isImage ? await optimizeImageForUpload(file) : file;
      const extension = isImage
        ? "jpg"
        : file.name.split(".").pop() || "bin";
      const contentType = isImage ? "image/jpeg" : file.type;

      const fileName = `${params.id}/${folder}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${extension}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, uploadBody, {
          contentType,
          cacheControl: "3600",
        });

      if (error) {
        const statusCode = String((error as unknown as { statusCode?: string | number }).statusCode || "");
        const tooLarge =
          error.message.toLowerCase().includes("maximum allowed size") ||
          statusCode === "413";

        alert(
          tooLarge
            ? "Foto masih terlalu besar untuk diupload. Silakan pilih foto lain atau coba ulang."
            : `Upload gagal: ${error.message}`
        );
        return "";
      }

      return supabase.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses file.";
      alert(`Upload gagal: ${message}`);
      return "";
    }
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
      gallery_positions: {
        ...prev.gallery_positions,
        ...Object.fromEntries(uploadedUrls.map((url) => [url, { x: 50, y: 50 }])),
      },
    }));

    alert(`${uploadedUrls.length} foto galeri berhasil diupload.`);
  };

  const updateGalleryPosition = (photo: string, axis: "x" | "y", value: number) => {
    setForm((prev) => {
      const current = prev.gallery_positions[photo] || { x: 50, y: 50 };
      return {
        ...prev,
        gallery_positions: {
          ...prev.gallery_positions,
          [photo]: { ...current, [axis]: value },
        },
      };
    });
  };

  const resetGalleryPosition = (photo: string) => {
    setForm((prev) => ({
      ...prev,
      gallery_positions: {
        ...prev.gallery_positions,
        [photo]: { x: 50, y: 50 },
      },
    }));
  };

  const removeGalleryPhoto = (index: number) => {
    setForm((prev) => {
      const photo = prev.gallery_photos[index];
      const nextPositions = { ...prev.gallery_positions };
      delete nextPositions[photo];

      return {
        ...prev,
        gallery_photos: prev.gallery_photos.filter((_, i) => i !== index),
        gallery_positions: nextPositions,
      };
    });
  };

  const saveData = async () => {
    setSaving(true);

    const payload = {
      ...form,
      groom_nickname: form.groom_nickname.trim() || null,
      bride_nickname: form.bride_nickname.trim() || null,
      child_nickname: form.category === "khitan" ? (form.child_nickname.trim() || null) : null,
      akad_date: form.akad_date || null,
      resepsi_date: form.resepsi_date || null,
      aqiqah_date: form.aqiqah_date || null,
      birth_date: form.birth_date || null,
      baby_gender: form.baby_gender || null,
      client_price: form.client_price ? Number(form.client_price) : null,
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
          <h2>Undangan tidak ditemukan atau bukan milik client Anda.</h2>
          <button
            onClick={() => router.push("/reseller/invitations")}
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
            <p className={styles.label}>RESELLER DASHBOARD</p>
            <h1 className={styles.title} style={{ fontSize: 36 }}>
              Lengkapi Undangan
            </h1>
            <p className={styles.subtitle}>
              {slug ? `/${slug} - ` : ""}Isi semua data agar undangan siap dibagikan ke tamu.
            </p>
          </div>

          <button
            onClick={() => router.push("/reseller/invitations")}
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
              : form.category === "birthday"
              ? birthdayThemeList
              : themeList
            ).map((theme) => (
              <option key={theme.key} value={theme.key}>
                {theme.label}
              </option>
            ))}
          </select>

          <ThemePreviewPanel category={form.category} themeKey={form.theme} />

          <div className={styles.input} style={{ display: "flex", alignItems: "center", color: "#92400e" }}>
            Status aktivasi dikelola Admin Vistiq. Setelah data dan pembayaran client siap, hubungi admin untuk menayangkan undangan.
          </div>

          {resellerPackage === "reseller_brand" && (
            <input
              type="number"
              min="0"
              step="1000"
              placeholder="Harga ke client Anda, contoh: 200000"
              value={form.client_price}
              onChange={(e) => set("client_price", e.target.value)}
              className={styles.input}
            />
          )}
        </div>

        {resellerPackage === "reseller_brand" && (
          <p className={styles.helpText} style={{ marginTop: -8 }}>
            Harga jual kepada client bebas Anda tentukan. Untuk akun baru, biaya aktivasi Vistiq tetap Rp20.000 per undangan.
          </p>
        )}

        {form.category !== "wedding" ? (
          <>
            <h2 className={styles.editSectionTitle}>
              {form.category === "aqiqah" ? "Data Bayi & Orang Tua" : "Data Anak & Orang Tua"}
            </h2>

            <div className={styles.formGrid}>
              <input
                placeholder={form.category === "aqiqah" ? "Nama Bayi" : "Nama Anak"}
                value={form.baby_name}
                onChange={(e) => set("baby_name", e.target.value)}
                className={styles.input}
              />

              {form.category === "khitan" && (
                <input
                  placeholder="Nama Panggilan Anak (opsional), contoh: Sandika"
                  aria-label="Nama Panggilan Anak"
                  value={form.child_nickname}
                  onChange={(e) => set("child_nickname", e.target.value)}
                  className={styles.input}
                />
              )}

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
              Jadwal &amp; Lokasi Acara {
                form.category === "birthday"
                  ? "Ulang Tahun"
                  : form.category === "khitan"
                  ? "Khitan"
                  : "Aqiqah"
              }
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
                placeholder={"Kalimat pembuka utama. Tekan Enter sebelum nama pengantin agar tampil pada baris baru."}
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

              <input
                placeholder="Ucapan penutup, contoh: Tuhan memberkati"
                value={form.closing_greeting}
                onChange={(e) => set("closing_greeting", e.target.value)}
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
            placeholder="Nama Panggilan Pria (opsional)"
            value={form.groom_nickname}
            onChange={(e) => set("groom_nickname", e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Nama Panggilan Wanita (opsional)"
            value={form.bride_nickname}
            onChange={(e) => set("bride_nickname", e.target.value)}
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
            placeholder={"Kalimat pembuka utama. Tekan Enter sebelum nama pengantin agar tampil pada baris baru."}
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

          <input
            placeholder="Ucapan penutup, contoh: Tuhan memberkati"
            value={form.closing_greeting}
            onChange={(e) => set("closing_greeting", e.target.value)}
            className={styles.input}
            style={{ gridColumn: "1 / -1" }}
          />
        </div>

        <h2 className={styles.editSectionTitle}>Love Story</h2>
        <p className={styles.helpText} style={{ marginTop: -8 }}>
          Bisa diisi sampai 5 bagian. Kosongkan part yang tidak digunakan.
        </p>

        {[1, 2, 3, 4, 5].map((n) => {
          const yearKey = `story_${n}_year` as keyof FormState;
          const titleKey = `story_${n}_title` as keyof FormState;
          const descKey = `story_${n}_desc` as keyof FormState;
          const photoKey = `story_${n}_photo` as PhotoField;

          return (
            <div key={n} className={styles.storyBlock}>
              <div className={styles.storyGrid}>
                <input
                  placeholder={`Part ${n} - Tahun / Label, contoh: 2021`}
                  value={form[yearKey] as string}
                  onChange={(e) => set(yearKey, e.target.value)}
                  className={styles.input}
                />

                <input
                  placeholder={`Part ${n} - Judul momen`}
                  value={form[titleKey] as string}
                  onChange={(e) => set(titleKey, e.target.value)}
                  className={styles.input}
                />
              </div>

              <textarea
                placeholder={`Part ${n} - Ceritakan momen ini...`}
                value={form[descKey] as string}
                onChange={(e) => set(descKey, e.target.value)}
                className={styles.textarea}
              />

              <UploadBox
                title={`Foto Love Story ${n}`}
                value={form[photoKey] as string}
                onUpload={(file) => uploadSingleFile(file, photoKey)}
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

        <MusicUploadBox
          value={form.music_url}
          onUpload={(file) => uploadSingleFile(file, "music_url")}
          onSelectLibrary={(url) => set("music_url", url)}
        />

        <h2 className={styles.editSectionTitle}>Upload Foto Utama</h2>

        <div className={styles.uploadGrid}>
          <UploadBox
            title={
              form.category === "aqiqah"
                ? "Foto Bayi"
                : form.category === "khitan" || form.category === "birthday"
                ? "Foto Anak"
                : "Foto Cover"
            }
            value={form.cover_photo}
            onUpload={(file) => uploadSingleFile(file, "cover_photo")}
          />

          {form.category === "wedding" && (
            <>
              <UploadBox
                title="Foto Background"
                value={form.background_photo}
                onUpload={(file) => uploadSingleFile(file, "background_photo")}
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
            </>
          )}
        </div>

        {form.category === "wedding" && form.cover_photo && (
          <SmartCoverEditor
            value={form.cover_photo}
            onChange={(value) => set("cover_photo", value)}
            names={[form.groom_name, form.bride_name].filter(Boolean).join(" & ")}
          />
        )}

        <h2 className={styles.editSectionTitle}>Galeri Foto</h2>

        {form.category === "wedding" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "grid", gap: 7, fontWeight: 600 }}>
              Model Kolase Galeri
              <select
                className={styles.input}
                value={form.gallery_layout}
                onChange={(e) => set("gallery_layout", e.target.value)}
              >
                <option value="auto">Otomatis / Masonry</option>
                <option value="portrait">Portrait - 2 kolom (3:4)</option>
                <option value="landscape">Landscape - 1 kolom (16:9)</option>
                <option value="square">Kotak - 2 kolom (1:1)</option>
              </select>
            </label>
            <p className={styles.helpText} style={{ marginTop: 7 }}>
              Pilih bentuk kolase sesuai orientasi foto client. Pengaturan ini terutama digunakan oleh tema yang mendukung galeri fleksibel seperti Azure Bloom.
            </p>
          </div>
        )}

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
              form.gallery_photos.map((photo, index) => {
                const position = form.gallery_positions[photo] || { x: 50, y: 50 };

                return (
                  <div key={photo} className={styles.galleryItem}>
                    <div style={{ position: "relative", overflow: "hidden", borderRadius: 10, aspectRatio: "4 / 3" }}>
                      <img
                        src={photo}
                        alt={`Gallery ${index + 1}`}
                        className={styles.galleryImage}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: `${position.x}% ${position.y}%`,
                        }}
                      />
                    </div>

                    <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                      <label style={{ display: "grid", gap: 4, fontSize: 12 }}>
                        <span>Geser kiri / kanan</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={position.x}
                          onChange={(e) => updateGalleryPosition(photo, "x", Number(e.target.value))}
                        />
                      </label>

                      <label style={{ display: "grid", gap: 4, fontSize: 12 }}>
                        <span>Geser atas / bawah</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={position.y}
                          onChange={(e) => updateGalleryPosition(photo, "y", Number(e.target.value))}
                        />
                      </label>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => resetGalleryPosition(photo)}
                          className={styles.secondaryButton}
                          style={{ flex: 1, padding: "8px 10px" }}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => removeGalleryPhoto(index)}
                          className={styles.deleteButton}
                          style={{ position: "static", flex: 1 }}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
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

function MusicUploadBox({
  value,
  onUpload,
  onSelectLibrary,
}: {
  value: string;
  onUpload: (file: File) => void;
  onSelectLibrary: (url: string) => void;
}) {
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

      <p style={{ margin: "12px 0 6px", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
        atau
      </p>

      <select
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) onSelectLibrary(e.target.value);
          e.target.value = "";
        }}
        className={styles.input}
      >
        <option value="">Pilih dari Pustaka Musik (aman hak cipta)...</option>
        {MUSIC_LIBRARY.map((track) => (
          <option key={track.id} value={track.url}>
            {track.title} - {track.mood}
          </option>
        ))}
      </select>
    </div>
  );
}
