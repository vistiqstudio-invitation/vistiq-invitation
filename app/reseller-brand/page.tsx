import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeBrowser from "@/components/ThemeBrowser";

const WA_NUMBER = "6281371338032";

const HERO_FAN = [
  { key: "royal-imperial", rotate: -18, x: -108, y: 20, scale: 0.82, z: 1 },
  { key: "art-deco-glam", rotate: -9, x: -58, y: 4, scale: 0.9, z: 2 },
  { key: "luxury-gold", rotate: 0, x: 0, y: -10, scale: 1, z: 3 },
  { key: "golden-romance", rotate: 9, x: 58, y: 4, scale: 0.9, z: 2 },
  { key: "santorini", rotate: 18, x: 108, y: 20, scale: 0.82, z: 1 },
];

const STEPS = [
  {
    n: "1",
    title: "Aktifkan & Atur Brand",
    desc: "Isi nama brand, upload logo, dan pilih warna brand kamu sendiri di dashboard.",
  },
  {
    n: "2",
    title: "Buat Undangan untuk Client",
    desc: "Setiap undangan yang kamu buat otomatis pakai identitas brand kamu, bukan Vistiq.",
  },
  {
    n: "3",
    title: "Client Bayar Penuh ke Kamu",
    desc: "Tidak ada potongan komisi — 100% harga yang kamu tetapkan masuk kantong kamu.",
  },
];

const COMPARISON = [
  ["Nama yang tampil ke client", "Vistiq Invitation", "Brand kamu sendiri"],
  ["Profit per penjualan", "40% komisi", "100% milik sendiri"],
  ["Biaya", "Rp149.000 sekali bayar", "Rp59.000/bulan"],
  ["Update tema & konten promosi", "Tidak ada", "Setiap bulan"],
  ["Dashboard", "Dashboard reseller standar", "Dashboard full branding sendiri"],
];

const BENEFITS = [
  ["Logo & nama brand tampil di setiap undangan", "Bukan lagi \"Vistiq Invitation\" — client lihat brand kamu sepenuhnya."],
  ["Warna brand custom di dashboard client", "Identitas brand kamu konsisten dari undangan sampai dashboard."],
  ["Profit 100% dari setiap penjualan", "Kamu yang tentukan harga ke client, tidak ada potongan komisi."],
  ["Dashboard reseller lengkap", "Selengkap dashboard tim Vistiq sendiri — kelola client, RSVP, dan galeri."],
  ["Update tema baru setiap bulan", "Koleksi tema terus bertambah tiap bulan, langsung bisa kamu jual."],
  ["Konten promosi siap pakai tiap bulan", "Materi promosi baru tiap bulan buat bantu kamu jualan di media sosial."],
  ["Support teknis dari tim Vistiq", "Kami bantu di belakang layar — client kamu tidak perlu tahu."],
];

const FAQS = [
  {
    q: "Apakah client akan tahu ini pakai sistem Vistiq?",
    a: "Tidak. Nama brand, logo, dan warna kamu sendiri yang tampil di setiap halaman undangan dan dashboard — bukan \"Vistiq Invitation\".",
  },
  {
    q: "Apa bedanya dengan paket Reseller biasa?",
    a: "Reseller biasa jual di bawah brand Vistiq Invitation dan dapat komisi 40%. Reseller Brand pakai identitas brand kamu sendiri dan kamu simpan 100% dari harga yang kamu tetapkan.",
  },
  {
    q: "Saya sudah reseller biasa, bisa upgrade?",
    a: "Bisa kapan saja. Tinggal hubungi tim Vistiq lewat WhatsApp untuk upgrade akun reseller kamu ke Reseller Brand.",
  },
  {
    q: "Berapa biayanya?",
    a: "Rp59.000/bulan, layaknya member premium — dapat update tema dan konten promosi baru tiap bulan, plus 100% profit dari setiap penjualan jadi milikmu.",
  },
  {
    q: "Bagaimana cara perpanjangan tiap bulan?",
    a: "Perpanjangan dilakukan manual. Dashboard reseller kamu akan menampilkan pengingat masa aktif akun — kalau sudah mendekati atau melewati masa aktif, tinggal hubungi admin Vistiq lewat WhatsApp untuk bayar, dan akun langsung diaktifkan kembali setelah pembayaran dikonfirmasi.",
  },
  {
    q: "Kalau saya bingung pas setup brand, ada yang bantu?",
    a: "Ada. Tim Vistiq siap bantu langsung lewat WhatsApp, dari atur logo & warna sampai cara jualan ke client.",
  },
];

