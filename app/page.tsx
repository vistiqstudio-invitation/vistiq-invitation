import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeBrowser from "@/components/ThemeBrowser";
import CheckoutButton from "@/components/CheckoutButton";
import styles from "./home.module.css";

const FEATURES = [
  ["Nama Tamu Personal", "Setiap tautan dapat menampilkan nama tamu secara otomatis.", "01"],
  ["Bagikan Tanpa Batas", "Kirim melalui WhatsApp, email, dan media sosial tanpa batas tamu.", "02"],
  ["RSVP & Ucapan", "Pantau konfirmasi kehadiran dan pesan tamu dari dashboard.", "03"],
  ["Countdown Acara", "Hitung mundur otomatis membantu tamu mengingat hari acara.", "04"],
  ["Musik Latar", "Pilih musik yang sesuai dengan suasana dan cerita acara Anda.", "05"],
  ["Amplop Digital", "Tampilkan rekening dan tombol salin untuk memudahkan tamu.", "06"],
  ["Love Story", "Susun perjalanan cerita pasangan dalam timeline yang elegan.", "07"],
  ["Galeri Foto & Video", "Bagikan momen terbaik melalui galeri yang responsif.", "08"],
  ["Navigasi Lokasi", "Arahkan tamu ke lokasi acara melalui tautan peta.", "09"],
  ["Dashboard Mandiri", "Edit data, buat tautan tamu, dan pantau respons di satu tempat.", "10"],
];

const FAQ = [
  ["Apakah saya bisa membuat dan mengedit undangan sendiri?", "Bisa. Setelah akun aktif, Anda dapat memilih tema, mengisi data, mengunggah foto, dan memperbarui undangan melalui dashboard."],
  ["Bagaimana proses pembuatan undangan?", "Pilih paket, selesaikan pembayaran, lalu isi seluruh data acara dari dashboard. Undangan dapat dipreview sebelum dibagikan."],
  ["Apakah link undangan bisa diberi nama tamu?", "Bisa. Dashboard menyediakan pembuat tautan personal untuk satu atau banyak nama tamu sekaligus."],
  ["Apakah undangan bisa direvisi?", "Bisa. Data acara, foto, musik, galeri, dan informasi lain dapat diperbarui melalui akun client selama undangan aktif."],
  ["Bagaimana cara memantau RSVP?", "Konfirmasi hadir dan ucapan tamu masuk ke dashboard secara otomatis dan dapat dipantau kapan saja."],
  ["Apakah tersedia paket untuk menjual kembali?", "Tersedia paket Reseller dan Reseller Brand, termasuk pilihan white-label dengan identitas brand sendiri."],
];

const HERO_FAN = [
  { key: "royal-imperial", rotate: -13, x: -78, y: 26, scale: .84, z: 1 },
  { key: "luxury-gold", rotate: 0, x: 0, y: -8, scale: 1, z: 3 },
  { key: "sakura", rotate: 13, x: 78, y: 26, scale: .84, z: 1 },
];

