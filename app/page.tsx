import Link from "next/link";

export default function HomePage() {
  return (
    <main style={styles.page}>
      <nav style={styles.navbar}>
        <div>
          <p style={styles.logoSmall}>VISTIQ</p>
          <h1 style={styles.logo}>Invitation</h1>
        </div>

        <div style={styles.navMenu}>
          <a href="#fitur">Fitur</a>
          <a href="#tema">Tema</a>
          <a href="#harga">Harga</a>
          <a href="#reseller">Reseller</a>
          <Link href="/admin-login">Login</Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroText}>
          <p style={styles.badge}>Platform Undangan Digital Modern</p>

          <h2 style={styles.heroTitle}>
            Buat Undangan Digital Premium dengan Sistem Siap Jual
          </h2>

          <p style={styles.heroDesc}>
            Vistiq Invitation membantu owner, reseller, dan client membuat
            undangan digital elegan, lengkap dengan RSVP, galeri foto, musik,
            amplop digital, dan dashboard online.
          </p>

          <div style={styles.heroActions}>
            <Link href="/demo" style={styles.primaryButton}>
              Lihat Demo
            </Link>

            <a
              href="https://wa.me/6281234567890?text=Halo%20Vistiq%20Invitation,%20saya%20ingin%20order%20undangan%20digital"
              style={styles.secondaryButton}
              target="_blank"
            >
              Order Sekarang
            </a>
          </div>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.mockup}>
            <div style={styles.mockupTop}>The Wedding Of</div>
            <h3>Rizky & Nabila</h3>
            <p>20 September 2026</p>
            <div style={styles.mockupImage} />
            <button style={styles.mockupButton}>Buka Undangan</button>
          </div>
        </div>
      </section>

      <section id="fitur" style={styles.section}>
        <p style={styles.sectionLabel}>Fitur Utama</p>
        <h2 style={styles.sectionTitle}>Semua Kebutuhan Undangan Digital</h2>

        <div style={styles.grid}>
          {[
            ["Dashboard Owner", "Pantau client, reseller, undangan, RSVP, dan transaksi."],
            ["Panel Reseller", "Reseller bisa login, tambah client, dan pantau penjualan."],
            ["Panel Client", "Client bisa edit data undangan dan upload foto sendiri."],
            ["RSVP Online", "Data kehadiran dan ucapan masuk otomatis ke dashboard."],
            ["Upload Galeri", "Upload foto cover, mempelai, dan galeri 5–10 foto."],
            ["Amplop Digital", "Tampilkan rekening dan tombol salin nomor rekening."],
          ].map((item) => (
            <div key={item[0]} style={styles.featureCard}>
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tema" style={styles.sectionDark}>
        <p style={styles.sectionLabel}>Pilihan Tema</p>
        <h2 style={styles.sectionTitleLight}>Tema Premium Siap Pakai</h2>

        <div style={styles.themeGrid}>
          {[
            ["Luxury Gold", "Elegan, hitam emas, premium wedding."],
            ["Royal Black", "Mewah, dark, cinematic, eksklusif."],
            ["Luxury White", "Clean, modern, soft, dan elegan."],
            ["Floral Garden", "Romantis, floral, fresh, dan manis."],
          ].map((item) => (
            <div key={item[0]} style={styles.themeCard}>
              <div style={styles.themePreview} />
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="harga" style={styles.section}>
        <p style={styles.sectionLabel}>Paket Harga</p>
        <h2 style={styles.sectionTitle}>Pilih Paket Sesuai Kebutuhan</h2>

        <div style={styles.priceGrid}>
          <div style={styles.priceCard}>
            <h3>Basic</h3>
            <strong>Rp 99.000</strong>
            <p>Untuk undangan sederhana dengan fitur utama.</p>
            <ul>
              <li>1 Tema</li>
              <li>RSVP Online</li>
              <li>Galeri Foto</li>
              <li>Amplop Digital</li>
            </ul>
          </div>

          <div style={styles.priceCardFeatured}>
            <p style={styles.popular}>Paling Populer</p>
            <h3>Premium</h3>
            <strong>Rp 199.000</strong>
            <p>Untuk undangan profesional dengan fitur lengkap.</p>
            <ul>
              <li>Semua fitur Basic</li>
              <li>Dashboard Client</li>
              <li>Upload Foto Mandiri</li>
              <li>Generate Link Tamu</li>
            </ul>
          </div>

          <div style={styles.priceCard}>
            <h3>Reseller</h3>
            <strong>Hubungi Kami</strong>
            <p>Untuk Anda yang ingin menjual ulang undangan digital.</p>
            <ul>
              <li>Panel Reseller</li>
              <li>Komisi Penjualan</li>
              <li>Tambah Client Sendiri</li>
              <li>Support Sistem</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="reseller" style={styles.resellerSection}>
        <div>
          <p style={styles.sectionLabel}>Program Reseller</p>
          <h2 style={styles.sectionTitleLight}>
            Ingin Jualan Undangan Digital Tanpa Bikin Sistem Sendiri?
          </h2>
          <p style={styles.resellerText}>
            Bergabung sebagai reseller Vistiq Invitation dan mulai jualan
            undangan digital dengan dashboard sendiri, komisi, dan sistem yang
            sudah siap digunakan.
          </p>
        </div>

        <a
          href="https://wa.me/6281234567890?text=Halo%20Vistiq%20Invitation,%20saya%20ingin%20daftar%20reseller"
          target="_blank"
          style={styles.whiteButton}
        >
          Daftar Reseller
        </a>
      </section>

      <section style={styles.cta}>
        <h2>Siap Membuat Undangan Digital Premium?</h2>
        <p>
          Mulai dari undangan personal hingga sistem reseller, semuanya bisa
          dikelola dalam satu platform.
        </p>

        <div style={styles.heroActions}>
          <Link href="/demo" style={styles.primaryButton}>
            Lihat Demo
          </Link>

          <Link href="/admin-login" style={styles.secondaryButton}>
            Login Dashboard
          </Link>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2026 Vistiq Invitation. All rights reserved.</p>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    color: "#0f172a",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  navbar: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoSmall: {
    color: "#1167b2",
    fontWeight: 900,
    letterSpacing: "3px",
    fontSize: "12px",
    margin: 0,
  },

  logo: {
    margin: 0,
    fontSize: "24px",
  },

  navMenu: {
    display: "flex",
    gap: "22px",
    alignItems: "center",
    fontWeight: 700,
  },

  hero: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "70px 24px 90px",
    display: "grid",
    gridTemplateColumns: "1.1fr .9fr",
    gap: "40px",
    alignItems: "center",
  },

  badge: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#1167b2",
    padding: "9px 14px",
    borderRadius: "999px",
    fontWeight: 800,
    fontSize: "13px",
  },

  heroTitle: {
    fontSize: "58px",
    lineHeight: 1.05,
    margin: "18px 0",
  },

  heroDesc: {
    color: "#475569",
    fontSize: "18px",
    lineHeight: 1.8,
    maxWidth: "620px",
  },

  heroActions: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "28px",
  },

  primaryButton: {
    background: "#1167b2",
    color: "white",
    padding: "14px 24px",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: 800,
  },

  secondaryButton: {
    background: "white",
    color: "#1167b2",
    padding: "14px 24px",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: 800,
    border: "1px solid #dbeafe",
  },

  heroCard: {
    display: "grid",
    placeItems: "center",
  },

  mockup: {
    width: "310px",
    minHeight: "560px",
    borderRadius: "38px",
    background:
      "linear-gradient(180deg, #050505, #171717)",
    color: "white",
    padding: "28px",
    boxShadow: "0 30px 80px rgba(15,23,42,.25)",
    textAlign: "center",
    border: "1px solid rgba(212,175,55,.35)",
  },

  mockupTop: {
    color: "#d4af37",
    letterSpacing: "3px",
    fontSize: "12px",
    marginTop: "20px",
  },

  mockupImage: {
    height: "240px",
    borderRadius: "26px",
    background:
      "linear-gradient(135deg, rgba(212,175,55,.2), rgba(255,255,255,.06))",
    margin: "30px 0",
    border: "1px solid rgba(212,175,55,.25)",
  },

  mockupButton: {
    border: "none",
    background: "linear-gradient(135deg, #a77a16, #f7df84, #c99a24)",
    color: "#111",
    padding: "13px 22px",
    borderRadius: "999px",
    fontWeight: 900,
  },

  section: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "80px 24px",
  },

  sectionDark: {
    background: "#0f172a",
    color: "white",
    padding: "80px 24px",
  },

  sectionLabel: {
    color: "#1167b2",
    fontWeight: 900,
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontSize: "13px",
  },

  sectionTitle: {
    fontSize: "42px",
    margin: "10px 0 34px",
  },

  sectionTitleLight: {
    fontSize: "42px",
    margin: "10px auto 34px",
    maxWidth: "1180px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "18px",
  },

  featureCard: {
    background: "white",
    padding: "24px",
    borderRadius: "22px",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },

  themeGrid: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "18px",
  },

  themeCard: {
    background: "rgba(255,255,255,.08)",
    padding: "18px",
    borderRadius: "22px",
    border: "1px solid rgba(255,255,255,.12)",
  },

  themePreview: {
    height: "170px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #050505, #d4af37)",
    marginBottom: "16px",
  },

  priceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "18px",
  },

  priceCard: {
    background: "white",
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },

  priceCardFeatured: {
    background: "#1167b2",
    color: "white",
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(17,103,178,.25)",
    transform: "translateY(-12px)",
  },

  popular: {
    background: "rgba(255,255,255,.18)",
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
  },

  resellerSection: {
    background: "#1167b2",
    color: "white",
    padding: "70px 24px",
    display: "flex",
    justifyContent: "space-between",
    gap: "30px",
    alignItems: "center",
  },

  resellerText: {
    maxWidth: "760px",
    fontSize: "18px",
    lineHeight: 1.8,
  },

  whiteButton: {
    background: "white",
    color: "#1167b2",
    padding: "15px 24px",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: 900,
    whiteSpace: "nowrap",
  },

  cta: {
    textAlign: "center",
    padding: "90px 24px",
  },

  footer: {
    textAlign: "center",
    padding: "28px",
    color: "#64748b",
  },
};