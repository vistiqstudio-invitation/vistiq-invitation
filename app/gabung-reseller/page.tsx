import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeGrid from "@/components/ThemeGrid";
import PromoCountdown from "@/components/PromoCountdown";
import CheckoutButton from "@/components/CheckoutButton";

const HERO_FAN = [
  { key: "jawa-merah", rotate: -18, x: -108, y: 20, scale: 0.82, z: 1 },
  { key: "santorini", rotate: -9, x: -58, y: 4, scale: 0.9, z: 2 },
  { key: "golden-romance", rotate: 0, x: 0, y: -10, scale: 1, z: 3 },
  { key: "menara-cahaya", rotate: 9, x: 58, y: 4, scale: 0.9, z: 2 },
  { key: "art-deco-glam", rotate: 18, x: 108, y: 20, scale: 0.82, z: 1 },
];

const STEPS = [
  {
    n: "1",
    title: "Pilih Tema",
    desc: "Buka dashboard reseller, pilih dari 22+ tema premium siap pakai sesuai selera client.",
  },
  {
    n: "2",
    title: "Edit Teks & Foto",
    desc: "Ganti nama pasangan, tanggal acara, dan foto lewat form — tanpa desain, tanpa coding.",
  },
  {
    n: "3",
    title: "Kirim Link, Terima Bayaran",
    desc: "Bagikan link undangan ke client, client bayar, komisi kamu tercatat otomatis.",
  },
];

const BENEFITS = [
  ["Akses dashboard reseller selamanya", "Sekali daftar, tidak ada biaya bulanan untuk paket Reseller."],
  ["Bikin undangan tanpa batas jumlah", "Jual ke sebanyak mungkin client, tidak ada limit."],
  ["22+ tema premium siap pakai", "Terus bertambah, dari adat Nusantara sampai gaya internasional."],
  ["Link katalog demo yang bisa dibagikan", "Kirim langsung ke calon client sebagai etalase jualan kamu."],
  ["Komisi 30% tercatat otomatis", "Real-time di dashboard \"Komisi Saya\", lengkap status pembayarannya."],
  ["Panel client mandiri", "Client bisa edit data & upload foto sendiri, kamu tidak perlu bolak-balik revisi."],
  ["RSVP online otomatis", "Data kehadiran dan ucapan tamu masuk langsung ke dashboard."],
  ["Support teknis langsung dari tim Vistiq", "Ada kendala tinggal chat, dibantu sampai selesai."],
];

const SIMULATIONS = [
  { price: 150000, label: "Harga hemat" },
  { price: 200000, label: "Harga umum" },
  { price: 300000, label: "Harga premium" },
];

const FAQS = [
  {
    q: "Saya pemula, belum pernah jualan online. Bisa?",
    a: "Bisa. Dashboard-nya dirancang simpel — tinggal pilih tema, isi data lewat form, tanpa perlu bisa desain atau coding sama sekali.",
  },
  {
    q: "Berapa modal awal yang dibutuhkan?",
    a: "Rp149.000 sekali bayar untuk paket Reseller. Setelah aktif, kamu bisa langsung mulai jualan tanpa batas jumlah client.",
  },
  {
    q: "Bagaimana cara terima komisi?",
    a: "Setiap client yang kamu tambahkan tercatat otomatis di halaman \"Komisi Saya\" di dashboard, lengkap dengan status sudah dibayar atau belum.",
  },
  {
    q: "Apakah ada biaya bulanan?",
    a: "Tidak. Baik paket Reseller maupun Reseller Brand sekali bayar dan aktif selamanya — tidak ada tagihan bulanan sama sekali.",
  },
  {
    q: "Kalau saya bingung pas mulai jualan, ada yang bantu?",
    a: "Ada. Tim Vistiq siap dibantu langsung lewat WhatsApp, dari cara pakai dashboard sampai tips memasarkan ke calon client.",
  },
];

