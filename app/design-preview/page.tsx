import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./design-preview.module.css";

const themes = [
  { name: "Jawa Klasik", type: "Wedding", image: "/photos/jawa-cover.png", color: "#7b342c" },
  { name: "White Romance", type: "Wedding", image: "/photos/white-cover.png", color: "#b58a62" },
  { name: "Aqiqah Damai", type: "Aqiqah", image: "/photos/akikah-damai-cover.jpg", color: "#6c8a70" },
  { name: "Khitan Ceria", type: "Khitan", image: "/photos/khitan-warna-child.jpg", color: "#317bb2" },
];

const features = [
  ["✦", "Tema premium", "Koleksi desain modern untuk wedding, khitan, aqiqah, ulang tahun, dan wisuda."],
  ["◉", "Editor yang praktis", "Ubah nama, acara, galeri, musik, dan cerita langsung dari satu dashboard."],
  ["↗", "Bagikan seketika", "Undangan siap dibagikan melalui tautan personal dan tampil optimal di semua perangkat."],
  ["◎", "RSVP & buku tamu", "Pantau konfirmasi kehadiran dan ucapan dari tamu secara real-time."],
  ["⌁", "Pembayaran mudah", "Pilih paket, bayar, dan aktifkan undangan dalam alur yang sederhana."],
  ["◇", "Bisnis reseller", "Kelola pelanggan, transaksi, saldo, dan identitas brand dari satu tempat."],
];

