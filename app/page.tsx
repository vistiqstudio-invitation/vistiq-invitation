import Link from "next/link";
import styles from "./home.module.css";

const WA_NUMBER = "6281371338032";

const features = [
  {
    icon: "⚡",
    title: "Website Siap Jual",
    desc: "Sistem undangan digital siap digunakan untuk jualan.",
  },
  {
    icon: "🎨",
    title: "Template Premium",
    desc: "Tema modern, islami, floral, dan luxury.",
  },
  {
    icon: "👤",
    title: "Custom Nama Tamu",
    desc: "Link undangan bisa memakai nama tamu otomatis.",
  },
  {
    icon: "💌",
    title: "RSVP & Ucapan",
    desc: "Tamu bisa konfirmasi hadir dan mengirim doa.",
  },
  {
    icon: "🎵",
    title: "Musik Undangan",
    desc: "Backsound membuat undangan terasa lebih hidup.",
  },
  {
    icon: "🎁",
    title: "Amplop Digital",
    desc: "Support rekening bank dan love gift cashless.",
  },
  {
    icon: "📍",
    title: "Google Maps",
    desc: "Lokasi acara langsung terhubung ke Google Maps.",
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    desc: "Tampilan optimal di HP, tablet, dan desktop.",
  },
];

const themes = [
  {
    name: "Gold Premium",
    type: "Luxury Wedding",
    demo: "/andi-siti?to=Bapak%20Ahmad",
  },
  {
    name: "Islamic Minimalist",
    type: "Muslim Wedding",
    demo: "/andi-siti",
  },
  {
    name: "Modern Floral",
    type: "Elegant Wedding",
    demo: "/andi-siti",
  },
  {
    name: "Classic Beige",
    type: "Soft Wedding",
    demo: "/andi-siti",
  },
  {
    name: "Faceless Wedding",
    type: "No Photo Theme",
    demo: "/andi-siti",
  },
  {
    name: "Blue Premium",
    type: "Modern Digital",
    demo: "/andi-siti",
  },
];

export default function Home() {
  const waText = encodeURIComponent(
    "Halo Vistiq Studio, saya tertarik untuk menjadi reseller undangan digital."
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <img src="/logo-vistiq.png" alt="Vistiq Studio" />
            <div>
              <strong>Vistiq Invitation</strong>
              <span>Digital Wedding Business</span>
            </div>
          </Link>

          <nav className={styles.nav}>
            <a href="#fitur">Fitur</a>
            <a href="#tema">Tema</a>
            <a href="#reseller">Reseller</a>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
              target="_blank"
              className={styles.navCta}
            >
              Daftar Reseller
            </a>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.blurOne} />
        <div className={styles.blurTwo} />

        <div className={styles.heroText}>
          <div className={styles.badge}>🚀 Peluang Bisnis Digital Wedding</div>

          <h1>
            Bangun Bisnis Undangan Digital
            <br />
            Dengan Brand Kamu Sendiri
          </h1>

          <p>
            Vistiq Invitation membantu reseller, freelancer, agency, dan
            percetakan memiliki layanan undangan digital profesional tanpa harus
            membangun sistem dari nol.
          </p>

          <div className={styles.heroActions}>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
              target="_blank"
              className={styles.primaryButton}
            >
              Konsultasi via WhatsApp
            </a>

            <Link
              href="/andi-siti?to=Bapak%20Ahmad"
              className={styles.secondaryButton}
            >
              Lihat Demo Undangan
            </Link>
          </div>

          <div className={styles.stats}>
            <div>
              <strong>100%</strong>
              <span>Online</span>
            </div>
            <div>
              <strong>Premium</strong>
              <span>Template</span>
            </div>
            <div>
              <strong>No Coding</strong>
              <span>Siap Jual</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.phoneLeft}>RSVP</div>

          <div className={styles.phoneMain}>
            <span>The Wedding Of</span>
            <h3>Andi & Siti</h3>
            <p>20 Desember 2026</p>
            <button>Buka Undangan</button>
          </div>

          <div className={styles.phoneRight}>Gift</div>
        </div>
      </section>

      <section id="fitur" className={styles.section}>
        <div className={styles.sectionHead}>
          <span>FITUR PREMIUM</span>
          <h2>Semua yang Dibutuhkan Untuk Jualan</h2>
          <p>
            Sistem dibuat agar mudah dipasarkan ke calon pengantin, reseller,
            dan klien bisnis wedding.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <div className={styles.featureCard} key={feature.title}>
              <div>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tema" className={styles.themeSection}>
        <div className={styles.sectionHead}>
          <span>PILIHAN TEMA</span>
          <h2>Template Undangan Siap Jual</h2>
          <p>
            Cocok untuk berbagai style: islami, premium gold, floral, minimalis,
            dan modern.
          </p>
        </div>

        <div className={styles.themeGrid}>
          {themes.map((theme, index) => (
            <div className={styles.themeCard} key={theme.name}>
              <div className={styles.themePreview}>
                <div className={styles.themePhone}>
                  <span>The Wedding Of</span>
                  <strong>{theme.name}</strong>
                  <small>{theme.type}</small>
                </div>
              </div>

              <div className={styles.themeInfo}>
                <p>Wedding Template — 0{index + 1}</p>
                <h3>{theme.name}</h3>

                <div className={styles.priceRow}>
                  <strong>Rp99.000</strong>
                  <span>Rp149.000</span>
                </div>

                <div className={styles.themeButtons}>
                  <Link href={theme.demo} className={styles.demoButton}>
                    Lihat Demo
                  </Link>

                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                      `Halo Vistiq Studio, saya ingin order tema ${theme.name}`
                    )}`}
                    target="_blank"
                    className={styles.orderButton}
                  >
                    Order
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="reseller" className={styles.reseller}>
        <div className={styles.resellerCard}>
          <div>
            <span>PROGRAM RESELLER</span>
            <h2>Jual Undangan Digital Dengan Brand Kamu Sendiri</h2>
            <p>
              Kamu fokus cari klien dan closing. Sistem, template, dan teknis
              website kami bantu siapkan agar kamu bisa mulai jualan lebih cepat.
            </p>
          </div>

          <div className={styles.packageBox}>
            <p>Mulai dari</p>
            <h3>Rp99.000</h3>
            <span>per undangan</span>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
              target="_blank"
            >
              Gabung Reseller
            </a>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <h2>Siap Bangun Bisnis Undangan Digital?</h2>
        <p>
          Mulai dari satu template, lalu kembangkan menjadi bisnis digital
          dengan banyak klien.
        </p>

        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
          target="_blank"
          className={styles.primaryButton}
        >
          Mulai Konsultasi Sekarang
        </a>
      </section>

      <footer className={styles.footer}>
        <img src="/logo-vistiq.png" alt="Vistiq Studio" />
        <p>© 2026 Vistiq Studio Invitation. All rights reserved.</p>
      </footer>
    </main>
  );
}