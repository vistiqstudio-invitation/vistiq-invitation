"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

type Client = {
  id: string;
  name: string;
  whatsapp?: string;
  package_name?: string;
  status?: string;
  created_at: string;
};

export default function ClientsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    package_name: "Luxury Gold",
    status: "active",
  });

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setClients(data ?? []);
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

      fetchClients();
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const addClient = async () => {
    if (!form.name.trim()) {
      alert("Nama client wajib diisi.");
      return;
    }

    const { error } = await supabase.from("clients").insert(form);

    if (error) {
      console.error(error);
      alert("Gagal menambahkan client.");
      return;
    }

    setForm({
      name: "",
      whatsapp: "",
      package_name: "Luxury Gold",
      status: "active",
    });

    fetchClients();
    alert("Client berhasil ditambahkan.");
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("clients")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    fetchClients();
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
          <h2 className={styles.brand}>Invitation</h2>
        </div>

        <nav className={styles.menu}>
          <button
            onClick={() => router.push("/admin")}
            className={styles.menuButton}
          >
            Dashboard
          </button>

          <button className={styles.menuActive}>Client</button>

          <button
            onClick={() => router.push("/admin/resellers")}
            className={styles.menuButton}
          >
            Reseller
          </button>

          <button
            onClick={() => router.push("/admin/invitations")}
            className={styles.menuButton}
          >
            Undangan
          </button>
        </nav>

        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>OWNER MENU</p>
            <h1 className={styles.title}>Data Client</h1>
            <p className={styles.subtitle}>
              Kelola client yang membeli layanan undangan digital.
            </p>
          </div>

          <button onClick={fetchClients} className={styles.button}>
            Refresh
          </button>
        </header>

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
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
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
              onChange={(e) => setForm({ ...form, status: e.target.value })}
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
          <h2 className={styles.sectionTitle}>Daftar Client</h2>

          {loading ? (
            <p>Memuat data...</p>
          ) : clients.length === 0 ? (
            <p>Belum ada client.</p>
          ) : (
            <div className={styles.table}>
              {clients.map((client) => (
                <div key={client.id} className={styles.row}>
                  <div>
                    <strong>{client.name}</strong>
                    <p>{client.whatsapp || "-"}</p>
                  </div>

                  <span className={styles.packageBadge}>
                    {client.package_name || "-"}
                  </span>

                  <select
                    value={client.status || "active"}
                    onChange={(e) => updateStatus(client.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <p className={styles.date}>
                    {new Date(client.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