export default function DesignPreviewPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/design-preview" className={styles.brand}>
          <span className={styles.brandMark}>V</span>
          <span>VISTIQ<span>Invitation</span></span>
        </Link>
        <div className={styles.navLinks}>
          <a href="#solution">Solusi</a><a href="#themes">Tema</a><a href="#features">Fitur</a><a href="#pricing">Harga</a>
        </div>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.login}>Masuk</Link>
          <Link href="/pilih-paket" className={styles.primarySmall}>Mulai Sekarang <span>↗</span></Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.glowOne} /><div className={styles.glowTwo} />
        <div className={styles.heroCopy}>
          <div className={styles.badge}><span>✦</span> Platform Undangan Digital Indonesia</div>
          <h1>Satu platform untuk<br /><em>momen</em> dan bisnis Anda.</h1>
          <p>Buat undangan digital yang berkesan atau mulai bisnis reseller dengan sistem yang praktis, profesional, dan siap digunakan.</p>
          <div className={styles.heroActions}>
            <Link href="/demo" className={styles.primary}>Lihat Koleksi Tema <span>↗</span></Link>
            <Link href="/gabung-reseller" className={styles.secondary}><i>▶</i> Mulai Jadi Reseller</Link>
          </div>
          <div className={styles.trustRow}>
            <div><strong>50+</strong><span>Tema premium</span></div>
            <div><strong>1.200+</strong><span>Undangan dibuat</span></div>
            <div><strong>4.9/5</strong><span>Rating pengguna</span></div>
          </div>
        </div>

        <div className={styles.productStage} aria-label="Preview dashboard Vistiq">
          <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
              <div className={styles.sideLogo}>V</div>
              <div className={`${styles.sideItem} ${styles.active}`}>⌂ <span>Ringkasan</span></div>
              <div className={styles.sideItem}>◇ <span>Undangan</span></div>
              <div className={styles.sideItem}>♙ <span>Pelanggan</span></div>
              <div className={styles.sideItem}>▱ <span>Transaksi</span></div>
              <div className={styles.sideItem}>⚙ <span>Pengaturan</span></div>
              <div className={styles.sideProfile}><b>VS</b><span>Vistiq Studio<small>Reseller Pro</small></span></div>
            </aside>
            <div className={styles.dashMain}>
              <header><div><span>Dashboard</span><strong>Selamat datang, Vistiq 👋</strong></div><button>+ Buat Undangan</button></header>
              <div className={styles.metricGrid}>
                <article><i className={styles.blue}>◇</i><span>Total Undangan<strong>128</strong><small>↑ 12% bulan ini</small></span></article>
                <article><i className={styles.purple}>♙</i><span>Pelanggan Aktif<strong>94</strong><small>↑ 8% bulan ini</small></span></article>
                <article><i className={styles.green}>Rp</i><span>Pendapatan<strong>8,4jt</strong><small>↑ 18% bulan ini</small></span></article>
              </div>
              <div className={styles.chartCard}>
                <div><strong>Performa undangan</strong><span>30 hari terakhir⌄</span></div>
                <svg viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true">
                  <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5d62f4" stopOpacity=".28"/><stop offset="1" stopColor="#5d62f4" stopOpacity="0"/></linearGradient></defs>
                  <path className={styles.gridLine} d="M0 30H600M0 75H600M0 120H600" />
                  <path className={styles.area} d="M0 130 C45 120 65 105 105 111 S160 86 205 92 S260 55 305 70 S365 52 405 58 S470 27 510 43 S565 18 600 24 L600 160 L0 160Z" />
                  <path className={styles.line} d="M0 130 C45 120 65 105 105 111 S160 86 205 92 S260 55 305 70 S365 52 405 58 S470 27 510 43 S565 18 600 24" />
                </svg>
              </div>
              <div className={styles.recent}><strong>Undangan terbaru</strong><span>Lihat semua →</span></div>
            </div>
          </div>
          <div className={styles.phoneFloat}>
            <div className={styles.phoneSpeaker} />
            <img src="/photos/jawa-cover.png" alt="Preview tema undangan Jawa" />
            <div className={styles.phoneShade} />
            <div className={styles.phoneText}><small>THE WEDDING OF</small><strong>Rizky &amp; Nabila</strong><span>28 • 09 • 2026</span><button>Buka Undangan</button></div>
          </div>
          <div className={styles.livePill}><span>●</span> Aktif &amp; siap dibagikan</div>
        </div>
      </section>

      <section className={styles.logoStrip}><span>Dipercaya kreator acara &amp; reseller di seluruh Indonesia</span><div><b>AKADKU</b><b className={styles.serif}>the wedding.</b><b>EVORIA</b><b className={styles.script}>Momentia</b><b>CELESTIA</b></div></section>

      <section className={styles.section} id="solution">
        <div className={styles.sectionHead}><span className={styles.eyebrow}>SATU PLATFORM, DUA SOLUSI</span><h2>Dibuat untuk kebutuhan Anda,<br />dari momen hingga bisnis.</h2><p>Pilih cara menggunakan Vistiq yang paling sesuai. Semuanya tetap sederhana dan berada dalam satu ekosistem.</p></div>
        <div className={styles.pathGrid}>
          <article className={styles.pathClient}>
            <div className={styles.pathTag}>UNTUK ACARA ANDA</div><h3>Undangan yang indah,<br />tanpa proses yang rumit.</h3><p>Pilih tema, isi informasi acara, lalu bagikan. Cocok untuk setiap momen spesial.</p>
            <Link href="/demo">Jelajahi semua tema <span>→</span></Link>
            <div className={styles.miniPhones}><div><img src="/photos/white-cover.png" alt="Tema putih" /></div><div><img src="/photos/floral-cover.png" alt="Tema floral" /></div><div><img src="/photos/modern-cover.png" alt="Tema modern" /></div></div>
          </article>
          <article className={styles.pathBusiness}>
            <div className={styles.pathTag}>UNTUK BISNIS ANDA</div><h3>Bangun bisnis undangan<br />dengan brand sendiri.</h3><p>Dapatkan dashboard, koleksi tema, dan alat pengelolaan pelanggan tanpa membuat sistem dari nol.</p>
            <Link href="/gabung-reseller">Pelajari program reseller <span>→</span></Link>
            <div className={styles.businessMock}><div><span>Pendapatan bulan ini</span><strong>Rp 8.420.000</strong><small>↗ 18,4% dari bulan lalu</small></div><div className={styles.barChart}><i/><i/><i/><i/><i/><i/><i/></div></div>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.themesSection}`} id="themes">
        <div className={styles.splitHead}><div><span className={styles.eyebrow}>TEMA PILIHAN</span><h2>Tampilan premium untuk<br />setiap cerita.</h2></div><div><p>Koleksi yang dikurasi untuk berbagai acara, gaya, dan karakter.</p><Link href="/demo">Lihat semua tema →</Link></div></div>
        <div className={styles.themeGrid}>{themes.map((theme) => <article key={theme.name} className={styles.themeCard} style={{"--accent": theme.color} as CSSProperties}><div className={styles.themeImage}><img src={theme.image} alt={theme.name}/><span>Preview ↗</span></div><div><span>{theme.type}</span><strong>{theme.name}</strong></div></article>)}</div>
      </section>

      <section className={styles.section} id="features">
        <div className={styles.sectionHead}><span className={styles.eyebrow}>SEMUA YANG ANDA BUTUHKAN</span><h2>Lebih dari sekadar undangan.</h2><p>Fitur lengkap untuk menciptakan pengalaman tamu yang berkesan dan pengelolaan yang lebih ringan.</p></div>
        <div className={styles.featureGrid}>{features.map(([icon,title,text]) => <article key={title}><i>{icon}</i><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className={`${styles.section} ${styles.steps}`}>
        <div><span className={styles.eyebrow}>CARA KERJA</span><h2>Siap dibagikan<br />dalam tiga langkah.</h2><p>Tanpa instalasi dan tanpa kemampuan teknis. Mulai dari tema hingga tautan undangan dalam hitungan menit.</p><Link href="/pilih-paket" className={styles.primary}>Buat Undangan Sekarang <span>↗</span></Link></div>
        <ol><li><b>01</b><span><strong>Pilih tema favorit</strong><p>Temukan desain yang paling sesuai dengan acara dan karakter Anda.</p></span></li><li><b>02</b><span><strong>Lengkapi informasi</strong><p>Isi detail acara, foto, cerita, musik, hingga alamat lokasi.</p></span></li><li><b>03</b><span><strong>Bagikan ke tamu</strong><p>Aktifkan undangan dan bagikan tautan personal melalui WhatsApp.</p></span></li></ol>
      </section>

      <section className={`${styles.section} ${styles.pricing}`} id="pricing">
        <div className={styles.sectionHead}><span className={styles.eyebrow}>PAKET FLEKSIBEL</span><h2>Pilih sesuai kebutuhan.</h2><p>Harga transparan, satu kali bayar, tanpa biaya tersembunyi.</p></div>
        <div className={styles.priceGrid}>
          <article><span>REGULER</span><h3>Mulai sederhana</h3><div><sup>Rp</sup><strong>99rb</strong><small>/ undangan</small></div><p>Untuk acara personal dengan seluruh fitur esensial.</p><ul><li>✓ Tema reguler</li><li>✓ RSVP & buku tamu</li><li>✓ Galeri dan musik</li></ul><Link href="/pilih-paket">Pilih Reguler</Link></article>
          <article className={styles.featuredPrice}><div className={styles.popular}>PALING POPULER</div><span>PREMIUM</span><h3>Pengalaman terbaik</h3><div><sup>Rp</sup><strong>149rb</strong><small>/ undangan</small></div><p>Desain premium dan fitur lengkap untuk momen istimewa.</p><ul><li>✓ Semua fitur Reguler</li><li>✓ Tema premium & adat</li><li>✓ Love Story hingga 5</li></ul><Link href="/pilih-paket">Pilih Premium</Link></article>
          <article><span>RESELLER</span><h3>Bangun bisnis Anda</h3><div><sup>Rp</sup><strong>299rb</strong><small>/ mulai</small></div><p>Jual undangan digital menggunakan identitas bisnis sendiri.</p><ul><li>✓ Dashboard reseller</li><li>✓ Kelola pelanggan</li><li>✓ Dukungan prioritas</li></ul><Link href="/gabung-reseller">Lihat Paket Reseller</Link></article>
        </div>
      </section>

      <section className={styles.finalCta}><span>Mulai dari hari ini</span><h2>Momen berharga layak<br />dibagikan dengan indah.</h2><p>Buat undangan pertama Anda atau mulai perjalanan sebagai reseller Vistiq.</p><div><Link href="/demo" className={styles.whiteButton}>Lihat Tema <span>↗</span></Link><Link href="/gabung-reseller" className={styles.ghostButton}>Jadi Reseller</Link></div></section>

      <footer className={styles.footer}><Link href="/design-preview" className={styles.brand}><span className={styles.brandMark}>V</span><span>VISTIQ<span>Invitation</span></span></Link><p>Platform undangan digital untuk setiap momen dan bisnis.</p><span>© 2026 Vistiq Invitation</span></footer>
    </main>
  );
}
