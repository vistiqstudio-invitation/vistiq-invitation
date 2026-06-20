import Link from "next/link";
import styles from "./home.module.css";

const WA_NUMBER = "6281371338032";

const features = [
  ["⚡", "Siap Jual", "Website undangan digital siap dipasarkan."],
  ["🎨", "Tema Premium", "Gold, islami, floral, minimalist, dan luxury."],
  ["👤", "Nama Tamu", "Link undangan dengan nama tamu otomatis."],
  ["💌", "RSVP Online", "Konfirmasi hadir dan ucapan masuk dashboard."],
  ["🎵", "Musik", "Backsound undangan setelah tombol dibuka."],
  ["🎁", "Amplop Digital", "Rekening bank dan tombol salin nomor."],
];

const themes = [
  "Luxury Gold",
  "Islamic Green",
  "Soft Beige",
  "Floral Pink",
  "Royal Black",
  "Faceless",
];

export default function Home() {
  const waText = encodeURIComponent(
    "Halo Vistiq Studio, saya tertarik untuk menjadi reseller undangan digital."
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <img src="/logo-vistiq.png" alt="Vistiq Studio" />
          <div>
            <strong>Vistiq</strong>
            <span>Invitation</span>
          </div>
        </Link>

        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
          target="_blank"
          className={styles.headerCta}
        >
          Reseller
        </a>
      </header>

      <section className={styles.hero}>
        <div className={styles.badge}>Platform Undangan Digital Modern</div>

        <h1>
          Buat Bisnis
          <br />
          Undangan Digital
          <br />
          Siap Jual
        </h1>

        <p>
          Vistiq Invitation membantu owner, reseller, dan freelancer membuat
          layanan undangan digital premium dengan brand sendiri.
        </p>

        <div className={styles.heroButtons}>
          <Link href="/andi-siti?to=Bapak%20Ahmad" className={styles.primaryBtn}>
            Lihat Demo
          </Link>

          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
            target="_blank"
            className={styles.secondaryBtn}
          >
            Order Sekarang
          </a>
        </div>

        <div className={styles.phoneMockup}>
          <div className={styles.phoneCard}>
            <span>The Wedding Of</span>
            <h3>Andi & Siti</h3>
            <p>20 Desember 2026</p>
            <button>Buka Undangan</button>
          </div>
        </div>
      </section>

      <section id="fitur" className={styles.section}>
        <span className={styles.label}>FITUR UTAMA</span>
        <h2>Lengkap Untuk Mulai Jualan</h2>

        <div className={styles.featureList}>
          {features.map(([icon, title, desc]) => (
            <div className={styles.featureCard} key={title}>
              <div className={styles.icon}>{icon}</div>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="tema" className={styles.darkSection}>
        <span className={styles.labelDark}>PILIHAN TEMA</span>
        <h2>Tema Premium Siap Pakai</h2>

        <div className={styles.themeList}>
          {themes.map((theme, index) => (
            <div className={styles.themeCard} key={theme}>
              <div className={styles.themePreview}>
                <span>{index + 1}</span>
              </div>

              <h3>{theme}</h3>
              <p>Template undangan digital premium siap digunakan.</p>

              <div className={styles.price}>Rp99.000</div>

              <Link href="/andi-siti" className={styles.demoBtn}>
                Lihat Demo
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="reseller" className={styles.reseller}>
        <span className={styles.label}>PROGRAM RESELLER</span>
        <h2>Jual Dengan Brand Kamu Sendiri</h2>

        <p>
          Cocok untuk agency, freelancer, percetakan, wedding organizer, dan
          siapa pun yang ingin membuka jasa undangan digital tanpa coding.
        </p>

        <div className={styles.packageBox}>
          <small>Mulai dari</small>
          <strong>Rp250.000</strong>
          <span>Paket reseller white label</span>

          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
            target="_blank"
          >
            Gabung Reseller
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <img src="/logo-vistiq.png" alt="Vistiq Studio" />
        <p>© 2026 Vistiq Studio Invitation</p>
      </footer>
    </main>
  );
}