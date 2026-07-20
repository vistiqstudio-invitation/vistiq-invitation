"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { themeList, aqiqahThemeList, khitanThemeList } from "@/lib/theme";
import styles from "@/styles/dashboard.module.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/reseller" },
  { key: "invitations", label: "Buat Undangan", href: "/reseller/invitations" },
  { key: "rsvp", label: "RSVP", href: "/reseller/rsvp" },
  { key: "transactions", label: "Komisi", href: "/reseller/transactions" },
  { key: "demo", label: "Demo Tema", href: "/demo", external: true },
];

const BUCKET = "invitation-assets";

type PhotoField = "cover_photo" | "bride_photo" | "groom_photo" | "music_url";

type Reseller = {
  id: string;
  brand_name?: string | null;
  logo_url?: string | null;
  brand_color?: string | null;
  brand_active?: boolean;
  package?: "reseller" | "reseller_brand";
};

type Client = {
  id: string;
  name: string;
};

type Invitation = {
  id: number;
  slug: string;
  theme?: string;
  category?: "wedding" | "aqiqah" | "khitan";
  groom_name?: string;
  bride_name?: string;
  baby_name?: string;
  client_id?: string;
  is_active?: boolean;
  created_at: string;
};

type Transaction = {
  id: string;
  client_id: string;
  status?: string;
  reseller_confirmed_at?: string | null;
};

