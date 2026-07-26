"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { themeList, aqiqahThemeList, khitanThemeList } from "@/lib/theme";
import styles from "@/styles/dashboard.module.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/admin" },
  { key: "clients", label: "Client", href: "/admin/clients" },
  { key: "resellers", label: "Reseller", href: "/admin/resellers" },
  { key: "invitations", label: "Undangan", href: "/admin/invitations" },
  { key: "rsvp", label: "RSVP", href: "/admin/rsvp" },
  { key: "transactions", label: "Transaksi", href: "/admin/transactions" },
];

type Invitation = {
  id: string;
  slug: string;
  theme?: string;
  category?: "wedding" | "aqiqah" | "khitan";
  groom_name?: string;
  bride_name?: string;
  baby_name?: string;
  event_date?: string;
  akad_location?: string;
  reception_location?: string;
  aqiqah_location?: string;
  maps_url?: string;
  is_active?: boolean;
  client_id?: string | null;
  created_at: string;
};

type ClientInfo = {
  name: string;
  resellerName: string | null;
};

export default function InvitationsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [clientsById, setClientsById] = useState<Record<string, ClientInfo>>({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const initialForm = {
    category: "wedding" as "wedding" | "aqiqah" | "khitan",
    slug: "",
    theme: "luxury-gold",
    groom_name: "",
    bride_name: "",
    baby_name: "",
    event_date: "",
    akad_location: "",
    reception_location: "",
    aqiqah_location: "",
    maps_url: "",
    is_active: true,
  };

  const [form, setForm] = useState(initialForm);

  const fetchInvitations = async () => {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setInvitations(data ?? []);
    }

    // Owner sees every client/reseller regardless of who created what, so
    // this doubles as the "who does this invitation belong to" lookup -
    // the point being every invitation's origin is visible in one place,
    // not scattered across the clients/resellers/transactions pages.
    const { data: clientsData } = await supabase
      .from("clients")
      .select("id, name, resellers:reseller_id(name)");

    const clientMap: Record<string, ClientInfo> = {};
    for (const c of clientsData ?? []) {
      const reseller = c.resellers as unknown as { name: string } | null;
      clientMap[c.id] = { name: c.name, resellerName: reseller?.name ?? null };
    }
    setClientsById(clientMap);

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

      if (!profile || profile.role !== "owner") {
        router.push("/login");
        return;
      }

      fetchInvitations();
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

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
    setForm({
      ...form,
      slug: makeSlug(text),
    });
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

  const addInvitation = async () => {
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

    // Always normalize on save - typing directly into the slug field
    // (instead of clicking "Auto") used to save raw text as-is (spaces,
    // capital letters, "&"), producing broken-looking share links.
    const cleanSlug = makeSlug(form.slug);
    if (!cleanSlug) {
      alert("Slug tidak valid. Gunakan huruf atau angka.");
      return;
    }

    const payload = {
      ...form,
      slug: cleanSlug,
      event_date: form.event_date || null,
    };

    const { error } = await supabase.from("invitations").insert(payload);

    if (error) {
      alert(`Gagal membuat undangan: ${error.message}`);
      return;
    }

    setForm(initialForm);

    fetchInvitations();
    alert("Undangan berhasil dibuat.");
  };

  const updateActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from("invitations").update({ is_active }).eq("id", id);

    if (error) {
      alert(`Gagal mengubah status undangan: ${error.message}`);
      return;
    }

    fetchInvitations();
  };

  const copyLink = async (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(url);
    alert("Link undangan berhasil disalin.");
  };

  const openPreview = (slug: string) => {
    window.open(`/preview/${slug}`, "_blank");
  };

  const deleteInvitation = async (id: string, label: string) => {
    if (!confirm(`Hapus undangan "${label}"? Data RSVP dan wishes yang menyertainya juga akan ikut terhapus. Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }

    setDeletingId(id);

    const { error } = await supabase.from("invitations").delete().eq("id", id);

    setDeletingId(null);

    if (error) {
      alert(`Gagal menghapus undangan: ${error.message}`);
      return;
    }

    fetchInvitations();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Invitation"
        items={NAV_ITEMS}
        activeKey="invitations"
        notificationRole="owner"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>OWNER MENU</p>
            <h1 className={styles.title}>Data Undangan</h1>
            <p className={styles.subtitle}>
              Kelola undangan digital client dan generate link undangan.
            </p>
          </div>

          <button onClick={fetchInvitations} className={styles.button}>
            Refresh
          </button>
        </header>

        <section className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Tambah Undangan Baru</h2>

          <div className={styles.formGrid}>
            <select
              value={form.category}
              onChange={(e) => setCategory(e.target.value as "wedding" | "aqiqah" | "khitan")}
              className={styles.input}
            >
              <option value="wedding">Pernikahan</option>
              <option value="aqiqah">Aqiqah</option>
              <option value="khitan">Khitan</option>
            </select>

            {form.category === "aqiqah" || form.category === "khitan" ? (
              <input
                placeholder={form.category === "khitan" ? "Nama Anak" : "Nama Bayi"}
                value={form.baby_name}
                onChange={(e) => setForm({ ...form, baby_name: e.target.value })}
                className={styles.input}
                style={{ gridColumn: "span 2" }}
              />
            ) : (
              <>
                <input
                  placeholder="Nama Mempelai Pria"
                  value={form.groom_name}
                  onChange={(e) =>
                    setForm({ ...form, groom_name: e.target.value })
                  }
                  className={styles.input}
                />

                <input
                  placeholder="Nama Mempelai Wanita"
                  value={form.bride_name}
                  onChange={(e) =>
                    setForm({ ...form, bride_name: e.target.value })
                  }
                  className={styles.input}
                />
              </>
            )}

            <div className={styles.slugRow}>
              <input
                placeholder="Slug, contoh: rizky-nabila"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={styles.input}
              />

              <button onClick={autoSlug} className={styles.smallButton}>
                Auto
              </button>
            </div>

            <select
              value={form.theme}
              onChange={(e) => setForm({ ...form, theme: e.target.value })}
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

            <input
              type="date"
              value={form.event_date}
              onChange={(e) =>
                setForm({ ...form, event_date: e.target.value })
              }
              className={styles.input}
            />

            <select
              value={form.is_active ? "active" : "inactive"}
              onChange={(e) => setForm({ ...form, is_active: e.target.value === "active" })}
              className={styles.input}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {form.category === "aqiqah" || form.category === "khitan" ? (
              <input
                placeholder={form.category === "khitan" ? "Lokasi Acara Khitan" : "Lokasi Acara Aqiqah"}
                value={form.aqiqah_location}
                onChange={(e) =>
                  setForm({ ...form, aqiqah_location: e.target.value })
                }
                className={styles.input}
                style={{ gridColumn: "1 / -1" }}
              />
            ) : (
              <>
                <input
                  placeholder="Lokasi Akad"
                  value={form.akad_location}
                  onChange={(e) =>
                    setForm({ ...form, akad_location: e.target.value })
                  }
                  className={styles.input}
                />

                <input
                  placeholder="Lokasi Resepsi"
                  value={form.reception_location}
                  onChange={(e) =>
                    setForm({ ...form, reception_location: e.target.value })
                  }
                  className={styles.input}
                />
              </>
            )}

            <input
              placeholder="Google Maps URL"
              value={form.maps_url}
              onChange={(e) => setForm({ ...form, maps_url: e.target.value })}
              className={styles.input}
              style={{ gridColumn: "1 / -1" }}
            />
          </div>

          <button onClick={addInvitation} className={styles.button}>
            Simpan Undangan
          </button>
        </section>

        <section className={styles.tableWrap}>
          <h2 className={styles.sectionTitle}>Daftar Undangan</h2>

          {loading ? (
            <p>Memuat data...</p>
          ) : invitations.length === 0 ? (
            <p>Belum ada undangan.</p>
          ) : (
            <div className={styles.table}>
              {invitations.map((item) => {
                const client = item.client_id ? clientsById[item.client_id] : null;

                return (
                <div key={item.id} className={styles.row}>
                  <div>
                    <strong>
                      {item.category === "aqiqah" || item.category === "khitan"
                        ? item.baby_name || "-"
                        : `${item.groom_name || "-"} & ${item.bride_name || "-"}`}
                    </strong>
                    <p>/{item.slug}</p>
                    {client ? (
                      <p style={{ fontSize: 12, opacity: 0.75 }}>
                        Client: {client.name}
                        {client.resellerName ? ` · Reseller: ${client.resellerName}` : " · Direct (Owner)"}
                      </p>
                    ) : (
                      <p style={{ fontSize: 12, opacity: 0.75 }}>Tanpa client (dibuat manual)</p>
                    )}
                  </div>

                  <span className={styles.packageBadge}>{item.theme}</span>

                  {/* Tied 1:1 to is_active (not the separate transaction
                      record) so this label can never drift out of sync
                      with the Active/Inactive dropdown next to it. */}
                  <span className={styles.status}>
                    {item.is_active === false ? "Menunggu Pembayaran" : "Aktif"}
                  </span>

                  <select
                    value={item.is_active === false ? "inactive" : "active"}
                    onChange={(e) => updateActive(item.id, e.target.value === "active")}
                    className={styles.statusSelect}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <div className={styles.actions}>
                    <button
                      onClick={() => router.push(`/admin/invitations/${item.id}`)}
                      className={styles.miniButton}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => openPreview(item.slug)}
                      className={styles.miniButton}
                    >
                      Preview
                    </button>

                    <button
                      onClick={() => copyLink(item.slug)}
                      className={styles.miniButtonGreen}
                    >
                      Copy
                    </button>

                    <button
                      onClick={() =>
                        deleteInvitation(
                          item.id,
                          item.category === "aqiqah" || item.category === "khitan"
                            ? item.baby_name || item.slug
                            : `${item.groom_name || "-"} & ${item.bride_name || "-"}`
                        )
                      }
                      disabled={deletingId === item.id}
                      className={styles.miniButtonRed}
                    >
                      {deletingId === item.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
