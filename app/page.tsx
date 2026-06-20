import Link from "next/link";

const WA_NUMBER = "6281371338032";

export default function HomePage() {
  const resellerText = encodeURIComponent(
    "Halo Vistiq Invitation, saya ingin daftar reseller undangan digital"
  );

  const orderText = encodeURIComponent(
    "Halo Vistiq Invitation, saya ingin order undangan digital"
  );

  return (
    <main className="page">
      <style>{css}</style>

      <nav className="navbar">
        <Link href="/" className="brand">
          <div>
            <p>VISTIQ</p>
            <h1>Invitation</h1>
          </div>
        </Link>

        <div className="navMenu">
          <a href="/">Home</a>
          <a href="#fitur">Fitur</a>
          <a href="#tema">Tema</a>
          <a href="#harga">Harga</a>
          <a href="#reseller">Reseller</a>
          <Link href="/admin-login">Login</Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${resellerText}`}
            target="_blank"
            className="navButton"
          >
            Daftar Reseller
          </a>
        </div>
      </nav>

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

            <a
              href={`https://wa.me/${WA_NUMBER}?text=${orderText}`}
              target="_blank"
              className="secondaryButton"
            >
              Order Sekarang
            </a>
          </div>
        </div>

        <div className="heroCard">
          <div className="mockup">
            <p>The Wedding Of</p>
            <h3>Rizky & Nabila</h3>
            <span>20 September 2026</span>
            <div className="mockupImage" />
            <button>Buka Undangan</button>
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

        <div className="themeGrid">
          {[
            ["Luxury Gold", "Elegan, hitam emas, premium wedding."],
            ["Royal Black", "Mewah, dark, cinematic, eksklusif."],
            ["Luxury White", "Clean, modern, soft, dan elegan."],
            ["Floral Garden", "Romantis, floral, fresh, dan manis."],
          ].map((item) => (
            <div className="themeCard" key={item[0]}>
              <div className="themePreview" />
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="harga" className="section">
        <p className="label">Paket Harga</p>
        <h2>Pilih Paket Sesuai Kebutuhan</h2>

        <div className="priceGrid">
          <div className="priceCard">
            <h3>Basic</h3>
            <strong>Rp 99.000</strong>
            <p>Untuk undangan sederhana dengan fitur utama.</p>
          </div>

          <div className="priceCard featured">
            <small>Paling Populer</small>
            <h3>Premium</h3>
            <strong>Rp 199.000</strong>
            <p>Untuk undangan profesional dengan fitur lengkap.</p>
          </div>

          <div className="priceCard">
            <h3>Reseller</h3>
            <strong>Rp 250.000</strong>
            <p>Untuk jualan ulang dengan dashboard dan brand sendiri.</p>
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

        <a
          href={`https://wa.me/${WA_NUMBER}?text=${resellerText}`}
          target="_blank"
          className="whiteButton"
        >
          Daftar Reseller
        </a>
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

          <Link href="/admin-login" className="secondaryButton">
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
  max-width: 1180px;
  margin: 0 auto;
  padding: 22px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.secondaryButton {
  background: white;
  color: #1167b2;
  border: 1px solid #dbeafe;
}

.heroCard {
  display: grid;
  place-items: center;
}

.mockup {
  width: 310px;
  min-height: 560px;
  border-radius: 38px;
  background: linear-gradient(180deg, #050505, #171717);
  color: white;
  padding: 28px;
  box-shadow: 0 30px 80px rgba(15,23,42,.25);
  text-align: center;
  border: 1px solid rgba(212,175,55,.35);
}

.mockup p {
  color: #d4af37;
  letter-spacing: 3px;
  font-size: 12px;
  margin-top: 20px;
}

.mockup h3 {
  font-size: 28px;
  margin-bottom: 8px;
}

.mockup span {
  color: white;
}

.mockupImage {
  height: 240px;
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(212,175,55,.2), rgba(255,255,255,.06));
  margin: 30px 0;
  border: 1px solid rgba(212,175,55,.25);
}

.mockup button {
  border: none;
  background: linear-gradient(135deg, #a77a16, #f7df84, #c99a24);
  color: #111;
  padding: 13px 22px;
  border-radius: 999px;
  font-weight: 900;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.themeCard {
  background: rgba(255,255,255,.08);
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.12);
}

.themePreview {
  height: 170px;
  border-radius: 18px;
  background: linear-gradient(135deg, #050505, #d4af37);
  margin-bottom: 16px;
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
    padding: 18px 24px;
    display: block;
  }

  .brand {
    display: block;
    margin-bottom: 14px;
  }

  .brand h1 {
    font-size: 24px;
  }

  .navMenu {
    overflow-x: auto;
    gap: 18px;
    padding-bottom: 8px;
  }

  .navMenu a {
    font-size: 14px;
    flex-shrink: 0;
  }

  .navButton {
    padding: 10px 16px;
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

  .primaryButton,
  .secondaryButton {
    width: 100%;
    text-align: center;
  }

  .mockup {
    width: 260px;
    min-height: 470px;
  }

  .mockupImage {
    height: 190px;
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
  .priceGrid,
  .themeGrid {
    grid-template-columns: 1fr;
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