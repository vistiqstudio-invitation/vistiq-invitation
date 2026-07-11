"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { themeList } from "@/lib/theme";
import styles from "@/styles/dashboard.module.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/reseller" },
  { key: "invitations", label: "Buat Undangan", href: "/reseller/invitations" },
  { key: "rsvp", label: "RSVP", href: "/reseller/rsvp" },
  { key: "transactions", label: "Komisi", href: "/reseller/transactions" },
  { key: "demo", label: "Demo Tema", href: "/demo", external: true },
];

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
  groom_name?: string;
  bride_name?: string;
  client_id?: string;
  status?: string;
  created_at: string;
};

export default function ResellerInvitationsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    client_id: "",
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
      .select("id, slug, theme, groom_name, bride_name, client_id, status, created_at")
      .in("client_id", clientIds)
      .order("created_at", { ascending: false });

    setInvitations(invitationsData ?? []);
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
    setForm({ ...form, slug: makeSlug(text) });
  };

  const addInvitation = async () => {
    if (!form.client_id) {
      alert("Pilih client terlebih dahulu.");
      return;
    }

    if (!form.groom_name.trim() || !form.bride_name.trim()) {
      alert("Nama mempelai pria dan wanita wajib diisi.");
      return;
    }

    if (!form.slug.trim()) {
      alert("Slug wajib diisi.");
      return;
    }

    const payload = { ...form, event_date: form.event_date || null };

    const { data: created, error } = await supabase
      .from("invitations")
      .insert(payload)
      .select("id")
      .single();

    if (error || !created) {
      alert("Gagal membuat undangan. Pastikan slug belum pernah dipakai.");
      return;
    }

    setForm({
      client_id: "",
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

    alert("Undangan berhasil dibuat. Lanjutkan mengisi foto, love story, dan amplop digital.");
    router.push(`/reseller/invitations/${created.id}`);
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

  const brandActive = reseller?.package === "reseller_brand" && Boolean(reseller?.brand_active);

  return (
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom={brandActive && reseller?.brand_name ? reseller.brand_name : "Reseller"}
        logoUrl={brandActive ? reseller?.logo_url : null}
        accentColor={brandActive ? reseller?.brand_color : null}
        items={NAV_ITEMS}
        activeKey="invitations"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>RESELLER DASHBOARD</p>
            <h1 className={styles.title}>Buat Undangan</h1>
            <p className={styles.subtitle}>
              Buatkan undangan digital untuk client Anda sesuai tema pilihan mereka.
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
              <h2 className={styles.sectionTitle}>Buat Undangan Baru</h2>

              <div className={styles.formGrid}>
                <select
                  value={form.client_id}
                  onChange={(e) => setForm({ ...form, client_id: e.target.value })}
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
                  value={form.theme}
                  onChange={(e) => setForm({ ...form, theme: e.target.value })}
                  className={styles.input}
                >
                  {themeList.map((theme) => (
                    <option key={theme.key} value={theme.key}>
                      {theme.label}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Nama Mempelai Pria"
                  value={form.groom_name}
                  onChange={(e) => setForm({ ...form, groom_name: e.target.value })}
                  className={styles.input}
                />

                <input
                  placeholder="Nama Mempelai Wanita"
                  value={form.bride_name}
                  onChange={(e) => setForm({ ...form, bride_name: e.target.value })}
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

                <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                  className={styles.input}
                />

                <input
                  placeholder="Lokasi Akad"
                  value={form.akad_location}
                  onChange={(e) => setForm({ ...form, akad_location: e.target.value })}
                  className={styles.input}
                />

                <input
                  placeholder="Lokasi Resepsi"
                  value={form.reception_location}
                  onChange={(e) => setForm({ ...form, reception_location: e.target.value })}
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
              <h2 className={styles.sectionTitle}>Undangan Client Saya</h2>

              {invitations.length === 0 ? (
                <p>Belum ada undangan.</p>
              ) : (
                <div className={styles.table}>
                  {invitations.map((item) => (
                    <div key={item.id} className={styles.row}>
                      <div>
                        <strong>
                          {item.groom_name || "-"} &amp; {item.bride_name || "-"}
                        </strong>
                        <p>/{item.slug}</p>
                      </div>

                      <span className={styles.packageBadge}>{item.theme}</span>

                      <span className={styles.status}>{item.status}</span>

                      <div className={styles.actions}>
                        <button
                          onClick={() => router.push(`/reseller/invitations/${item.id}`)}
                          className={styles.miniButton}
                        >
                          Lengkapi Data
                        </button>

                        <button onClick={() => openPreview(item.slug)} className={styles.miniButton}>
                          Preview
                        </button>

                        <button onClick={() => copyLink(item.slug)} className={styles.miniButtonGreen}>
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
