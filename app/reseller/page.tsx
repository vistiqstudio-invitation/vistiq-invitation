"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

type AppUser = {
  id: string;
  role: "owner" | "reseller" | "client";
  name: string;
  email: string;
};

type Reseller = {
  id: string;
  user_id?: string;
  name: string;
  commission_percent?: number;
  status?: string;
};

type Client = {
  id: string;
  reseller_id?: string;
  name: string;
  whatsapp?: string;
  package_name?: string;
  status?: string;
  created_at: string;
};

export default function ResellerPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<AppUser | null>(null);
  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    package_name: "Luxury Gold",
    status: "active",
  });

  const fetchData = async (currentUser: AppUser) => {
    const { data: resellerData } = await supabase
      .from("resellers")
      .select("*")
      .eq("user_id", currentUser.id);

    const currentReseller = resellerData?.[0];

    setReseller(currentReseller || null);

    if (!currentReseller) {
      setLoading(false);
      return;
    }

    const { data: clientsData } = await supabase
      .from("clients")
      .select("*")
      .eq("reseller_id", currentReseller.id)
      .order("created_at", { ascending: false });

    setClients(clientsData ?? []);
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
        .select("role, name")
        .eq("id", authUser.id)
        .single();

      if (!profile || profile.role !== "reseller") {
        router.push("/login");
        return;
      }

      const parsedUser: AppUser = {
        id: authUser.id,
        role: profile.role,
        name: profile.name || "Reseller",
        email: authUser.email || "",
      };

      setUser(parsedUser);
      fetchData(parsedUser);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const addClient = async () => {
    if (!reseller) {
      alert("Akun reseller belum terhubung.");
      return;
    }

    if (!form.name.trim()) {
      alert("Nama client wajib diisi.");
      return;
    }

    const payload = {
      reseller_id: reseller.id,
      name: form.name,
      whatsapp: form.whatsapp,
      package_name: form.package_name,
      status: form.status,
    };

    const { error } = await supabase.from("clients").insert(payload);

    if (error) {
      alert("Gagal menambahkan client.");
      return;
    }

    setForm({
      name: "",
      whatsapp: "",
      package_name: "Luxury Gold",
      status: "active",
    });

    if (user) fetchData(user);

    alert("Client berhasil ditambahkan.");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <p className={styles.brandSmall}>VISTIQ</p>
          <h2 className={styles.brand}>Reseller</h2>
        </div>

        <nav className={styles.menu}>
          <button className={styles.menuActive}>Dashboard</button>
          <button className={styles.menuButton}>Client Saya</button>
          <button className={styles.menuButton}>Undangan Saya</button>
          <button className={styles.menuButton}>Komisi</button>
        </nav>

        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>RESELLER DASHBOARD</p>
            <h1 className={styles.title}>Halo, {user?.name || "Reseller"}</h1>
            <p className={styles.subtitle}>
              Tambah client dan pantau client milik Anda.
            </p>
          </div>

          <button
            onClick={() => user && fetchData(user)}
            className={styles.button}
          >
            Refresh
          </button>
        </header>

        {loading ? (
          <p>Memuat dashboard...</p>
        ) : !reseller ? (
          <section className={styles.warningBox}>
            <h2>Akun reseller belum terhubung.</h2>
            <p>Hubungkan user login ini dengan tabel resellers.</p>
          </section>
        ) : (
          <>
            <section className={styles.stats}>
              <div className={styles.statCard}>
                <span>Total Client</span>
                <strong>{clients.length}</strong>
              </div>

              <div className={styles.statCard}>
                <span>Komisi</span>
                <strong>{reseller.commission_percent || 0}%</strong>
              </div>

              <div className={styles.statCard}>
                <span>Status</span>
                <strong>{reseller.status || "active"}</strong>
              </div>
            </section>

            <section className={styles.formCard}>
              <h2 className={styles.sectionTitle}>Tambah Client Baru</h2>

              <div className={styles.formGrid}>
                <input
                  placeholder="Nama Client / Nama Pasangan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={styles.input}
                />

                <input
                  placeholder="Nomor WhatsApp"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm({ ...form, whatsapp: e.target.value })
                  }
                  className={styles.input}
                />

                <select
                  value={form.package_name}
                  onChange={(e) =>
                    setForm({ ...form, package_name: e.target.value })
                  }
                  className={styles.input}
                >
                  <option>Luxury Gold</option>
                  <option>Luxury White</option>
                  <option>Royal Black</option>
                  <option>Islamic Emerald</option>
                  <option>Floral Garden</option>
                </select>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className={styles.input}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button onClick={addClient} className={styles.button}>
                Simpan Client
              </button>
            </section>

            <section className={styles.tableWrap}>
              <h2 className={styles.sectionTitle}>Client Saya</h2>

              {clients.length === 0 ? (
                <p>Belum ada client.</p>
              ) : (
                <div className={styles.table}>
                  {clients.map((client) => (
                    <div key={client.id} className={styles.row}>
                      <div>
                        <strong>{client.name}</strong>
                        <p>{client.whatsapp || "-"}</p>
                      </div>

                      <span className={styles.badge}>
                        {client.package_name || "-"}
                      </span>

                      <span className={styles.status}>{client.status}</span>

                      <p className={styles.date}>
                        {new Date(client.created_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
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
