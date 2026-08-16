import type { Metadata } from "next";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import PhoneMockup from "@/components/PhoneMockup";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeBrowser from "@/components/ThemeBrowser";
import { PAYMENT_PACKAGES, type PaymentPackageId } from "@/lib/paymentPackages";

export const metadata: Metadata = {
  title: "Pilih Paket & Mulai Bisnis Undangan Digital | Vistiq Invitation",
  description:
    "Buat undangan digital sendiri atau mulai bisnis undangan digital bersama Vistiq. Pilih paket Client, Reseller, atau Reseller Brand.",
};

type PageProps = {
  searchParams: Promise<{ paket?: string | string[]; ref?: string | string[] }>;
};

const HERO_FAN = [
  { key: "jawa-merah", rotate: -16, x: -95, y: 22, scale: 0.82, z: 1 },
  { key: "santorini", rotate: -8, x: -48, y: 5, scale: 0.9, z: 2 },
  { key: "golden-romance", rotate: 0, x: 0, y: -8, scale: 1, z: 3 },
  { key: "menara-cahaya", rotate: 8, x: 48, y: 5, scale: 0.9, z: 2 },
  { key: "art-deco-glam", rotate: 16, x: 95, y: 22, scale: 0.82, z: 1 },
];

const packageDetails: Array<{
  id: PaymentPackageId;
  title: string;
  eyebrow: string;
  description: string;
  features: string[];
  button: string;
  featured?: boolean;
}> = [
  {
    id: "client",
    title: "Bikin Undangan",
    eyebrow: "Paket Client",
    description: "Untuk Anda yang membutuhkan satu undangan digital premium untuk acara sendiri.",
    features: [
      "1 undangan digital premium",
      "Edit data dan unggah foto sendiri",
      "RSVP, galeri, musik, dan amplop digital",
      "Pilihan tema premium siap pakai",
    ],
    button: "Bikin Undangan Sekarang",
  },
  {
    id: "reseller",
    title: "Mulai Jadi Reseller",
    eyebrow: "Paket Reseller",
    description: "Untuk mulai mendapatkan penghasilan dari menjual undangan digital Vistiq.",
    features: [
      "Dashboard khusus reseller",
      "Tambah dan kelola client sendiri",
      "Komisi 40% setiap penjualan",
      "Sekali bayar, akses selamanya",
    ],
    button: "Bayar & Daftar Reseller",
    featured: true,
  },
  {
    id: "reseller-brand",
    title: "Bangun Brand Sendiri",
    eyebrow: "Paket Reseller Brand",
    description: "Untuk membangun usaha undangan dengan identitas bisnis dan keuntungan milik Anda sendiri.",
    features: [
      "Semua fitur paket Reseller",
      "Nama, logo, dan warna brand sendiri",
      "Subdomain gratis atau custom domain",
      "Keuntungan penjualan 100% milik Anda",
      "Update tema dan konten promosi",
    ],
    button: "Pilih Reseller Brand",
  },
];

const BENEFITS = [
  ["Tanpa Coding", "Buat undangan melalui dashboard yang mudah digunakan, bahkan untuk pemula."],
  ["Tema Premium", "Pilihan desain wedding, aqiqah, khitan, ulang tahun, dan kategori lainnya."],
  ["Bisa dari HP", "Kelola data client, foto, acara, RSVP, dan pesanan dari mana saja."],
  ["Siap Dijual", "Tidak perlu membangun website atau membuat sistem sendiri dari nol."],
  ["Client Mandiri", "Client dapat mengedit data dan mengunggah foto melalui dashboard pribadinya."],
  ["Dukungan Tim", "Tim Vistiq siap membantu saat Anda mengalami kendala menggunakan platform."],
];

const STEPS = [
  ["1", "Pilih Paket", "Tentukan apakah Anda ingin membuat undangan sendiri, menjadi reseller, atau membangun brand."],
  ["2", "Bayar & Akun Aktif", "Selesaikan pembayaran aman melalui Midtrans. Akun dibuat otomatis setelah pembayaran berhasil."],
  ["3", "Mulai Gunakan", "Pilih tema, isi data acara, lalu bagikan undangan atau mulai menawarkan jasa ke client."],
];