export default function ResellerBrandPage() {
  const ctaText = (context: string) =>
    encodeURIComponent(`Halo Vistiq Invitation, saya ingin aktifkan Reseller Brand (dari landing page ${context})`);

  return (
    <main className="page">
      <style>{css}</style>

      <SiteNavbar />

      <section className="hero">
        <div className="heroText">
          <p className="badge">⭐ Layaknya Member Premium</p>

          <h1>Punya Bisnis Undangan Digital dengan Nama Kamu Sendiri</h1>

          <p>
            Reseller Brand: logo, nama, dan warna brand kamu tampil di setiap
            undangan yang kamu jual. <strong>Rp59.000/bulan</strong>, dapat
            update tema dan konten promosi baru tiap bulan, dan 100%
            keuntungan jadi milikmu.
          </p>

          <div className="heroActions">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${ctaText("hero")}`}
              target="_blank"
              className="primaryButton"
            >
              Aktifkan Brand Saya
            </a>

            <Link href="/demo" className="secondaryButton">
              Lihat Demo Tema
            </Link>
          </div>

          <div className="statBar">
            <div>
              <strong>100%</strong>
              <span>Profit Milikmu</span>
            </div>
            <div>
              <strong>Tiap Bulan</strong>
              <span>Update Tema & Konten Promosi</span>
            </div>
            <div>
              <strong>Manual</strong>
              <span>Perpanjangan via Admin Vistiq</span>
            </div>
          </div>
        </div>

        <div className="heroCard">
          <div className="phoneFan">
            {HERO_FAN.map((item) => (
              <PhoneMockup
                key={item.key}
                themeKey={item.key}
                width={128}
                className="phoneFanItem"
                style={{
                  transform: `translate(calc(-50% + ${item.x}px), calc(-50% + ${item.y}px)) rotate(${item.rotate}deg) scale(${item.scale})`,
                  zIndex: item.z,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="sectionDark">
        <p className="label">White Label Sungguhan</p>
        <h2>Client Kamu Lihat Brand Kamu, Bukan Vistiq</h2>

        <div className="beforeAfterGrid">
          <div className="baCard">
            <small>Reseller Biasa</small>
            <p className="baFooterLine">© 2026 Vistiq Invitation</p>
            <p className="baDesc">
              Setiap undangan dan dashboard menampilkan identitas Vistiq
              Invitation.
            </p>
          </div>

          <div className="baCard baHighlight">
            <small>Reseller Brand</small>
            <p className="baFooterLine">© 2026 [Nama Brand Kamu]</p>
            <p className="baDesc">
              Footer undangan, dashboard, sampai warna tampilan otomatis
              pakai identitas brand kamu sendiri.
            </p>
          </div>
        </div>

        <p className="darkNote">
          Setiap halaman undangan yang kamu buat otomatis menampilkan nama
          brand kamu di footer — bukan lagi "Vistiq Invitation".
        </p>
      </section>

      <section className="section">
        <p className="label">Reseller vs Reseller Brand</p>
        <h2>Kenapa Upgrade ke Reseller Brand?</h2>

        <div className="compareTable">
          <div className="compareRow compareHead">
            <span></span>
            <span>Reseller</span>
            <span>Reseller Brand</span>
          </div>
          {COMPARISON.map((row) => (
            <div className="compareRow" key={row[0]}>
              <span className="compareLabel">{row[0]}</span>
              <span>{row[1]}</span>
              <span className="compareBrand">{row[2]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="label">Cara Kerjanya</p>
        <h2>3 Langkah Jadi Brand Sendiri</h2>

        <div className="stepsGrid">
          {STEPS.map((step) => (
            <div className="stepCard" key={step.n}>
              <span className="stepNumber">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tema" className="section">
        <p className="label">Katalog Produk</p>
        <h2>Semua Tema Ini Bisa Kamu Jual dengan Brand Sendiri</h2>

        <ThemeBrowser />
      </section>

      <section className="sectionDark">
        <p className="label">Simulasi Penghasilan</p>
        <h2>Bandingkan: Komisi 40% vs Profit 100%</h2>
        <p className="darkIntro">
          Contoh kalau kamu jual ke 10 client dalam sebulan, di harga
          Rp200.000 per undangan.
        </p>

        <div className="simCompareGrid">
          <div className="simCompareCard">
            <small>Reseller (komisi 40%)</small>
            <strong>Rp 800.000</strong>
            <p>dari total penjualan Rp2.000.000</p>
          </div>
          <div className="simCompareCard simCompareHighlight">
            <small>Reseller Brand (100%)</small>
            <strong>Rp 2.000.000</strong>
            <p>seluruh penjualan jadi milikmu</p>
          </div>
        </div>

        <p className="simDisclaimer">
          *Simulasi ilustratif, hasil nyata tergantung usaha pemasaran
          masing-masing reseller.
        </p>
      </section>

      <section className="section">
        <p className="label">Yang Kamu Dapatkan</p>
        <h2>Berlangganan Bulanan, Ini Semua Milikmu</h2>

        <div className="benefitGrid">
          {BENEFITS.map((item) => (
            <div className="benefitCard" key={item[0]}>
              <span className="checkIcon">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 10.5L8 14.5L16 5.5"
                    stroke="white"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h3>{item[0]}</h3>
                <p>{item[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="label">Pertanyaan Umum</p>
        <h2>Masih Ragu? Ini Jawabannya</h2>

        <div className="faqList">
          {FAQS.map((item) => (
            <div className="faqItem" key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="priceHighlight">
          <p className="label white">Reseller Brand</p>
          <p className="promoBadge">Layaknya Member Premium</p>
          <h2>
            Rp 59.000<span>/bulan</span>
          </h2>
          <p>
            White label penuh, profit 100%, update tema dan konten promosi
            setiap bulan. Tagihan manual — dashboard kamu akan mengingatkan
            sebelum masa aktif habis.
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${ctaText("price-highlight")}`}
            target="_blank"
            className="whiteButton"
          >
            Aktifkan Brand Saya
          </a>
          <p className="priceNote">
            Sudah punya akun Reseller biasa? Hubungi kami untuk upgrade
            langsung.
          </p>
        </div>
      </section>

      <section className="cta">
        <h2>Siap Punya Brand Undangan Digital Sendiri?</h2>
        <p>
          Rp59.000/bulan, layaknya member premium — dapat update tema dan
          konten promosi baru tiap bulan, dan 100% keuntungan jadi milikmu.
        </p>

        <div className="heroActions center">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${ctaText("final-cta")}`}
            target="_blank"
            className="primaryButton"
          >
            Aktifkan Brand Saya Sekarang
          </a>

          <Link href="/demo" className="secondaryButton">
            Lihat Demo Tema
          </Link>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Vistiq Invitation. All rights reserved.</p>
      </footer>
    </main>
  );
}

const css = `
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.page {
  min-height: 100vh;
  background: #f6f8fb;
  color: #0f172a;
  font-family: Arial, Helvetica, sans-serif;
}

.navbar {
  position: relative;
  max-width: 1180px;
  margin: 0 auto;
  padding: 22px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menuToggle {
  display: none;
}

.brand {
  text-decoration: none;
}

.brand p {
  color: #1167b2;
  font-weight: 900;
  letter-spacing: 3px;
  font-size: 12px;
  margin: 0;
}

.brand h1 {
  margin: 0;
  font-size: 28px;
  color: #0f172a;
}

.navMenu {
  display: flex;
  gap: 22px;
  align-items: center;
  font-weight: 700;
}

.navMenu a {
  color: #0f172a;
  text-decoration: none;
  white-space: nowrap;
}

.navButton {
  background: #1167b2;
  color: white !important;
  padding: 13px 22px;
  border-radius: 999px;
  box-shadow: 0 12px 30px rgba(17,103,178,.25);
}

.hero {
  max-width: 1180px;
  margin: 0 auto;
  padding: 60px 24px 90px;
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 40px;
  align-items: center;
  background: radial-gradient(circle at 85% 15%, rgba(212,175,55,.1), transparent 55%);
}

.badge {
  display: inline-block;
  background: #fdf3d9;
  color: #92700f;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 800;
}

.heroText h1 {
  font-size: 46px;
  line-height: 1.12;
  margin: 22px 0;
  color: #0f4e8a;
}

.heroText p {
  color: #475569;
  font-size: 18px;
  line-height: 1.8;
  max-width: 620px;
}

.heroActions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.heroActions.center {
  justify-content: center;
}

.primaryButton,
.secondaryButton {
  padding: 14px 24px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 800;
  display: inline-block;
}

.primaryButton {
  background: #1167b2;
  color: white;
}

.secondaryButton {
  background: white;
  color: #1167b2;
  border: 1px solid #dbeafe;
}

.statBar {
  display: flex;
  gap: 30px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.statBar div {
  display: flex;
  flex-direction: column;
}

.statBar strong {
  font-size: 24px;
  color: #0f4e8a;
}

.statBar span {
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.heroCard {
  display: grid;
  place-items: center;
}

.phoneFan {
  position: relative;
  width: 340px;
  max-width: 100%;
  height: 320px;
  margin: 0 auto;
}

.phoneFanItem {
  position: absolute;
  top: 50%;
  left: 50%;
  transition: transform 0.4s ease;
}

.section {
  max-width: 1180px;
  margin: 0 auto;
  padding: 80px 24px;
}

.label {
  color: #1167b2;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 13px;
}

.section h2,
.sectionDark h2,
.cta h2 {
  font-size: 38px;
  margin: 10px 0 24px;
}

.sectionDark {
  background: #0f172a;
  color: white;
  padding: 80px 24px;
}

.sectionDark > p,
.sectionDark > h2,
.sectionDark > .darkNote,
.sectionDark > .darkIntro,
.sectionDark > .beforeAfterGrid,
.sectionDark > .simCompareGrid,
.sectionDark > .simDisclaimer {
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
}

.darkIntro {
  color: rgba(255,255,255,.7);
  font-size: 17px;
  line-height: 1.8;
  max-width: 640px;
  margin: 0 0 36px;
}

.darkNote {
  color: rgba(255,255,255,.55);
  font-size: 14px;
  margin-top: 30px;
}

.beforeAfterGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.baCard {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 22px;
  padding: 28px;
}

.baCard small {
  color: rgba(255,255,255,.55);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 11px;
}

.baFooterLine {
  font-family: Georgia, serif;
  font-size: 18px;
  margin: 16px 0;
  padding: 14px;
  background: rgba(0,0,0,.25);
  border-radius: 10px;
  text-align: center;
}

.baDesc {
  color: rgba(255,255,255,.6);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.baHighlight {
  background: rgba(212,175,55,.12);
  border-color: rgba(212,175,55,.4);
}

.baHighlight small {
  color: #d4af37;
}

.baHighlight .baFooterLine {
  background: rgba(212,175,55,.18);
  color: #f5dc8a;
  font-weight: 700;
}

.compareTable {
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0,0,0,.05);
}

.compareRow {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  background: white;
  padding: 18px 24px;
  border-bottom: 1px solid #eef2f7;
  align-items: center;
}

.compareRow:last-child {
  border-bottom: none;
}

.compareHead {
  background: #f1f5f9;
  font-weight: 900;
  color: #0f172a;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: .5px;
}

.compareLabel {
  font-weight: 700;
  color: #0f172a;
}

.compareRow span {
  color: #64748b;
  font-size: 14.5px;
}

.compareBrand {
  color: #1167b2 !important;
  font-weight: 800 !important;
}

.stepsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.stepCard {
  background: white;
  padding: 30px 26px;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(0,0,0,.05);
}

.stepNumber {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #1167b2;
  color: white;
  font-weight: 900;
  font-size: 18px;
  margin-bottom: 16px;
}

.stepCard h3 {
  margin: 0 0 8px;
  font-size: 19px;
}

.stepCard p {
  color: #64748b;
  line-height: 1.7;
  margin: 0;
}

.simCompareGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.simCompareCard {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 22px;
  padding: 30px;
  text-align: center;
}

.simCompareCard small {
  color: rgba(255,255,255,.55);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 11px;
}

.simCompareCard strong {
  display: block;
  font-size: 34px;
  margin: 12px 0 6px;
}

.simCompareCard p {
  color: rgba(255,255,255,.55);
  font-size: 13.5px;
  margin: 0;
}

.simCompareHighlight {
  background: rgba(212,175,55,.14);
  border-color: rgba(212,175,55,.45);
}

.simCompareHighlight strong {
  color: #f5dc8a;
}

.simDisclaimer {
  margin-top: 20px !important;
  font-size: 12.5px !important;
  color: rgba(255,255,255,.45) !important;
  text-align: center;
}

.benefitGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.benefitCard {
  background: white;
  padding: 22px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,.05);
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.checkIcon {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #1167b2;
  display: grid;
  place-items: center;
}

.checkIcon svg {
  width: 16px;
  height: 16px;
}

.benefitCard h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.benefitCard p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.faqList {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.faqItem {
  background: white;
  padding: 24px 28px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,.05);
}

.faqItem h3 {
  margin: 0 0 8px;
  font-size: 16.5px;
}

.faqItem p {
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}

.priceHighlight {
  background: linear-gradient(120deg, #0f4e8a, #1167b2);
  color: white;
  border-radius: 28px;
  padding: 56px;
  text-align: center;
}

.priceHighlight .label.white {
  color: rgba(255,255,255,.7);
}

.priceHighlight .promoBadge {
  display: inline-block;
  background: rgba(255,255,255,.16);
  color: #f5dc8a;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 13px;
  margin: 10px 0 0;
}

.priceHighlight h2 {
  font-size: 46px;
  margin: 6px 0 14px;
}

.priceHighlight h2 span {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255,255,255,.75);
}

.priceHighlight > p {
  color: rgba(255,255,255,.85);
  font-size: 16px;
  max-width: 460px;
  margin: 0 auto 26px;
}

.whiteButton {
  background: white;
  color: #1167b2;
  padding: 15px 30px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 900;
  white-space: nowrap;
  display: inline-block;
}

.priceNote {
  margin: 18px 0 0 !important;
  font-size: 13px !important;
  color: rgba(255,255,255,.6) !important;
}

.cta {
  text-align: center;
  padding: 90px 24px;
}

.footer {
  text-align: center;
  padding: 28px;
  color: #64748b;
}

@media (max-width: 768px) {
  .navbar {
    padding: 16px 24px;
  }

  .brand h1 {
    font-size: 22px;
  }

  .menuToggle {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #1167b2;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 14px;
    cursor: pointer;
  }

  .navBackdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    z-index: 40;
  }

  .navMenu {
    display: none;
  }

  .navMenu.navMenuOpen {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    position: absolute;
    top: calc(100% + 8px);
    left: 24px;
    right: 24px;
    background: white;
    border-radius: 18px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
    padding: 12px;
    z-index: 50;
  }

  .navMenu.navMenuOpen a {
    padding: 13px 14px;
    border-radius: 12px;
    font-size: 15px;
  }

  .navMenu.navMenuOpen a:active {
    background: #f1f5f9;
  }

  .navMenu.navMenuOpen .navButton {
    margin-top: 6px;
    text-align: center;
    justify-content: center;
  }

  .hero {
    display: flex;
    flex-direction: column;
    padding: 46px 24px 56px;
    gap: 34px;
  }

  .heroText h1 {
    font-size: 32px;
    line-height: 1.2;
  }

  .heroText p {
    font-size: 17px;
  }

  .heroActions {
    flex-direction: column;
  }

  .primaryButton,
  .secondaryButton {
    width: 100%;
    text-align: center;
  }

  .statBar {
    gap: 22px;
  }

  .phoneFan {
    height: 280px;
  }

  .section,
  .sectionDark,
  .cta {
    padding: 56px 24px;
  }

  .section h2,
  .sectionDark h2,
  .cta h2 {
    font-size: 28px;
  }

  .beforeAfterGrid,
  .stepsGrid,
  .simCompareGrid,
  .benefitGrid {
    grid-template-columns: 1fr;
  }

  .compareRow {
    grid-template-columns: 1fr;
    gap: 4px;
    text-align: left;
  }

  .compareHead {
    display: none;
  }

  .compareLabel {
    color: #94a3b8 !important;
    font-size: 11.5px !important;
    text-transform: uppercase;
    letter-spacing: .5px;
  }

  .compareRow span:nth-child(2)::before {
    content: "Reseller: ";
    font-weight: 700;
    color: #0f172a;
  }

  .compareRow span:nth-child(3)::before {
    content: "Reseller Brand: ";
    font-weight: 700;
  }

  .priceHighlight {
    padding: 40px 26px;
  }

  .priceHighlight h2 {
    font-size: 34px;
  }
}
`;