export default function GabungResellerPage() {
  const midtransProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  return (
    <main className="page">
      <style>{css}</style>

      <SiteNavbar />

      <section className="hero">
        <div className="heroText">
          <p className="badge">Peluang Bisnis Digital</p>

          <h1>
            Hasilkan Cuan dari Bisnis Undangan Digital, Modal Kecil dari HP Sendiri
          </h1>

          <p>
            Jadi reseller Vistiq Invitation. Jual undangan pernikahan digital
            premium tanpa perlu bisa desain atau ngoding — tinggal pilih tema,
            edit lewat dashboard, kirim link ke client.
          </p>

          <div className="heroActions">
            <CheckoutButton
              packageId="reseller"
              label="Daftar Jadi Reseller"
              production={midtransProduction}
            />

            <Link href="/demo" className="secondaryButton">
              Lihat Demo Tema
            </Link>
          </div>

          <div className="statBar">
            <div>
              <strong>22+</strong>
              <span>Tema Premium</span>
            </div>
            <div>
              <strong>30%</strong>
              <span>Komisi Otomatis</span>
            </div>
            <div>
              <strong>1x</strong>
              <span>Bayar, Aktif Selamanya</span>
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

      <section className="section">
        <p className="label">Kenapa Undangan Digital</p>
        <h2>Semua Orang Nikah, Semua Butuh Undangan</h2>
        <p className="sectionIntro">
          Undangan digital makin diminati karena lebih murah dan praktis
          dibanding cetak — tapi sebagian besar calon pengantin belum tahu ke
          mana harus pesan. Di situlah peluangnya: kamu jadi jembatan antara
          produk siap pakai dan orang yang butuh.
        </p>

        <p className="revealTitle">Rahasianya: kamu nggak perlu jadi desainer.</p>

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

      <section id="tema" className="sectionDark">
        <p className="label">Katalog Produk</p>
        <h2>Semua Tema Ini Siap Kamu Jual</h2>

        <ThemeGrid />

        <p className="darkNote">
          Katalog demo ini bisa langsung kamu bagikan ke calon client sebagai
          etalase jualan kamu sendiri.
        </p>
      </section>

      <section className="section">
        <p className="label">Yang Kamu Dapatkan</p>
        <h2>Sekali Daftar, Ini Semua Milikmu</h2>

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

      <section className="sectionDark">
        <p className="label">Simulasi Penghasilan</p>
        <h2>Hitung-Hitungan Simpel Komisi Reseller</h2>
        <p className="darkIntro">
          Kamu yang tentukan harga jual ke client sendiri. Dari harga itu,
          30% otomatis jadi komisi kamu.
        </p>

        <div className="simGrid">
          {SIMULATIONS.map((sim) => (
            <div className="simCard" key={sim.price}>
              <small>{sim.label}</small>
              <p className="simPrice">Rp {sim.price.toLocaleString("id-ID")}</p>
              <p className="simArrow">Komisi 30% per undangan</p>
              <strong>Rp {(sim.price * 0.3).toLocaleString("id-ID")}</strong>
            </div>
          ))}
        </div>

        <div className="simTotal">
          <p>
            Contoh: jual ke <strong>10 client</strong> dalam sebulan di harga
            Rp200.000 =
          </p>
          <strong>Rp 600.000</strong>
          <p className="simDisclaimer">
            *Simulasi ilustratif berdasarkan komisi 30%, hasil nyata
            tergantung usaha pemasaran masing-masing reseller.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="upgradeBox">
          <div>
            <p className="label">Sudah Jalan?</p>
            <h2>Upgrade ke Reseller Brand</h2>
            <p>
              Pakai nama & logo sendiri di setiap undangan client (white
              label), dan profit <strong>100%</strong> jadi milikmu — bukan
              lagi bagi hasil 30%. Normal Rp299.000, promo launching{" "}
              <strong>Rp149.000</strong> untuk 10 orang pertama, sekali
              bayar, aktif selamanya.
            </p>
          </div>
          <div>
            <CheckoutButton
              packageId="reseller-brand"
              label="Daftar Reseller Brand"
              featured
              production={midtransProduction}
            />
            <PromoCountdown className="promoCountdown" />
          </div>
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

      <section id="harga" className="section">
        <p className="label">Paket Harga</p>
        <h2>Pilih Paket Sesuai Kebutuhanmu</h2>

        <div className="priceGrid">
          <div className="priceCard">
            <h3>Client</h3>
            <strong>Rp 149.000</strong>
            <p>
              Untuk yang cuma butuh 1 undangan pernikahan sendiri, lengkap
              dengan RSVP, galeri, dan amplop digital. Bukan reseller.
            </p>
            <CheckoutButton packageId="client" label="Order Sekarang" production={midtransProduction} />
          </div>

          <div className="priceCard featured">
            <small>Paling Populer</small>
            <h3>Reseller</h3>
            <strong>
              Rp 149.000<span>/sekali bayar</span>
            </strong>
            <p>
              Jual undangan digital dengan brand Vistiq Invitation, dapat
              dashboard reseller dan komisi{" "}
              <strong style={{ color: "white" }}>30%</strong> dari setiap
              penjualan client Anda. Bayar sekali, aktif selamanya.
            </p>
            <CheckoutButton
              packageId="reseller"
              label="Daftar Reseller"
              featured
              production={midtransProduction}
            />
          </div>

          <div className="priceCard">
            <small className="promoBadge">Promo Launching · 10 Orang Pertama</small>
            <h3>Reseller Brand</h3>
            <span className="oldPrice">Rp 299.000</span>
            <strong>
              Rp 149.000<span>/sekali bayar</span>
            </strong>
            <p>
              Semua fitur Reseller, plus ganti nama & logo jadi brand Anda
              sendiri (white label) di setiap undangan client — dan
              keuntungan <strong>100%</strong> jadi milik Anda. Bayar sekali,
              aktif selamanya.
            </p>
            <CheckoutButton packageId="reseller-brand" label="Daftar Reseller Brand" production={midtransProduction} />
            <PromoCountdown className="promoCountdown" />
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Siap Mulai Bisnis Undangan Digital Kamu?</h2>
        <p>
          Daftar sekali, akses dashboard reseller selamanya selama Vistiq
          Invitation berjalan.
        </p>

        <div className="heroActions center">
          <CheckoutButton
            packageId="reseller"
            label="Daftar Jadi Reseller Sekarang"
            production={midtransProduction}
          />

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
  background: radial-gradient(circle at 85% 15%, rgba(17,103,178,.08), transparent 55%);
}

.badge {
  display: inline-block;
  background: #dbeafe;
  color: #1167b2;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 800;
}

.heroText h1 {
  font-size: 50px;
  line-height: 1.1;
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
  font-size: 26px;
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
  font-size: 40px;
  margin: 10px 0 24px;
}

.sectionIntro {
  color: #475569;
  font-size: 17px;
  line-height: 1.8;
  max-width: 760px;
  margin: 0 0 40px;
}

.revealTitle {
  font-size: 22px;
  font-weight: 900;
  color: #0f4e8a;
  margin: 0 0 24px;
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

.sectionDark {
  background: #0f172a;
  color: white;
  padding: 80px 24px;
}

.sectionDark > p,
.sectionDark > h2,
.sectionDark > .darkNote,
.sectionDark > .darkIntro,
.sectionDark > .simGrid,
.sectionDark > .simTotal,
.themeGrid {
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
}

.darkIntro {
  color: rgba(255,255,255,.7);
  font-size: 17px;
  line-height: 1.8;
  max-width: 640px;
  margin: 0 0 40px;
}

.darkNote {
  color: rgba(255,255,255,.55);
  font-size: 14px;
  margin-top: 30px;
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

.simGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.simCard {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 22px;
  padding: 26px;
  text-align: center;
}

.simCard small {
  color: rgba(255,255,255,.55);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 11px;
}

.simPrice {
  font-size: 24px;
  font-weight: 900;
  margin: 10px 0 4px;
}

.simArrow {
  color: rgba(255,255,255,.55);
  font-size: 13px;
  margin: 0 0 10px;
}

.simCard strong {
  display: block;
  font-size: 28px;
  color: #7fc4ff;
}

.simTotal {
  margin-top: 30px;
  background: rgba(17,103,178,.25);
  border: 1px solid rgba(127,196,255,.3);
  border-radius: 22px;
  padding: 30px;
  text-align: center;
}

.simTotal p {
  margin: 0 0 8px;
  font-size: 16px;
}

.simTotal strong {
  font-size: 36px;
  color: #7fc4ff;
}

.simDisclaimer {
  margin-top: 14px !important;
  font-size: 12.5px !important;
  color: rgba(255,255,255,.45) !important;
}

.upgradeBox {
  background: linear-gradient(120deg, #0f4e8a, #1167b2);
  color: white;
  border-radius: 28px;
  padding: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.upgradeBox .label {
  color: rgba(255,255,255,.7);
}

.upgradeBox h2 {
  font-size: 30px;
  margin: 8px 0 14px;
}

.upgradeBox p {
  color: rgba(255,255,255,.85);
  line-height: 1.7;
  max-width: 520px;
  margin: 0;
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

.priceGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.priceCard {
  background: white;
  padding: 28px;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(0,0,0,.05);
  display: flex;
  flex-direction: column;
}

.priceCard p {
  color: #64748b;
  line-height: 1.7;
  flex: 1;
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
  margin: 12px 0 0;
  padding: 8px 14px;
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

.upgradeBox .promoCountdown {
  background: rgba(255,255,255,.16);
  color: #fde68a;
  text-align: left;
}

.upgradeBox .promoCountdown strong {
  color: #fde68a;
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
  font-family: inherit;
  cursor: pointer;
}

.featuredButton {
  background: white;
  color: #1167b2;
}

.heroActions .priceButton,
.cta .priceButton {
  margin-top: 0;
  padding: 14px 24px;
  background: #1167b2;
  color: white;
  font-size: 16px;
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
    font-size: 36px;
    line-height: 1.15;
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
    font-size: 30px;
  }

  .stepsGrid,
  .benefitGrid,
  .simGrid,
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

  .upgradeBox {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px 26px;
  }

  .simTotal strong {
    font-size: 28px;
  }
}
`;