const FAQS = [
  ["Apakah saya harus bisa desain atau coding?", "Tidak. Semua proses dilakukan melalui dashboard dan form yang mudah digunakan."],
  ["Apa perbedaan Reseller dan Reseller Brand?", "Reseller menjual layanan menggunakan brand Vistiq dan memperoleh komisi. Reseller Brand menggunakan identitas bisnis sendiri dan mengambil 100% keuntungan penjualannya."],
  ["Apakah paket Reseller memiliki biaya bulanan?", "Tidak. Paket Reseller dibayar sekali dan aktif selamanya."],
  ["Mengapa Reseller Brand berlangganan bulanan?", "Karena paket ini mencakup white label, subdomain atau custom domain, update tema, konten promosi, dan benefit premium lainnya."],
  ["Bagaimana akun saya diterima?", "Setelah pembayaran berhasil, sistem otomatis membuat akun dan mengirimkan informasi akses ke email yang Anda gunakan."],
];

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function cleanReferral(value?: string) {
  return (value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 32);
}

export default async function PilihPaketPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedPackage = first(params.paket);
  const selected = packageDetails.some((item) => item.id === requestedPackage)
    ? (requestedPackage as PaymentPackageId)
    : null;
  const referralCode = cleanReferral(first(params.ref));
  const midtransProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  return (
    <main className="page">
      <style>{css}</style>
      <SiteNavbar />

      <section className="hero">
        <div className="heroCopy">
          <p className="badge">Platform Undangan Digital Siap Pakai</p>
          <h1>Satu Platform untuk Membuat Undangan atau Memulai Bisnis Digital</h1>
          <p className="lead">
            Tidak perlu bisa desain, tidak perlu coding, dan tidak perlu membangun
            website dari nol. Pilih paket sesuai tujuan Anda dan mulai hari ini.
          </p>
          <div className="heroActions">
            <a href="#paket" className="primaryButton">Lihat Pilihan Paket</a>
            <Link href="/demo" className="secondaryButton">Lihat Demo Tema</Link>
          </div>
          <div className="heroFacts">
            <span>✓ Mudah digunakan</span>
            <span>✓ Pembayaran aman</span>
            <span>✓ Support tim Vistiq</span>
          </div>
        </div>
        <div className="visual">
          {HERO_FAN.map((item) => (
            <PhoneMockup
              key={item.key}
              themeKey={item.key}
              width={122}
              className="phone"
              style={{
                transform: `translate(calc(-50% + ${item.x}px), calc(-50% + ${item.y}px)) rotate(${item.rotate}deg) scale(${item.scale})`,
                zIndex: item.z,
              }}
            />
          ))}
        </div>
      </section>

      {referralCode && (
        <div className="referral">✓ Link rekomendasi Affiliate Vistiq terverifikasi</div>
      )}

      <section className="intro section">
        <p className="sectionLabel">PILIH SESUAI TUJUAN</p>
        <h2>Mau Jadi Pengguna atau Mulai Punya Penghasilan?</h2>
        <p className="sectionLead">
          Vistiq tidak hanya membantu membuat undangan digital. Platform ini juga
          dapat menjadi pintu masuk untuk membangun penghasilan tambahan dan bisnis
          undangan digital dengan brand sendiri.
        </p>
        <div className="pathGrid">
          <div className="pathCard">
            <span>01</span>
            <h3>Butuh Undangan Sendiri</h3>
            <p>Pilih Client jika Anda hanya ingin membuat satu undangan premium untuk acara sendiri.</p>
            <a href="#client">Lihat Paket Client →</a>
          </div>
          <div className="pathCard highlighted">
            <span>02</span>
            <h3>Ingin Penghasilan Tambahan</h3>
            <p>Pilih Reseller untuk mulai menawarkan undangan digital tanpa membuat sistem sendiri.</p>
            <a href="#reseller">Lihat Paket Reseller →</a>
          </div>
          <div className="pathCard">
            <span>03</span>
            <h3>Ingin Punya Brand Sendiri</h3>
            <p>Pilih Reseller Brand untuk menjalankan usaha white label dengan nama dan domain sendiri.</p>
            <a href="#reseller-brand">Lihat Reseller Brand →</a>
          </div>
        </div>
      </section>

      <section className="benefitSection">
        <div className="section">
          <p className="sectionLabel lightLabel">KENAPA VISTIQ</p>
          <h2>Semua yang Dibutuhkan Sudah Disiapkan</h2>
          <div className="benefitGrid">
            {BENEFITS.map(([title, desc]) => (
              <div className="benefitCard" key={title}>
                <span className="check">✓</span>
                <div><h3>{title}</h3><p>{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo-undangan" className="demoSection">
        <div className="section">
          <p className="sectionLabel lightLabel">DEMO UNDANGAN</p>
          <h2>Lihat Hasil Undangannya Sebelum Memilih Paket</h2>
          <p className="demoLead">
            Jelajahi berbagai pilihan tema undangan pernikahan, aqiqah, khitan,
            ulang tahun, dan kategori lainnya. Klik salah satu tema untuk melihat
            demo undangan secara langsung.
          </p>
          <ThemeBrowser priceWasLabel="Rp 149.000" discountLabel="34%" />
          <div className="demoAction">
            <Link href="/demo" className="demoButton">
              Lihat Semua Demo Undangan
            </Link>
          </div>
        </div>
      </section>

      <section className="section stepsSection">
        <p className="sectionLabel">CARA MEMULAI</p>
        <h2>Hanya Tiga Langkah</h2>
        <div className="steps">
          {STEPS.map(([number, title, desc]) => (
            <div className="step" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="paket" className="packageSection">
        <div className="section">
          <p className="sectionLabel">PILIHAN PAKET</p>
          <h2>Pilih Paket yang Paling Cocok untuk Anda</h2>
          <p className="sectionLead">
            Semua pembayaran diproses melalui Midtrans. Akun akan dibuat otomatis
            setelah transaksi berhasil.
          </p>
          <div className="packageGrid">
            {packageDetails.map((item) => {
              const isSelected = selected === item.id;
              const price = PAYMENT_PACKAGES[item.id].amount;
              return (
                <article id={item.id} key={item.id} className={`packageCard ${item.featured ? "featuredCard" : ""} ${isSelected ? "selectedCard" : ""}`}>
                  {isSelected && <span className="topBadge green">Paket pilihan Anda</span>}
                  {!isSelected && item.featured && <span className="topBadge">Paling Populer</span>}
                  <p className="cardEyebrow">{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <p className="cardDescription">{item.description}</p>
                  <strong className="price">
                    Rp {price.toLocaleString("id-ID")}
                    <small>{item.id === "reseller-brand" ? "/bulan" : "/sekali bayar"}</small>
                  </strong>
                  <ul>
                    {item.features.map((feature) => (
                      <li key={feature}><span>✓</span>{feature}</li>
                    ))}
                  </ul>
                  <CheckoutButton
                    packageId={item.id}
                    label={item.button}
                    featured={item.featured}
                    production={midtransProduction}
                    autoOpen={isSelected}
                    referralCode={referralCode}
                  />
                  <small className="payment">QRIS · Virtual Account · E-Wallet</small>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="affiliate">
        <div>
          <span>GRATIS BERGABUNG</span>
          <h2>Belum Siap Mengelola Client?</h2>
          <p>Gabung Affiliate, bagikan link referral, dan dapatkan komisi 10% dari penjualan paket Vistiq.</p>
        </div>
        <Link href="/gabung-affiliate">Gabung Affiliate Gratis</Link>
      </section>

      <section className="section faq">
        <p className="sectionLabel">PERTANYAAN UMUM</p>
        <h2>Masih Ada yang Ingin Ditanyakan?</h2>
        <div className="faqList">
          {FAQS.map(([q, a]) => (
            <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <h2>Sudah Siap Memulai?</h2>
        <p>Pilih paket terbaik untuk kebutuhan atau bisnis undangan digital Anda.</p>
        <a href="#paket">Pilih Paket Sekarang</a>
      </section>

      <footer>© 2026 Vistiq Invitation. All rights reserved.</footer>
    </main>
  );
}

const css = `
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}.page{min-height:100vh;background:#f7f9fc;color:#0f172a;font-family:Arial,Helvetica,sans-serif}.hero{max-width:1180px;margin:auto;padding:70px 24px 90px;display:grid;grid-template-columns:1.08fr .92fr;gap:50px;align-items:center}.badge,.sectionLabel{color:#1167b2;font-size:12px;font-weight:900;letter-spacing:2px}.badge{display:inline-block;margin:0;padding:9px 15px;border-radius:999px;background:#dbeafe}.hero h1{margin:20px 0;color:#0f4e8a;font-size:54px;line-height:1.06;letter-spacing:-.04em}.lead,.sectionLead{color:#64748b;font-size:17px;line-height:1.75}.heroActions{display:flex;gap:12px;flex-wrap:wrap;margin-top:27px}.primaryButton,.secondaryButton{display:inline-flex;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:900}.primaryButton{background:#1167b2;color:white}.secondaryButton{background:white;color:#1167b2;border:1px solid #dbeafe}.heroFacts{display:flex;gap:17px;flex-wrap:wrap;margin-top:24px;color:#64748b;font-size:12px;font-weight:800}.visual{position:relative;width:330px;max-width:100%;height:340px;margin:auto}.phone{position:absolute;top:50%;left:50%}.referral{width:max-content;max-width:calc(100% - 32px);margin:-48px auto 40px;padding:9px 14px;border:1px solid #bbf7d0;border-radius:999px;background:#f0fdf4;color:#15803d;font-size:12px;font-weight:800}.section{max-width:1180px;margin:auto;padding:80px 24px}.section h2,.benefitSection h2{margin:10px 0 18px;font-size:40px;letter-spacing:-.03em}.sectionLead{max-width:730px;margin:0 0 38px}.pathGrid,.steps,.packageGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.pathCard,.step{padding:28px;border:1px solid #e2e8f0;border-radius:24px;background:white;box-shadow:0 12px 36px rgba(15,23,42,.05)}.pathCard.highlighted{border-color:#1167b2}.pathCard>span,.step>span{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:#dbeafe;color:#1167b2;font-weight:900}.pathCard h3,.step h3{margin:18px 0 8px}.pathCard p,.step p{color:#64748b;line-height:1.65;font-size:14px}.pathCard a{color:#1167b2;text-decoration:none;font-size:13px;font-weight:900}.benefitSection{background:#0f172a;color:white}.lightLabel{color:#7dd3fc}.benefitGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-top:34px}.benefitCard{display:flex;gap:14px;padding:22px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:rgba(255,255,255,.06)}.check{display:grid;place-items:center;flex:0 0 30px;height:30px;border-radius:50%;background:#1167b2;font-weight:900}.benefitCard h3{margin:2px 0 6px;font-size:16px}.benefitCard p{margin:0;color:#cbd5e1;font-size:13px;line-height:1.6}.demoSection{background:#0f172a;color:white}.demoSection h2{color:white}.demoLead{max-width:760px;margin:0 0 34px;color:#cbd5e1;font-size:16px;line-height:1.7}.demoSection .themeGrid{max-width:1180px;margin-left:auto;margin-right:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px}.demoSection .themeCard{display:flex;flex-direction:column;align-items:center;padding:16px;border:1px solid rgba(255,255,255,.12);border-radius:20px;background:rgba(255,255,255,.06);color:white;text-align:center;text-decoration:none}.demoSection .themeCard h3{margin:14px 0 4px;font-size:15px}.demoSection .themeCard p{margin:0;color:#94a3b8;font-size:12px;line-height:1.5}.demoAction{text-align:center;margin-top:34px}.demoButton{display:inline-flex;padding:14px 23px;border-radius:999px;background:white;color:#1167b2;text-decoration:none;font-weight:900}.stepsSection{text-align:center}.steps{text-align:left;margin-top:34px}.packageSection{background:#edf4fb}.packageSection>.section{text-align:center}.packageGrid{text-align:left;margin-top:48px;align-items:stretch}.packageCard{position:relative;display:flex;flex-direction:column;padding:30px;border:1px solid #e2e8f0;border-radius:26px;background:white;box-shadow:0 18px 50px rgba(15,23,42,.07)}.featuredCard{border:2px solid #1167b2;box-shadow:0 22px 58px rgba(17,103,178,.16)}.selectedCard{border:2px solid #16a34a}.topBadge{align-self:flex-start;margin:-45px 0 20px;padding:8px 13px;border-radius:999px;background:#1167b2;color:white;font-size:11px;font-weight:900}.topBadge.green{background:#16a34a}.cardEyebrow{margin:0 0 8px;color:#1167b2;font-size:11px;font-weight:900;letter-spacing:1.3px}.packageCard h3{margin:0;font-size:27px}.cardDescription{min-height:72px;color:#64748b;font-size:14px;line-height:1.6}.price{display:block;margin:10px 0 18px;color:#1167b2;font-size:30px}.price small{margin-left:4px;color:#94a3b8;font-size:11px}.packageCard ul{display:grid;gap:11px;margin:0 0 24px;padding:0;list-style:none;flex:1}.packageCard li{display:flex;gap:9px;color:#475569;font-size:13px;line-height:1.45}.packageCard li span{display:grid;place-items:center;flex:0 0 20px;height:20px;border-radius:50%;background:#dcfce7;color:#15803d;font-size:11px;font-weight:900}.packageCard .priceButton{width:100%;min-height:48px;margin-top:auto;border:0;border-radius:13px;background:linear-gradient(135deg,#1167b2,#0f4e8a);color:white;font-family:inherit;font-weight:900;cursor:pointer}.payment{display:block;margin-top:10px;color:#94a3b8;font-size:9px;font-weight:800;letter-spacing:.07em;text-align:center}.affiliate{max-width:960px;margin:74px auto;padding:34px;display:flex;align-items:center;justify-content:space-between;gap:26px;border-radius:25px;background:#0f172a;color:white}.affiliate span{color:#7dd3fc;font-size:11px;font-weight:900;letter-spacing:1.5px}.affiliate h2{margin:10px 0 8px}.affiliate p{max-width:620px;margin:0;color:#cbd5e1;line-height:1.6}.affiliate a,.finalCta a{flex:0 0 auto;padding:14px 21px;border-radius:999px;background:white;color:#1167b2;text-decoration:none;font-weight:900}.faq{text-align:center}.faqList{max-width:820px;margin:34px auto 0;text-align:left}.faq details{margin-bottom:12px;padding:20px 22px;border:1px solid #e2e8f0;border-radius:17px;background:white}.faq summary{display:flex;justify-content:space-between;gap:15px;cursor:pointer;font-weight:900}.faq summary span{color:#1167b2}.faq details p{margin:14px 0 0;color:#64748b;line-height:1.65}.finalCta{padding:85px 24px;text-align:center;background:linear-gradient(135deg,#1167b2,#0f4e8a);color:white}.finalCta h2{margin:0 0 10px;font-size:40px}.finalCta p{margin:0 0 25px;color:#dbeafe}footer{padding:28px;color:#94a3b8;font-size:12px;text-align:center}@media(max-width:900px){.hero{grid-template-columns:1fr;padding-top:45px}.heroCopy{text-align:center}.heroActions,.heroFacts{justify-content:center}.pathGrid,.steps,.packageGrid,.benefitGrid{grid-template-columns:1fr}.demoSection .themeGrid{grid-template-columns:repeat(3,1fr);gap:9px}.demoSection .themeCard{padding:9px 5px 11px;border-radius:13px}.demoSection .themeCard h3{font-size:10.5px;margin-top:8px}.demoSection .themeCard p{display:none}.packageGrid{max-width:540px;margin-left:auto;margin-right:auto;gap:32px}.cardDescription{min-height:0}.affiliate{margin-left:24px;margin-right:24px;flex-direction:column;align-items:flex-start}}@media(max-width:560px){.hero{padding:42px 20px 60px}.hero h1{font-size:38px}.lead{font-size:16px}.visual{height:285px}.section{padding:58px 18px}.section h2,.benefitSection h2,.finalCta h2{font-size:31px}.primaryButton,.secondaryButton{width:100%;justify-content:center}.pathCard,.step,.packageCard{padding:24px 21px}.affiliate{margin:50px 16px;padding:26px 22px}.affiliate a{width:100%;text-align:center}.referral{margin-top:-30px}}`;
