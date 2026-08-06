"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { themeList, aqiqahThemeList, khitanThemeList, birthdayThemeList } from "@/lib/theme";
import styles from "@/styles/dashboard.module.css";

function toWaNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return `62${digits}`;
}

function categoryForPackageName(packageName: string) {
  if (aqiqahThemeList.some((theme) => theme.label === packageName)) return "aqiqah";
  if (khitanThemeList.some((theme) => theme.label === packageName)) return "khitan";
  if (birthdayThemeList.some((theme) => theme.label === packageName)) return "birthday";
  return "wedding";
}

const DATA_CHECKLIST: Record<string, string> = {
  wedding:
    "- Nama lengkap mempelai pria & wanita (+ nama orang tua masing-masing)\n- Instagram mempelai (opsional)\n- Tanggal, jam & lokasi Akad\n- Tanggal, jam & lokasi Resepsi (+ link Google Maps)\n- Foto cover & foto mempelai (pria/wanita)\n- Galeri foto\n- Nomor rekening mempelai pria & wanita (untuk amplop digital)\n- Cerita cinta / love story (opsional)\n- Musik latar (opsional)",
  aqiqah:
    "- Nama bayi & jenis kelamin\n- Tanggal & tempat lahir\n- Nama ayah & ibu\n- Tanggal, jam & lokasi acara Aqiqah\n- Foto bayi\n- Galeri foto\n- Nomor rekening (untuk amplop digital, opsional)\n- Musik latar (opsional)",
  khitan:
    "- Nama anak\n- Tanggal & tempat lahir\n- Nama ayah & ibu\n- Tanggal, jam & lokasi acara Khitan\n- Foto anak\n- Galeri foto\n- Nomor rekening (untuk amplop digital, opsional)\n- Musik latar (opsional)",
  birthday:
    "- Nama anak\n- Tanggal & tempat lahir\n- Nama ayah & ibu\n- Tanggal, jam & lokasi acara Ulang Tahun\n- Foto anak\n- Galeri foto\n- Musik latar (opsional)",
};

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/admin" },
  { key: "clients", label: "Client", href: "/admin/clients" },
  { key: "resellers", label: "Reseller", href: "/admin/resellers" },
  { key: "invitations", label: "Undangan", href: "/admin/invitations" },
  { key: "musik", label: "Musik", href: "/admin/musik" },
  { key: "rsvp", label: "RSVP", href: "/admin/rsvp" },
  { key: "transactions", label: "Transaksi", href: "/admin/transactions" },
];

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
    email: "",
    whatsapp: "",
    package_name: "Luxury Gold",
    status: "active",
  });
  const [addingClient, setAddingClient] = useState(false);
  const [newClientCredentials, setNewClientCredentials] = useState<{
    name: string;
    email: string;
    password: string;
    whatsapp: string;
    packageName: string;
  } | null>(null);

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
    if (!form.name.trim() || !form.email.trim()) {
      alert("Nama dan email client wajib diisi (email dipakai untuk login client).");
      return;
    }

    setAddingClient(true);

    const response = await fetch("/api/create-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    setAddingClient(false);

    if (!response.ok) {
      alert(`Gagal menambahkan client: ${result.error}`);
      return;
    }

    setNewClientCredentials({
      name: form.name,
      email: result.email,
      password: result.password,
      whatsapp: form.whatsapp,
      packageName: form.package_name,
    });

    setForm({
      name: "",
      email: "",
      whatsapp: "",
      package_name: "Luxury Gold",
      status: "active",
    });

    fetchClients();
  };

  const clientCredentialsMessage = () => {
    if (!newClientCredentials) return "";
    const category = categoryForPackageName(newClientCredentials.packageName);
    const checklist = DATA_CHECKLIST[category];
    return `Halo ${newClientCredentials.name}, berikut akun login dashboard undangan Anda di Vistiq Invitation:\n\nLink: ${window.location.origin}/login\nEmail: ${newClientCredentials.email}\nPassword: ${newClientCredentials.password}\n\nLewat dashboard ini Anda bisa generate link undangan per nama tamu, lihat RSVP, dan edit undangan.\n\nSupaya undangannya bisa langsung dipakai, mohon siapkan data berikut untuk diisi di dashboard:\n${checklist}\n\nKalau ada pertanyaan, jangan sungkan hubungi kami ya. Terima kasih!`;
  };

  const copyClientCredentials = async () => {
    if (!newClientCredentials) return;

    await navigator.clipboard.writeText(clientCredentialsMessage());
    alert("Pesan berhasil disalin, tinggal paste ke WhatsApp client.");
  };

  const clientWaLink = () => {
    if (!newClientCredentials?.whatsapp) return "";
    return `https://wa.me/${toWaNumber(newClientCredentials.whatsapp)}?text=${encodeURIComponent(clientCredentialsMessage())}`;
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("clients")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(`Gagal mengubah status client: ${error.message}`);
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
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Invitation"
        items={NAV_ITEMS}
        activeKey="clients"
        notificationRole="owner"
        onLogout={logout}
      />

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
          <p style={{ marginTop: -8, marginBottom: 16, fontSize: 13, opacity: 0.75 }}>
            Email dipakai untuk membuatkan akun login dashboard client secara
            otomatis - client bisa generate link tamu, lihat RSVP, dan edit
            undangan sendiri.
          </p>

          <div className={styles.formGrid}>
            <input
              placeholder="Nama Client / Nama Pasangan"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={styles.input}
            />

            <input
              type="email"
              placeholder="Email Client (untuk login dashboard)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              <optgroup label="Pernikahan">
                {themeList.map((theme) => (
                  <option key={theme.key} value={theme.label}>{theme.label}</option>
                ))}
              </optgroup>
              <optgroup label="Aqiqah">
                {aqiqahThemeList.map((theme) => (
                  <option key={theme.key} value={theme.label}>{theme.label}</option>
                ))}
              </optgroup>
              <optgroup label="Khitan">
                {khitanThemeList.map((theme) => (
                  <option key={theme.key} value={theme.label}>{theme.label}</option>
                ))}
              </optgroup>
              <optgroup label="Ulang Tahun">
                {birthdayThemeList.map((theme) => (
                  <option key={theme.key} value={theme.label}>{theme.label}</option>
                ))}
              </optgroup>
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

          <button onClick={addClient} className={styles.button} disabled={addingClient}>
            {addingClient ? "Menyimpan..." : "Simpan Client"}
          </button>

          {newClientCredentials && (
            <div className={styles.linkBox} style={{ marginTop: 16 }}>
              <p style={{ margin: "0 0 8px", fontWeight: 600 }}>
                Akun login {newClientCredentials.name} berhasil dibuat:
              </p>
              <p style={{ margin: 0 }}>Email: {newClientCredentials.email}</p>
              <p style={{ margin: "0 0 12px" }}>Password: {newClientCredentials.password}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={copyClientCredentials} className={styles.exportButton}>
                  Copy Pesan untuk Dikirim ke Client
                </button>
                {newClientCredentials.whatsapp && (
                  <a href={clientWaLink()} target="_blank" className={styles.button}>
                    Kirim ke WA Otomatis
                  </a>
                )}
              </div>
            </div>
          )}
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
