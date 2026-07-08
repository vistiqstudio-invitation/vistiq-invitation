"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
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
  groom_name?: string;
  bride_name?: string;
  event_date?: string;
  akad_location?: string;
  reception_location?: string;
  maps_url?: string;
  status?: string;
  created_at: string;
};

export default function InvitationsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    slug: "",
    theme: "luxury-gold",
    groom_name: "",
    bride_name: "",
    event_date: "",
    akad_location: "",
    reception_location: "",
    maps_url: "",
    status: "active",
  });

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
    const text = `${form.groom_name}-${form.bride_name}`;
    setForm({
      ...form,
      slug: makeSlug(text),
    });
  };

  const addInvitation = async () => {
    if (!form.groom_name.trim() || !form.bride_name.trim()) {
      alert("Nama mempelai pria dan wanita wajib diisi.");
      return;
    }

    if (!form.slug.trim()) {
      alert("Slug wajib diisi.");
      return;
    }

    const payload = {
      ...form,
      event_date: form.event_date || null,
    };

    const { error } = await supabase.from("invitations").insert(payload);

    if (error) {
      alert("Gagal membuat undangan. Pastikan slug belum pernah dipakai.");
      return;
    }

    setForm({
      slug: "",
      theme: "luxury-gold",
      groom_name: "",
      bride_name: "",
      event_date: "",
      akad_location: "",
      reception_location: "",
      maps_url: "",
      status: "active",
    });

    fetchInvitations();
    alert("Undangan berhasil dibuat.");
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("invitations").update({ status }).eq("id", id);
    fetchInvitations();
  };

  const copyLink = async (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(url);
    alert("Link undangan berhasil disalin.");
  };

  const openPreview = (slug: string) => {
    window.open(`/${slug}?to=Bapak%20Ahmad`, "_blank");
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
              <option value="luxury-gold">Luxury Gold</option>
              <option value="minimal-white">Minimal White</option>
              <option value="islamic-green">Islamic Green</option>
              <option value="royal-black">Royal Black</option>
              <option value="floral-garden">Floral Garden</option>
              <option value="emerald-lantern">Emerald Lantern</option>
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
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={styles.input}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>

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
              {invitations.map((item) => (
                <div key={item.id} className={styles.row}>
                  <div>
                    <strong>
                      {item.groom_name || "-"} & {item.bride_name || "-"}
                    </strong>
                    <p>/{item.slug}</p>
                  </div>

                  <span className={styles.packageBadge}>{item.theme}</span>

                  <select
                    value={item.status || "active"}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <div className={styles.actions}>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
