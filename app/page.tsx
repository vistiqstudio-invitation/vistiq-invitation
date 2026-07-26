import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeGrid from "@/components/ThemeGrid";
import AqiqahThemeGrid from "@/components/AqiqahThemeGrid";
import KhitanThemeGrid from "@/components/KhitanThemeGrid";
import CheckoutButton from "@/components/CheckoutButton";

const HERO_FAN = [
  { key: "royal-imperial", rotate: -18, x: -108, y: 20, scale: 0.82, z: 1 },
  { key: "islamic-green", rotate: -9, x: -58, y: 4, scale: 0.9, z: 2 },
  { key: "luxury-gold", rotate: 0, x: 0, y: -10, scale: 1, z: 3 },
  { key: "sakura", rotate: 9, x: 58, y: 4, scale: 0.9, z: 2 },
  { key: "modern-elegant", rotate: 18, x: 108, y: 20, scale: 0.82, z: 1 },
];

export default function HomePage() {
  const midtransProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  return (
    <main className="page">
      <style>{css}</style>

      <SiteNavbar />

      <section className="hero">
        <div className="heroText">
          <p className="badge">Platform Undangan Digital Modern</p>

          <h2>Buat Bisnis Undangan Digital Siap Jual</h2>

          <p>
            Vistiq Invitation membantu owner, reseller, dan freelancer membuat
            layanan undangan digital premium dengan brand sendiri.
          </p>

          <div className="heroActions">
            <Link href="/demo" className="primaryButton">
              Lihat Demo
            </Link>

            <CheckoutButton packageId="client" label="Order Sekarang" production={midtransProduction} />

            <Link href="/gabung-affiliate" className="affiliateButton">
              Gabung Affiliate
            </Link>
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

      <section id="fitur" className="section">
        <p className="label">Fitur Utama</p>
        <h2>Semua Kebutuhan Undangan Digital</h2>

        <div className="grid">
          {[
            ["Dashboard Owner", "Pantau client, reseller, undangan, RSVP, dan transaksi."],
            ["Panel Reseller", "Reseller bisa login, tambah client, dan pantau penjualan."],
            ["Panel Client", "Client bisa edit data undangan dan upload foto sendiri."],
            ["RSVP Online", "Data kehadiran dan ucapan masuk otomatis ke dashboard."],
            ["Upload Galeri", "Upload foto cover, mempelai, dan galeri."],
            ["Amplop Digital", "Tampilkan rekening dan tombol salin nomor rekening."],
          ].map((item) => (
            <div className="card" key={item[0]}>
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tema" className="sectionDark">
        <p className="label">Pilihan Tema</p>
        <h2>Tema Premium Siap Pakai</h2>

        <ThemeGrid />
      </section>

      <section id="tema-akikah" className="sectionDark">
        <p className="label">Tema Akikah</p>
        <h2>Undangan Aqiqah Digital</h2>

        <AqiqahThemeGrid />
      </section>

      <section id="tema-khitan" className="sectionDark">
        <p className="label">Tema Khitan</p>
        <h2>Undangan Khitan Digital</h2>

        <KhitanThemeGrid />
      </section>

      <section id="harga" className="section">
        <p className="label">Paket Harga</p>
        <h2>Pilih Paket Sesuai Kebutuhan</h2>

        <div className="priceGrid">
          <div className="priceCard">
            <h3>Client</h3>
            <strong>Rp 149.000</strong>
            <p>
              Untuk yang cuma butuh 1 undangan pernikahan sendiri, lengkap
              dengan RSVP, galeri, dan amplop digital. Bukan reseller.
            </p>
            <CheckoutButton packageId="client" production={midtransProduction} />
            <span className="paymentMethods">QRIS · Virtual Account · E-Wallet</span>
          </div>

          <div className="priceCard featured">
            <small>Paling Populer</small>
            <h3>Reseller</h3>
            <strong>Rp 149.000<span>/sekali bayar</span></strong>
            <p>
              Jual undangan digital dengan brand Vistiq Invitation, dapat
              dashboard reseller dan komisi <strong style={{ color: "white" }}>30%</strong> dari
              setiap penjualan client Anda. Bayar sekali, aktif selamanya.
            </p>
            <CheckoutButton packageId="reseller" label="Bayar & Daftar Reseller" featured production={midtransProduction} />
            <span className="paymentMethods light">QRIS · Virtual Account · E-Wallet</span>
          </div>

          <div className="priceCard">
            <small className="promoBadge">Layaknya Member Premium</small>
            <h3>Reseller Brand</h3>
            <strong>Rp 99.000<span>/bulan</span></strong>
            <p>
              Semua fitur Reseller, plus ganti nama & logo jadi brand Anda
              sendiri (white label) di setiap undangan client, keuntungan{" "}
              <strong>100%</strong> jadi milik Anda, update tema baru setiap
              bulan, konten promosi siap pakai, dan benefit member premium
              lainnya.
            </p>
            <CheckoutButton packageId="reseller-brand" label="Bayar Reseller Brand" production={midtransProduction} />
            <span className="paymentMethods">QRIS · Virtual Account · E-Wallet</span>
          </div>
        </div>
      </section>

      <section id="reseller" className="reseller">
        <div>
          <p className="label white">Program Reseller</p>
          <h2>Jualan Undangan Digital Dengan Brand Sendiri</h2>
          <p>
            Reseller mendapatkan sistem login, dashboard, dan bisa mengelola
            client sendiri tanpa perlu membuat website dari nol.
          </p>
        </div>

        <Link href="/gabung-reseller#harga" className="whiteButton">
          Daftar Reseller
        </Link>
      </section>

      <section className="section">
        <p className="label">Program Affiliate</p>
        <h2>Promosikan Vistiq, Dapatkan Komisi 30%</h2>
        <p style={{ maxWidth: 680, margin: "0 auto 24px", textAlign: "center", color: "#64748b", lineHeight: 1.8 }}>
          Gratis bergabung. Komisi berlaku untuk paket Client, Reseller, dan Reseller Brand.
        </p>
        <div style={{ textAlign: "center" }}>
          <Link href="/gabung-affiliate" className="primaryButton">Gabung Affiliate</Link>
        </div>
      </section>

      <section className="cta">
        <h2>Siap Membuat Undangan Digital Premium?</h2>
        <p>
          Mulai dari undangan personal hingga sistem reseller, semuanya bisa
          dikelola dalam satu platform.
        </p>

        <div className="heroActions center">
          <Link href="/demo" className="primaryButton">
            Lihat Demo
          </Link>

          <Link href="/login" className="secondaryButton">
            Login Dashboard
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
  padding: 70px 24px 90px;
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 40px;
  align-items: center;
}

.badge {
  display: inline-block;
  background: #dbeafe;
  color: #1167b2;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 800;
}

.heroText h2 {
  font-size: 58px;
  line-height: 1.05;
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

.secondaryButton,
.affiliateButton {
  background: white;
  color: #1167b2;
  border: 1px solid #dbeafe;
}

.affiliateButton {
  padding: 14px 24px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 800;
  display: inline-block;
}

.heroActions .priceButton {
  padding: 14px 24px;
  border-radius: 999px;
  font-weight: 800;
  display: inline-block;
  background: white;
  color: #1167b2;
  border: 1px solid #dbeafe;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.heroText .heroActions > .primaryButton,
.heroText .heroActions > .affiliateButton,
.heroText .heroActions > .priceButton {
  width: 185px;
  min-height: 54px;
  margin-top: 0;
  padding: 14px 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 185px;
  font-size: 16px;
  line-height: 1.2;
  text-align: center;
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
  font-size: 42px;
  margin: 10px 0 34px;
}

.grid,
.priceGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.card,
.priceCard {
  background: white;
  padding: 28px;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(0,0,0,.05);
}

.card p,
.priceCard p,
.cta p,
.reseller p {
  color: #64748b;
  line-height: 1.7;
}

.sectionDark {
  background: #0f172a;
  color: white;
  padding: 80px 24px;
}

.sectionDark > p,
.sectionDark > h2,
.themeGrid {
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
}

.themeGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 18px;
}

.themeCard {
  background: rgba(255,255,255,.08);
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.12);
  text-decoration: none;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: border-color 0.25s ease, transform 0.25s ease;
}

.themeCard:hover {
  border-color: rgba(212,175,55,.5);
  transform: translateY(-4px);
}

.themeCard h3 {
  font-size: 18px;
  margin: 16px 0 6px;
}

.themeCard p {
  color: rgba(255,255,255,.65);
  font-size: 13.5px;
  line-height: 1.6;
  margin: 0;
}

.themePreview {
  margin: 0 auto;
}

.featured {
  background: #1167b2;
  color: white;
  transform: translateY(-12px);
}

.featured p {
  color: rgba(255,255,255,.85);
}

.featured small {
  background: rgba(255,255,255,.18);
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 800;
}

.priceCard strong {
  display: block;
  font-size: 30px;
  color: #1167b2;
  margin: 12px 0;
}

.featured strong {
  color: white;
}

.priceCard strong span {
  display: inline;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.featured strong span {
  color: rgba(255,255,255,.75);
}

.priceCard {
  display: flex;
  flex-direction: column;
}

.priceCard p {
  flex: 1;
}

.promoBadge {
  display: inline-block;
  align-self: flex-start;
  background: #fdf3d9;
  color: #92700f;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
  margin-bottom: 10px;
}

.oldPrice {
  color: #94a3b8;
  text-decoration: line-through;
  font-size: 15px;
  font-weight: 600;
  margin-top: 10px;
}

.promoCountdown {
  margin: 10px 0 0;
  padding: 8px 12px;
  border-radius: 10px;
  background: #fef2f2;
  color: #c2413b;
  font-size: 12.5px;
  font-weight: 700;
  text-align: center;
}

.promoCountdown strong {
  font-variant-numeric: tabular-nums;
  color: #c2413b;
}

.priceButton {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-top: 18px;
  padding: 12px 20px;
  border: 0;
  border-radius: 999px;
  background: #eff6ff;
  color: #1167b2;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
}

.paymentMethods {
  display: block;
  margin-top: 9px;
  color: #7890a8;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .07em;
  text-align: center;
}

.paymentMethods.light {
  color: rgba(255,255,255,.72);
}

.featuredButton {
  background: white;
  color: #1167b2;
}

.reseller {
  background: #1167b2;
  color: white;
  padding: 70px 24px;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: center;
}

.reseller > div {
  max-width: 900px;
}

.reseller h2 {
  font-size: 42px;
}

.white {
  color: white;
}

.whiteButton {
  background: white;
  color: #1167b2;
  padding: 15px 24px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 900;
  white-space: nowrap;
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

  .heroText h2 {
    font-size: 42px;
    line-height: 1.1;
  }

  .heroText p {
    font-size: 17px;
  }

  .heroActions {
    flex-direction: column;
  }

  .heroText .heroActions > .primaryButton,
  .heroText .heroActions > .affiliateButton,
  .heroText .heroActions > .priceButton {
    width: 100%;
    max-width: none;
    flex-basis: auto;
    text-align: center;
  }

  .primaryButton,
  .secondaryButton,
  .affiliateButton {
    width: 100%;
    text-align: center;
  }

  .phoneFan {
    height: 280px;
  }

  .section,
  .sectionDark,
  .cta {
    padding: 64px 24px;
  }

  .section h2,
  .sectionDark h2,
  .reseller h2,
  .cta h2 {
    font-size: 34px;
  }

  .grid,
  .priceGrid {
    grid-template-columns: 1fr;
  }

  .themeGrid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .themeCard {
    padding: 8px 4px 10px;
    border-radius: 12px;
  }

  .themeCard h3 {
    font-size: 10.5px;
    line-height: 1.25;
    margin: 8px 0 0;
  }

  .themeCard p {
    display: none;
  }

  .featured {
    transform: none;
  }

  .reseller {
    display: block;
    padding: 64px 24px;
  }

  .whiteButton {
    display: inline-block;
    margin-top: 24px;
  }
}
`;