const initialForm = {
  client_id: "",
  category: "wedding" as "wedding" | "aqiqah" | "khitan",
  slug: "",
  theme: "luxury-gold",
  // Resellers can no longer flip this themselves - a new invitation stays
  // inactive until the owner confirms payment (admin/transactions) or
  // manually activates it (admin/invitations).
  is_active: false,

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

  // Aqiqah-only fields - a separate, much smaller field set for the
  // "aqiqah" category (see supabase/sql/019_add_aqiqah_category.sql).
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

export default function ResellerInvitationsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [transactionsByClientId, setTransactionsByClientId] = useState<Record<string, Transaction>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);

  const fetchData = async (resellerId: string) => {
    const { data: clientsData } = await supabase
      .from("clients")
      .select("id, name")
      .eq("reseller_id", resellerId)
      .order("created_at", { ascending: false });

    setClients(clientsData ?? []);

    const clientIds = (clientsData ?? []).map((c) => c.id);

    if (clientIds.length === 0) {
      setInvitations([]);
      setLoading(false);
      return;
    }

    const { data: invitationsData } = await supabase
      .from("invitations")
      .select("id, slug, theme, category, groom_name, bride_name, baby_name, client_id, is_active, created_at")
      .in("client_id", clientIds)
      .order("created_at", { ascending: false });

    setInvitations(invitationsData ?? []);

    const { data: transactionsData } = await supabase
      .from("transactions")
      .select("id, client_id, status, reseller_confirmed_at")
      .in("client_id", clientIds)
      .order("created_at", { ascending: false });

    const transactionMap: Record<string, Transaction> = {};
    for (const t of transactionsData ?? []) {
      // Most recent transaction per client wins - a client normally only
      // ever has one anyway (see the 012 trigger).
      if (!(t.client_id in transactionMap)) {
        transactionMap[t.client_id] = t;
      }
    }
    setTransactionsByClientId(transactionMap);

    setLoading(false);
  };

  useEffect(() => {
    const loadUser = async () => {
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
        .select("*")
        .eq("user_id", authUser.id);

      const currentReseller = resellerData?.[0] || null;
      setReseller(currentReseller);

      if (!currentReseller) {
        setLoading(false);
        return;
      }

      fetchData(currentReseller.id);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const makeSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/&/g, "dan")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const autoSlug = () => {
    const text =
      form.category === "aqiqah"
        ? `akikah-${form.baby_name}`
        : form.category === "khitan"
        ? `khitan-${form.baby_name}`
        : `${form.groom_name}-${form.bride_name}`;
    set("slug", makeSlug(text));
  };

  const setCategory = (category: "wedding" | "aqiqah" | "khitan") => {
    setForm((prev) => ({
      ...prev,
      category,
      theme:
        category === "aqiqah"
          ? aqiqahThemeList[0]?.key || ""
          : category === "khitan"
          ? khitanThemeList[0]?.key || ""
          : "luxury-gold",
    }));
  };

  // Uploaded before the invitation row exists, so photos live under the
  // reseller's own storage folder (already writable per migration 010)
  // instead of an invitation-id folder. The public URL still works fine
  // once saved into the new invitation row.
  const uploadToStorage = async (file: File, folder: string) => {
    if (!reseller) return "";

    const ext = file.name.split(".").pop();
    const fileName = `resellers/${reseller.id}/drafts/${folder}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      alert(`Upload gagal: ${error.message}`);
      return "";
    }

    return supabase.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
  };

  const uploadSingleFile = async (file: File, field: PhotoField) => {
    const publicUrl = await uploadToStorage(file, field);
    if (!publicUrl) return;

    set(field, publicUrl);
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
  };

  const removeGalleryPhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery_photos: prev.gallery_photos.filter((_, i) => i !== index),
    }));
  };

  const addInvitation = async () => {
    if (!form.client_id) {
      alert("Pilih client terlebih dahulu.");
      return;
    }

    if (form.category === "aqiqah" || form.category === "khitan") {
      if (!form.baby_name.trim()) {
        alert(form.category === "khitan" ? "Nama anak wajib diisi." : "Nama bayi wajib diisi.");
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

    const { error } = await supabase.from("invitations").insert(payload);

    setSaving(false);

    if (error) {
      alert(`Gagal membuat undangan: ${error.message}`);
      return;
    }

    setForm(initialForm);
    if (reseller) fetchData(reseller.id);
    alert("Undangan berhasil dibuat dan siap dibagikan ke tamu.");
  };

  const confirmPayment = async (transactionId: string) => {
    setConfirmingId(transactionId);

    const { error } = await supabase.rpc("confirm_payment_notification", {
      p_transaction_id: transactionId,
    });

    setConfirmingId(null);

    if (error) {
      alert(`Gagal mengirim konfirmasi: ${error.message}`);
      return;
    }

    if (reseller) fetchData(reseller.id);
    alert("Konfirmasi terkirim. Admin akan memverifikasi pembayaran dan mengaktifkan undangan.");
  };

  const copyLink = async (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(url);
    alert("Link undangan berhasil disalin.");
  };

  const openPreview = (slug: string) => {
    window.open(`/preview/${slug}`, "_blank");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const brandActive = reseller?.package === "reseller_brand" && Boolean(reseller?.brand_active);
  const brandName = brandActive && reseller?.brand_name ? reseller.brand_name : null;
  const brandStyle = brandActive && reseller?.brand_color
    ? ({ "--accent": reseller.brand_color } as React.CSSProperties)
    : undefined;

  return (
    <main className={styles.page} style={brandStyle}>
      <DashboardSidebar
        brandTop={brandName ? brandName.toUpperCase() : "VISTIQ"}
        brandBottom={brandName ? "Reseller Brand" : "Reseller"}
        logoUrl={brandActive ? reseller?.logo_url : null}
        accentColor={brandActive ? reseller?.brand_color : null}
        items={NAV_ITEMS}
        activeKey="invitations"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>{brandName ? `${brandName} DASHBOARD` : "RESELLER DASHBOARD"}</p>
            <h1 className={styles.title}>Buat Undangan</h1>
            <p className={styles.subtitle}>
              Buatkan undangan digital lengkap untuk client Anda, langsung siap dibagikan.
            </p>
          </div>

          <button onClick={() => reseller && fetchData(reseller.id)} className={styles.button}>
            Refresh
          </button>
        </header>

        {loading ? (
          <p>Memuat data...</p>
        ) : !reseller ? (
          <section className={styles.warningBox}>
            <h2>Akun reseller belum terhubung.</h2>
          </section>
        ) : clients.length === 0 ? (
          <section className={styles.warningBox}>
            <h2>Belum ada client.</h2>
            <p>Tambahkan client dulu di halaman Dashboard sebelum membuat undangan.</p>
          </section>
        ) : (
          <>
            <section className={styles.formCard}>
              <h2 className={styles.sectionTitle}>Client &amp; Tema</h2>

              <div className={styles.formGrid}>
                <select
                  value={form.client_id}
                  onChange={(e) => set("client_id", e.target.value)}
                  className={styles.input}
                >
                  <option value="">Pilih Client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={form.category}
                  onChange={(e) => setCategory(e.target.value as "wedding" | "aqiqah" | "khitan")}
                  className={styles.input}
                >
                  <option value="wedding">Pernikahan</option>
                  <option value="aqiqah">Aqiqah</option>
                  <option value="khitan">Khitan</option>
                </select>

                <select value={form.theme} onChange={(e) => set("theme", e.target.value)} className={styles.input}>
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

                <div className={styles.slugRow}>
                  <input
                    placeholder="Slug, contoh: rizky-nabila"
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value)}
                    className={styles.input}
                  />

                  <button onClick={autoSlug} className={styles.smallButton}>
                    Auto
                  </button>
                </div>

                <div className={styles.input} style={{ display: "flex", alignItems: "center", color: "#92400e" }}>
                  Menunggu Pembayaran - diaktifkan otomatis setelah dikonfirmasi admin
                </div>
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
                <p className={styles.helpText}>Upload maksimal 10 foto galeri.</p>

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

              <button onClick={addInvitation} className={styles.button} disabled={saving} style={{ marginTop: 24 }}>
                {saving ? "Menyimpan..." : "Simpan Undangan"}
              </button>
            </section>

            <section className={styles.tableWrap}>
              <h2 className={styles.sectionTitle}>Undangan Client Saya</h2>

              {invitations.length === 0 ? (
                <p>Belum ada undangan.</p>
              ) : (
                <div className={styles.table}>
                  {invitations.map((item) => {
                    const transaction = item.client_id ? transactionsByClientId[item.client_id] : null;
                    const alreadyConfirmed = Boolean(transaction?.reseller_confirmed_at);

                    return (
                    <div key={item.id} className={styles.row}>
                      <div>
                        <strong>
                          {item.category === "aqiqah" || item.category === "khitan"
                            ? item.baby_name || "-"
                            : `${item.groom_name || "-"} & ${item.bride_name || "-"}`}
                        </strong>
                        <p>/{item.slug}</p>
                      </div>

                      <span className={styles.packageBadge}>{item.theme}</span>

                      <span className={styles.status}>
                        {item.is_active === false ? "Menunggu Pembayaran" : "Aktif"}
                      </span>

                      {item.is_active === false && transaction && transaction.status !== "paid" && (
                        alreadyConfirmed ? (
                          <span style={{ fontSize: 12, color: "#0369a1" }}>
                            Menunggu verifikasi admin
                          </span>
                        ) : (
                          <button
                            onClick={() => confirmPayment(transaction.id)}
                            disabled={confirmingId === transaction.id}
                            className={styles.miniButtonGreen}
                          >
                            {confirmingId === transaction.id ? "Mengirim..." : "Konfirmasi Sudah Bayar"}
                          </button>
                        )
                      )}

                      <div className={styles.actions}>
                        <button
                          onClick={() => router.push(`/reseller/invitations/${item.id}`)}
                          className={styles.miniButton}
                        >
                          Edit
                        </button>

                        <button onClick={() => openPreview(item.slug)} className={styles.miniButton}>
                          Preview
                        </button>

                        <button onClick={() => copyLink(item.slug)} className={styles.miniButtonGreen}>
                          Copy
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </section>
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