export default function HomePage() {
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  return <main className={styles.page}>
    <SiteNavbar />
    <section className={styles.hero}>
      <div className={styles.heroGlow}/><div className={styles.heroCopy}>
        <div className={styles.trust}><span>✦ Mudah dibuat</span> Platform undangan untuk acara istimewa</div>
        <h1>Undangan digital yang <em>indah, personal,</em> dan mudah dikelola.</h1>
        <p>Wujudkan undangan website premium untuk pernikahan, khitan, akikah, ulang tahun, dan acara lainnya—lengkap dengan dashboard mandiri.</p>
        <div className={styles.actions}><Link href="/demo" className={styles.primary}>Lihat Pilihan Tema <span>↗</span></Link><Link href="/pilih-paket" className={styles.secondary}>Lihat Paket</Link></div>
        <div className={styles.miniStats}><div><strong>Banyak Tema</strong><span>Desain premium siap pakai</span></div><div><strong>Satu Dashboard</strong><span>Semua mudah dikelola</span></div></div>
      </div>
      <div className={styles.heroVisual} aria-label="Preview tema undangan Vistiq"><div className={styles.orbit}/>{HERO_FAN.map(item=><PhoneMockup key={item.key} themeKey={item.key} width={154} className={styles.phone} style={{transform:`translate(calc(-50% + ${item.x}px), calc(-50% + ${item.y}px)) rotate(${item.rotate}deg) scale(${item.scale})`,zIndex:item.z}}/>)}<div className={styles.floatingCard}><span>✓</span><div><strong>Responsif</strong><small>Nyaman di semua perangkat</small></div></div></div>
    </section>
    <section className={styles.statement}><p className={styles.eyebrow}>KENAPA VISTIQ INVITATION</p><h2>Keindahan desain bertemu dengan kemudahan teknologi.</h2><p>Vistiq membantu Anda membuat pengalaman mengundang yang berkesan, dari saat tautan diterima hingga tamu mengirimkan konfirmasi kehadiran dan doa terbaik.</p></section>
    <section id="fitur" className={styles.features}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>FITUR PILIHAN</p><h2>Semua kebutuhan acara dalam satu undangan.</h2></div><p>Dirancang agar mudah digunakan oleh pemilik acara, reseller, maupun client tanpa keahlian teknis.</p></div><div className={styles.featureGrid}>{FEATURES.map(([title,description,number])=><article className={styles.featureCard} key={title}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div><div className={styles.comingSoon}><div><span>SEGERA HADIR</span><h3>Digital Guestbook & QR Check-In</h3><p>Registrasi tamu, data kehadiran terorganisir, dan layar sapa realtime sedang kami siapkan.</p></div><div className={styles.qrArt}><i/><i/><i/><i/></div></div></section>
    <section id="tema" className={styles.themes}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>KOLEKSI DESAIN</p><h2>Tema yang mengikuti cerita Anda.</h2></div><Link href="/demo">Lihat semua tema <span>→</span></Link></div><ThemeBrowser priceWasLabel="Rp 149.000" discountLabel="34%"/></section>
    <section id="harga" className={styles.pricing}><div className={styles.centerHeading}><p className={styles.eyebrow}>PAKET VISTIQ</p><h2>Pilih cara terbaik untuk memulai.</h2><p>Untuk satu acara, penghasilan tambahan, atau membangun platform dengan brand sendiri.</p></div><div className={styles.priceGrid}>
      <article className={styles.priceCard}><p>CLIENT</p><h3>Rp99.000</h3><span>Satu undangan premium</span><ul><li>Dashboard client mandiri</li><li>Semua fitur undangan aktif</li><li>Nama tamu tanpa batas</li></ul><CheckoutButton packageId="client" label="Buat Undangan" production={production}/></article>
      <article className={`${styles.priceCard} ${styles.featured}`}><b>PALING POPULER</b><p>RESELLER</p><h3>Rp59.000</h3><span>Sekali bayar, aktif selamanya</span><ul><li>Jual undangan tanpa batas</li><li>Dashboard reseller lengkap</li><li>80% hasil penjualan untuk Anda</li></ul><CheckoutButton packageId="reseller" label="Gabung Reseller" featured production={production}/></article>
      <article className={styles.priceCard}><p>RESELLER BRAND</p><h3>Rp59.000<small>/bulan</small></h3><span>White-label untuk brand Anda</span><ul><li>Nama, logo, dan warna sendiri</li><li>Keuntungan 100% milik Anda</li><li>Subdomain dan custom domain</li></ul><CheckoutButton packageId="reseller-brand" label="Bangun Brand Sendiri" production={production}/></article>
      <article className={styles.priceCard}><p>AFFILIATE</p><h3>Gratis</h3><span>Promosikan melalui link</span><ul><li>Komisi 30% semua paket</li><li>Pencairan mulai Rp100.000</li><li>Dashboard komisi transparan</li></ul><Link className={styles.planLink} href="/gabung-affiliate">Gabung Affiliate</Link></article>
    </div></section>
    <section className={styles.faq}><div className={styles.centerHeading}><p className={styles.eyebrow}>PERTANYAAN UMUM</p><h2>Yang sering ditanyakan.</h2></div><div className={styles.faqGrid}>{FAQ.map(([q,a],i)=><details key={q} open={i===0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <section className={styles.finalCta}><p>Mulai cerita istimewa Anda bersama Vistiq.</p><h2>Undangan yang berkesan, dibuat lebih mudah.</h2><div className={styles.actions}><Link href="/demo" className={styles.primary}>Pilih Tema</Link><Link href="/gabung-reseller" className={styles.secondary}>Jadi Reseller</Link></div></section>
    <footer className={styles.footer}><div><Link href="/" className={styles.footerBrand}><small>VISTIQ</small>Invitation</Link><p>Platform undangan digital premium untuk acara dan bisnis Anda.</p></div><div><strong>Produk</strong><Link href="/demo">Tema</Link><Link href="/pilih-paket">Paket</Link><Link href="/gabung-reseller">Reseller</Link></div><div><strong>Akun</strong><Link href="/login">Login Dashboard</Link><Link href="/gabung-affiliate">Affiliate</Link></div><p className={styles.copyright}>© 2026 Vistiq Invitation. Seluruh hak dilindungi.</p></footer>
  </main>;
}
