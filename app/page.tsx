import Link from "next/link";
import Image from "next/image";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeBrowser from "@/components/ThemeBrowser";
import CheckoutButton from "@/components/CheckoutButton";
import styles from "./home.module.css";

const FEATURES = [
  ["Unlimited & Easy Share", "Bagikan undangan melalui WhatsApp dan media sosial tanpa batas tamu.", "↗"],
  ["Wishes & RSVP Tracking", "Pantau ucapan, doa, dan konfirmasi kehadiran langsung dari dashboard.", "♡"],
  ["E-Invitation & QR Code", "Undangan digital dilengkapi QR Code yang praktis untuk dibagikan.", "▦"],
  ["Countdown", "Hitung mundur otomatis membantu tamu mengingat hari istimewa Anda.", "◷"],
  ["Background Music", "Pilih musik yang sesuai dengan suasana dan cerita acara Anda.", "♫"],
  ["Amplop Digital", "Tampilkan rekening dan tombol salin untuk memudahkan tamu mengirim hadiah.", "▣"],
  ["Love Story", "Susun perjalanan cerita pasangan dalam timeline yang elegan.", "♥"],
  ["Gallery Foto & Video", "Bagikan momen terbaik melalui galeri foto dan video yang responsif.", "▧"],
  ["Navigasi Lokasi", "Arahkan tamu menuju lokasi acara melalui tautan peta digital.", "⌖"],
];

const FAQ = [
  ["Apakah saya bisa membuat dan mengedit undangan sendiri?", "Bisa. Setelah akun aktif, Anda dapat memilih tema, mengisi data, mengunggah foto, dan memperbarui undangan melalui dashboard."],
  ["Bagaimana proses pembuatan undangan?", "Pilih paket, selesaikan pembayaran, lalu isi seluruh data acara dari dashboard. Undangan dapat dipreview sebelum dibagikan."],
  ["Apakah link undangan bisa diberi nama tamu?", "Bisa. Dashboard menyediakan pembuat tautan personal untuk satu atau banyak nama tamu sekaligus."],
  ["Apakah undangan bisa direvisi?", "Bisa. Data acara, foto, musik, galeri, dan informasi lain dapat diperbarui melalui akun client selama undangan aktif."],
  ["Bagaimana cara memantau RSVP?", "Konfirmasi hadir dan ucapan tamu masuk ke dashboard secara otomatis dan dapat dipantau kapan saja."],
  ["Apakah tersedia paket untuk menjual kembali?", "Tersedia paket Reseller dan Reseller Brand, termasuk pilihan white-label dengan identitas brand sendiri."],
];

const HERO_COLUMNS = [
  [
    "/theme-previews/wedding/luxury-art-garden.jpg",
    "/theme-previews/wedding/royal-java.jpg",
    "/theme-previews/wedding/luxury-art-java-heritage.jpg",
  ],
  [
    "/theme-previews/wedding/luxury-art-sakura.jpg",
    "/theme-previews/wedding/pastel-studio.jpg",
    "/theme-previews/wedding/luxury-art-soft.jpg",
  ],
  [
    "/theme-previews/wedding/luxury-art-champagne-romance.jpg",
    "/theme-previews/wedding/royal-java.jpg",
    "/theme-previews/wedding/pastel-studio.jpg",
  ],
];

