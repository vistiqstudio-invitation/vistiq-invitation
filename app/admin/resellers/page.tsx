"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

type Reseller = {
  id: string;
  name: string;
  whatsapp?: string;
  commission_percent?: number;
  status?: string;
  created_at: string;
};

export default function ResellersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    commission_percent: 20,
    status: "active",
  });

  const fetchResellers = async () => {
    const { data, error } = await supabase
      .from("resellers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setResellers(data ?? []);
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

      fetchResellers();
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const addReseller = async () => {
    if (!form.name.trim()) {
      alert("Nama reseller wajib diisi.");
      return;
    }

    const { error } = await supabase.from("resellers").insert(form);

    if (error) {
      alert("Gagal menambahkan reseller.");
      return;
    }

    setForm({
      name: "",
      whatsapp: "",
      commission_percent: 20,
      status: "active",
    });

    fetchResellers();
    alert("Reseller berhasil ditambahkan.");
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("resellers").update({ status }).eq("id", id);
    fetchResellers();
  };

  const updateCommission = async (id: string, commission_percent: number) => {
    await supabase
      .from("resellers")
      .update({ commission_percent })
      .eq("id", id);

    fetchResellers();
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

          <button
            onClick={() => router.push("/admin/clients")}
            className={styles.menuButton}
          >
            Client
          </button>

          <button className={styles.menuActive}>Reseller</button>

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
            <h1 className={styles.title}>Data Reseller</h1>
            <p className={styles.subtitle}>
              Kelola reseller, status, dan persentase komisi.
            </p>
          </div>

          <button onClick={fetchResellers} className={styles.button}>
            Refresh
          </button>
        </header>

        <section className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Tambah Reseller Baru</h2>

          <div className={styles.formGrid}>
            <input
              placeholder="Nama Reseller"
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

            <input
              type="number"
              placeholder="Komisi (%)"
              value={form.commission_percent}
              onChange={(e) =>
                setForm({
                  ...form,
                  commission_percent: Number(e.target.value),
                })
              }
              className={styles.input}
            />

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

          <button onClick={addReseller} className={styles.button}>
            Simpan Reseller
          </button>
        </section>

        <section className={styles.tableWrap}>
          <h2 className={styles.sectionTitle}>Daftar Reseller</h2>

          {loading ? (
            <p>Memuat data...</p>
          ) : resellers.length === 0 ? (
            <p>Belum ada reseller.</p>
          ) : (
            <div className={styles.table}>
              {resellers.map((reseller) => (
                <div key={reseller.id} className={styles.row}>
                  <div>
                    <strong>{reseller.name}</strong>
                    <p>{reseller.whatsapp || "-"}</p>
                  </div>

                  <input
                    type="number"
                    value={reseller.commission_percent || 0}
                    onChange={(e) =>
                      updateCommission(reseller.id, Number(e.target.value))
                    }
                    className={styles.smallInput}
                  />

                  <select
                    value={reseller.status || "active"}
                    onChange={(e) => updateStatus(reseller.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <p className={styles.date}>
                    {new Date(reseller.created_at).toLocaleDateString("id-ID")}
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
