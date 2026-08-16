"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { themeList, aqiqahThemeList, khitanThemeList, birthdayThemeList } from "@/lib/theme";
import SmartCoverEditor from "@/components/SmartCoverEditor";
import ThemePreviewPanel from "@/components/ThemePreviewPanel";
import { MUSIC_LIBRARY } from "@/lib/musicLibrary";
import styles from "@/styles/dashboard.module.css";

const BUCKET = "invitation-assets";

type PhotoField = "cover_photo" | "bride_photo" | "groom_photo" | "music_url";

const initialForm = {
  category: "wedding" as "wedding" | "aqiqah" | "khitan" | "birthday",
  slug: "",
  theme: "luxury-gold",
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
  story_4_year: "",
  story_4_title: "",
  story_4_desc: "",
  story_5_year: "",
  story_5_title: "",
  story_5_desc: "",

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

type DashboardBrand = {
  brand_name: string;
  logo_url: string | null;
  brand_color: string | null;
};

export default function ClientEditPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [invitationId, setInvitationId] = useState("");
  const [clientId, setClientId] = useState("");
  const [form, setForm] = useState<FormState>(initialForm);
  const [brand, setBrand] = useState<DashboardBrand | null>(null);

  useEffect(() => {
    loadInvitation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInvitation = async () => {
    setLoadError(false);

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

      if (!profile || profile.role !== "client") {
        router.push("/login");
        return;
      }

      const { data: brandData } = await supabase.rpc("get_my_client_brand");
      setBrand((brandData?.[0] as DashboardBrand | undefined) || null);

      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", authUser.id);

      if (clientsError) {
        setLoadError(true);
        setLoading(false);
        return;
      }

      if (!clients || clients.length === 0) {
        setLoading(false);
        return;
      }

      setClientId(clients[0].id);

      const { data: invitations, error: invitationsError } = await supabase
        .from("invitations")
        .select("*")
        .eq("client_id", clients[0].id);

      if (invitationsError) {
        setLoadError(true);
        setLoading(false);
        return;
      }

      if (!invitations || invitations.length === 0) {
        setLoading(false);
        return;
      }

      const invitation = invitations[0];

      setInvitationId(invitation.id);

      setForm({
        category:
          invitation.category === "aqiqah"
            ? "aqiqah"
            : invitation.category === "khitan"
            ? "khitan"
            : invitation.category === "birthday"
            ? "birthday"
            : "wedding",
        slug: invitation.slug || "",
        theme: invitation.theme || "",
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
        story_4_year: invitation.story_4_year || "",
        story_4_title: invitation.story_4_title || "",
        story_4_desc: invitation.story_4_desc || "",
        story_5_year: invitation.story_5_year || "",
        story_5_title: invitation.story_5_title || "",
        story_5_desc: invitation.story_5_desc || "",

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

  const setCategory = (category: "wedding" | "aqiqah" | "khitan" | "birthday") => {
    setForm((prev) => ({
      ...prev,
      category,
      theme:
        category === "aqiqah"
          ? aqiqahThemeList[0]?.key || ""
          : category === "khitan"
          ? khitanThemeList[0]?.key || ""
          : category === "birthday"
          ? birthdayThemeList[0]?.key || ""
          : "luxury-gold",
    }));
  };

  const makeSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/&/g, "dan")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const autoSlug = () => {
    if (form.category !== "wedding") {
      if (!form.baby_name.trim()) {
        alert(form.category === "aqiqah" ? "Nama bayi wajib diisi." : "Nama anak wajib diisi.");
        return;
      }
    } else if (!form.groom_name.trim() || !form.bride_name.trim()) {
      alert("Nama mempelai pria dan wanita wajib diisi.");
      return;
    }

    const text =
      form.category === "aqiqah"
        ? `akikah-${form.baby_name}`
        : form.category === "khitan"
        ? `khitan-${form.baby_name}`
        : form.category === "birthday"
        ? `ulang-tahun-${form.baby_name}`
        : `${form.groom_name}-${form.bride_name}`;
    set("slug", makeSlug(text));
  };

  const uploadToStorage = async (file: File, folder: string) => {
    if (!invitationId && !clientId) {
      alert("Akun client belum terhubung.");
      return "";
    }

    const ext = file.name.split(".").pop();
    const pathPrefix = invitationId ? invitationId : `clients/${clientId}/drafts`;
    const fileName = `${pathPrefix}/${folder}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      alert(
        `Upload gagal.\nfileName: ${fileName}\ninvitationId: "${invitationId}"\nclientId: "${clientId}"\n${JSON.stringify(
          error,
          Object.getOwnPropertyNames(error)
        )}`
      );
      return "";
    }

    return supabase.storage.from(BUCKET).getPublicUrl(fileName).data
      .publicUrl;
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
    const cleanFields = {
      groom_nickname: form.groom_nickname.trim() || null,
      bride_nickname: form.bride_nickname.trim() || null,
      akad_date: form.akad_date || null,
      resepsi_date: form.resepsi_date || null,
      aqiqah_date: form.aqiqah_date || null,
      birth_date: form.birth_date || null,
      baby_gender: form.baby_gender || null,
    };

    if (invitationId) {
      setSaving(true);

      const { error } = await supabase
        .from("invitations")
        .update({ ...form, ...cleanFields })
        .eq("id", invitationId);

      setSaving(false);

      if (error) {
        alert("Gagal menyimpan data.");
        return;
      }

      alert("Data undangan berhasil disimpan.");
      return;
    }

    if (!clientId) {
      alert("Akun client belum terhubung.");
      return;
    }

    if (form.category !== "wedding") {
      if (!form.baby_name.trim()) {
        alert(form.category === "aqiqah" ? "Nama bayi wajib diisi." : "Nama anak wajib diisi.");
        return;
      }
    } else if (!form.groom_name.trim() || !form.bride_name.trim()) {
      alert("Nama mempelai pria dan wanita wajib diisi.");
      return;
    }

    if (!form.slug.trim()) {
      alert("Slug wajib diisi.");
      return;
    }

    const cleanSlug = makeSlug(form.slug);
    if (!cleanSlug) {
      alert("Slug tidak valid. Gunakan huruf atau angka.");
      return;
    }

    setSaving(true);

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const { data: paidOrder } = authUser
      ? await supabase
          .from("checkout_orders")
          .select("id")
          .eq("auth_user_id", authUser.id)
          .eq("provision_status", "completed")
          .limit(1)
          .maybeSingle()
      : { data: null };

    const shouldAutoActivate = Boolean(paidOrder);

    const { data: inserted, error } = await supabase
      .from("invitations")
      .insert({
        ...form,
        ...cleanFields,
        slug: cleanSlug,
        client_id: clientId,
        is_active: shouldAutoActivate,
      })
      .select("id")
      .single();

    setSaving(false);

    if (error) {
      alert(`Gagal membuat undangan: ${error.message}`);
      return;
    }

    setInvitationId(inserted.id);
    alert(
      shouldAutoActivate
        ? "Undangan berhasil dibuat! Bisa terus dilengkapi/diubah kapan saja."
        : "Undangan berhasil dibuat dan sudah bisa dilengkapi. Link undangan akan aktif setelah pembayaran dikonfirmasi oleh admin/reseller Anda."
    );
  };

  if (loading) {
    return (
      <main className={styles.editPage}>
        <h2>Memuat data...</h2>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className={styles.editPage}>
        <h2>Gagal memuat data undangan Anda.</h2>
        <p>Terjadi gangguan koneksi ke server. Silakan coba lagi.</p>
        <button
          onClick={() => {
            setLoading(true);
            loadInvitation();
          }}
          className={styles.button}
        >
          Coba Lagi
        </button>
      </main>
    );
  }

  const brandStyle = brand?.brand_color
    ? ({ "--accent": brand.brand_color } as React.CSSProperties)
    : undefined;

  return (
    <main className={styles.editPage} style={brandStyle}>
      <div className={styles.editCard}>
        <div className={styles.editHeader}>
          <div>
            {brand?.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logo_url} alt={brand.brand_name} className={styles.brandLogo} />
            )}
            <p className={styles.label}>{brand?.brand_name ? `${brand.brand_name} DASHBOARD` : "CLIENT DASHBOARD"}</p>
            <h1 className={styles.title} style={{ fontSize: 36 }}>
              {invitationId ? "Edit Undangan" : "Buat Undangan"}
            </h1>
            <p className={styles.subtitle}>
              {invitationId
                ? "Ubah data undangan dan upload foto langsung dari dashboard."
                : "Lengkapi data di bawah untuk membuat undangan Anda. Setiap client hanya bisa punya satu undangan."}
            </p>
          </div>

          <button
            onClick={() => router.push("/client")}
            className={styles.secondaryButton}
          >
            Kembali
          </button>
        </div>

        {!invitationId && (
          <>
            <h2 className={styles.editSectionTitle}>Kategori, Tema &amp; Slug</h2>

            <div className={styles.formGrid}>
              <select value={form.category} onChange={(e) => setCategory(e.target.value as "wedding" | "aqiqah" | "khitan" | "birthday")} className={styles.input}>
                <option value="wedding">Pernikahan</option>
                <option value="aqiqah">Aqiqah</option>
                <option value="khitan">Khitan</option>
                <option value="birthday">Ulang Tahun</option>
              </select>

              <select value={form.theme} onChange={(e) => set("theme", e.target.value)} className={styles.input}>
                {(form.category === "aqiqah"
                  ? aqiqahThemeList
                  : form.category === "khitan"
                  ? khitanThemeList
                  : form.category === "birthday"
                  ? birthdayThemeList
                  : themeList
                ).map((theme) => (
                  <option key={theme.key} value={theme.key}>{theme.label}</option>
                ))}
              </select>

              <ThemePreviewPanel category={form.category} themeKey={form.theme} />

              <div className={styles.slugRow}>
                <input
                  placeholder="Slug, contoh: rizky-nabila"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  className={styles.input}
                />
                <button onClick={autoSlug} className={styles.smallButton}>Auto</button>
              </div>
            </div>

            <p className={styles.helpText} style={{ marginTop: -8 }}>
              Slug ini jadi bagian link undangan Anda, contoh: vistiqinvitation.com/{form.slug || "nama-anda"}
            </p>
          </>
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
        <p className={styles.helpText} style={{ marginTop: -8 }}>
          Bisa diisi sampai 5 bagian. Kosongkan part yang tidak digunakan.
        </p>

        {[1, 2, 3, 4, 5].map((n) => {
          const yearKey = `story_${n}_year` as keyof FormState;
          const titleKey = `story_${n}_title` as keyof FormState;
          const descKey = `story_${n}_desc` as keyof FormState;

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
            <strong>Drag & drop foto galeri di sini</strong>
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
            Maksimal 10 foto • Saat ini: {form.gallery_photos.length}/10 foto
          </p>

          <div className={styles.galleryGrid}>
            {form.gallery_photos.length === 0 ? (
              <div className={styles.emptyGallery}>Belum ada foto galeri</div>
            ) : (
              form.gallery_photos.map((photo, index) => (
                <div key={photo} className={styles.galleryItem}>
                  <img
                    src={photo}
                    alt={`Gallery ${index + 1}`}
                    className={styles.galleryImage}
                  />

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
          {saving ? "Menyimpan..." : invitationId ? "Simpan Perubahan" : "Buat Undangan"}
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

      <label
        className={styles.dropZone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {value ? (
          <img src={value} alt={title} className={styles.preview} />
        ) : (
          <div className={styles.dropContent}>
            <div className={styles.uploadIcon}>☁</div>
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