export default function HomePage() {
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  return <main className={styles.page}>
    <SiteNavbar />
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <h1>Platform<br/>Undangan Website<br/>&amp; Bisnis Digital</h1>
        <p className={styles.heroDescription}>Solusi acara lebih hemat, praktis, dan kekinian dengan <strong>e-invitation</strong> yang dapat dibagikan tanpa batas.</p>
        <div className={styles.actions}><Link href="/demo" className={styles.primary}>Lihat Tema <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></Link></div>
      </div>
      <div className={styles.heroVisual} aria-label="Koleksi tema undangan Vistiq">
        <svg className={styles.coverWaves} viewBox="0 0 1200 118" preserveAspectRatio="none" aria-hidden="true">
          <path className={styles.waveBack} d="M0 0H1200V35C1080 18 1018 58 900 40C785 22 716 13 598 39C486 64 390 13 282 36C170 60 89 22 0 48Z"/>
          <path className={styles.waveMiddle} d="M0 0H1200V54C1092 77 1002 24 884 52C770 79 700 39 586 56C466 74 375 25 259 55C151 82 75 43 0 67Z"/>
          <path className={styles.waveFront} d="M0 0H1200V70C1090 47 1008 92 894 67C780 42 700 86 581 70C464 54 374 96 264 72C158 49 81 91 0 76Z"/>
        </svg>
        {HERO_COLUMNS.map((column,columnIndex)=><div key={column[0]} className={`${styles.coverColumn} ${styles[`column${columnIndex + 1}`]}`}><div className={styles.coverTrack}>{[...column,...column].map((src,index)=><div key={`${src}-${index}`} className={styles.inviteCard}><Image src={src} alt="Preview tema undangan Vistiq" fill sizes="(max-width: 640px) 29vw, 180px"/></div>)}</div></div>)}
      </div>
    </section>
    <section className={styles.statsBar}><div><strong>Beragam Tema</strong><span>Desain undangan premium siap digunakan</span></div><div><strong>Bagikan Tanpa Batas</strong><span>Nama tamu dan ucapan tersimpan di dashboard</span></div></section>
    <section className={styles.statement}><p className={styles.eyebrow}>KENAPA VISTIQ INVITATION</p><h2>Keindahan desain bertemu dengan kemudahan teknologi.</h2><p>Vistiq membantu Anda membuat pengalaman mengundang yang berkesan, dari saat tautan diterima hingga tamu mengirimkan konfirmasi kehadiran dan doa terbaik.</p></section>
    <section id="fitur" className={styles.features}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>FITUR UNDANGAN</p><h2>Lengkap untuk setiap momen istimewa.</h2></div><p>Semua kebutuhan undangan tersusun praktis dalam satu platform.</p></div><div className={styles.featureGrid}>{FEATURES.map(([title,description,icon])=><details className={styles.featureCard} key={title}><summary><span className={styles.featureIcon}>{icon}</span><h3>{title}</h3><span className={styles.featureChevron}>⌄</span></summary><p>{description}</p></details>)}</div></section>
    <section id="tema" className={styles.themes}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>KOLEKSI DESAIN</p><h2>Tema yang mengikuti cerita Anda.</h2></div><Link href="/demo">Lihat semua tema <span>→</span></Link></div><ThemeBrowser priceWasLabel="Rp 149.000" discountLabel="34%"/></section>
    <section id="harga" className={styles.pricing}><div className={styles.centerHeading}><p className={styles.eyebrow}>PAKET VISTIQ</p><h2>Pilih cara terbaik untuk memulai.</h2><p>Untuk satu acara, penghasilan tambahan, atau membangun platform dengan brand sendiri.</p></div><div className={styles.priceGrid}>
      <article className={styles.priceCard}><p>CLIENT</p><h3>Rp99.000</h3><span>Satu undangan premium</span><ul><li>Dashboard client mandiri</li><li>Semua fitur undangan aktif</li><li>Nama tamu tanpa batas</li></ul><CheckoutButton packageId="client" label="Buat Undangan" production={production}/></article>
      <article className={`${styles.priceCard} ${styles.featured}`}><b>PALING POPULER</b><p>RESELLER</p><h3>Rp149.000</h3><span>Sekali bayar, aktif selamanya</span><ul><li>Jual undangan tanpa batas</li><li>Dashboard reseller lengkap</li><li>80% hasil penjualan untuk Anda</li></ul><CheckoutButton packageId="reseller" label="Gabung Reseller" featured production={production}/></article>
      <article className={styles.priceCard}><p>RESELLER BRAND</p><h3>Rp59.000<small>/bulan</small></h3><span>White-label untuk brand Anda</span><ul><li>Nama, logo, dan warna sendiri</li><li>Keuntungan 100% milik Anda</li><li>Subdomain dan custom domain</li></ul><CheckoutButton packageId="reseller-brand" label="Bangun Brand Sendiri" production={production}/></article>
      <article className={styles.priceCard}><p>AFFILIATE</p><h3>Gratis</h3><span>Promosikan melalui link</span><ul><li>Komisi 30% semua paket</li><li>Pencairan mulai Rp100.000</li><li>Dashboard komisi transparan</li></ul><Link className={styles.planLink} href="/gabung-affiliate">Gabung Affiliate</Link></article>
    </div></section>
    <section className={styles.faq}><div className={styles.centerHeading}><p className={styles.eyebrow}>PERTANYAAN UMUM</p><h2>Yang sering ditanyakan.</h2></div><div className={styles.faqGrid}>{FAQ.map(([q,a],i)=><details key={q} open={i===0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <section className={styles.finalCta}><p>Mulai cerita istimewa Anda bersama Vistiq.</p><h2>Undangan yang berkesan, dibuat lebih mudah.</h2><div className={styles.actions}><Link href="/demo" className={styles.primary}>Pilih Tema</Link><Link href="/gabung-reseller" className={styles.secondary}>Jadi Reseller</Link></div></section>
    <footer className={styles.footer}><div><Link href="/" className={styles.footerBrand}><small>VISTIQ</small>Invitation</Link><p>Platform undangan digital premium untuk acara dan bisnis Anda.</p></div><div><strong>Produk</strong><Link href="/demo">Tema</Link><Link href="/pilih-paket">Paket</Link><Link href="/gabung-reseller">Reseller</Link></div><div><strong>Akun</strong><Link href="/login">Login Dashboard</Link><Link href="/gabung-affiliate">Affiliate</Link></div><p className={styles.copyright}>© 2026 Vistiq Invitation. Seluruh hak dilindungi.</p></footer>
  </main>;
}
