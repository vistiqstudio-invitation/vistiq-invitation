import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import PhoneMockup from "@/components/PhoneMockup";
import SiteNavbar from "@/components/SiteNavbar";
import ThemeBrowser from "@/components/ThemeBrowser";

const HERO_FAN = [
  { key: "jawa-merah", rotate: -18, x: -108, y: 20, scale: 0.82, z: 1 },
  { key: "santorini", rotate: -9, x: -58, y: 4, scale: 0.9, z: 2 },
  { key: "golden-romance", rotate: 0, x: 0, y: -10, scale: 1, z: 3 },
  { key: "menara-cahaya", rotate: 9, x: 58, y: 4, scale: 0.9, z: 2 },
  { key: "art-deco-glam", rotate: 18, x: 108, y: 20, scale: 0.82, z: 1 },
];

const BENEFITS = [
  ["Brand & logo sendiri", "Tampilkan identitas usaha Anda, bukan brand Vistiq, pada pengalaman client."],
  ["White label penuh", "Gunakan nama brand, warna, logo, serta halaman katalog milik bisnis Anda."],
  ["Keuntungan 100%", "Anda bebas menentukan harga ke client dan hasil penjualan menjadi milik Anda."],
  ["Subdomain gratis", "Gunakan subdomain brand sendiri untuk memperkuat identitas bisnis."],
  ["Custom domain", "Hubungkan domain sendiri untuk tampilan usaha yang lebih profesional."],
  ["Update tema & konten", "Dapatkan pembaruan tema serta materi promosi untuk membantu penjualan."],
];

const FAQS = [
  ["Berapa harga Reseller Brand?", "Rp59.000 per bulan untuk fitur white label dan benefit premium Reseller Brand."],
  ["Apa bedanya dengan Reseller biasa?", "Reseller biasa memakai brand Vistiq dan dikenakan fee platform 20% per transaksi client. Reseller Brand memakai brand sendiri dan menyimpan 100% harga jualnya."],
  ["Apakah saya bisa memakai domain sendiri?", "Ya. Reseller Brand mendukung subdomain gratis dan custom domain sesuai pengaturan akun."],
  ["Apakah saya bebas menentukan harga jual?", "Ya. Reseller Brand dapat menentukan harga jual sendiri ke client."],
];

export default function GabungResellerBrandPage() {
  const midtransProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  return (
    <main className="page">
      <style>{css}</style>
      <SiteNavbar />

      <section className="hero">
        <div>
          <p className="badge">Reseller Brand · White Label</p>
          <h1>Bangun Bisnis Undangan Digital dengan Brand Sendiri</h1>
          <p className="lead">
            Gunakan nama, logo, warna, subdomain atau custom domain sendiri.
            Tentukan harga jual sendiri dan nikmati keuntungan 100% dari penjualan client.
          </p>
          <div className="price"><strong>Rp59.000</strong><span>/bulan</span></div>
          <div className="actions">
            <CheckoutButton packageId="reseller-brand" label="Join Reseller Brand" featured production={midtransProduction} />
            <Link href="/demo" className="secondary">Lihat Demo Tema</Link>
          </div>
          <div className="facts">
            <div><strong>100%</strong><span>Keuntungan milik Anda</span></div>
            <div><strong>White Label</strong><span>Brand sendiri</span></div>
            <div><strong>Domain</strong><span>Subdomain/custom domain</span></div>
          </div>
        </div>
        <div className="visual">
          <div className="phoneFan">
            {HERO_FAN.map((item) => (
              <PhoneMockup key={item.key} themeKey={item.key} width={128} className="phone" style={{ transform: `translate(calc(-50% + ${item.x}px), calc(-50% + ${item.y}px)) rotate(${item.rotate}deg) scale(${item.scale})`, zIndex: item.z }} />
            ))}
          </div>
        </div>
      </section>

      <section className="section center">
        <p className="label">Punya Usaha Sendiri</p>
        <h2>Client Melihat Brand Anda, Bukan Vistiq</h2>
        <p className="intro">Cocok untuk Anda yang ingin membangun bisnis undangan digital profesional dengan identitas sendiri tanpa membuat platform dari nol.</p>
      </section>

      <section className="dark">
        <div className="section">
          <p className="label light">Benefit Reseller Brand</p>
          <h2>Semua yang Dibutuhkan untuk Bangun Brand</h2>
          <div className="benefits">
            {BENEFITS.map(([title, desc]) => <article key={title}><span>✓</span><div><h3>{title}</h3><p>{desc}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="dark themes">
        <div className="section">
          <p className="label light">Katalog Tema</p>
          <h2>Tema Premium Siap Dijual dengan Brand Anda</h2>
          <ThemeBrowser priceWasLabel="Rp 149.000" discountLabel="34%" />
        </div>
      </section>

      <section className="section">
        <div className="compare">
          <div><p className="label">Belum Butuh White Label?</p><h2>Pilih Reseller Biasa</h2><p>Join Rp59.000 sekali bayar, jual undangan tanpa batas, dengan fee platform 20% setiap transaksi client.</p></div>
          <Link href="/gabung-reseller" className="primaryLink">Lihat Paket Reseller</Link>
        </div>
      </section>

      <section className="section">
        <p className="label">FAQ</p><h2>Pertanyaan Umum</h2>
        <div className="faq">{FAQS.map(([q,a]) => <article key={q}><h3>{q}</h3><p>{a}</p></article>)}</div>
      </section>

      <section className="cta">
        <h2>Siap Punya Brand Undangan Digital Sendiri?</h2>
        <p>Aktifkan Reseller Brand Rp59.000/bulan dan mulai jualan dengan identitas bisnis Anda.</p>
        <div className="actions centered"><CheckoutButton packageId="reseller-brand" label="Join Reseller Brand" featured production={midtransProduction} /></div>
      </section>

      <footer>© 2026 Vistiq Invitation. All rights reserved.</footer>
    </main>
  );
}

const css = `
*{box-sizing:border-box}html,body{margin:0;padding:0;overflow-x:hidden}.page{min-height:100vh;background:#f6f8fb;color:#0f172a;font-family:Arial,Helvetica,sans-serif}.hero{max-width:1180px;margin:auto;padding:64px 24px 88px;display:grid;grid-template-columns:1.08fr .92fr;gap:42px;align-items:center;background:radial-gradient(circle at 85% 15%,rgba(17,103,178,.1),transparent 52%)}.badge{display:inline-block;background:#dbeafe;color:#0f4e8a;padding:10px 16px;border-radius:999px;font-weight:900;font-size:13px}.hero h1{font-size:52px;line-height:1.08;color:#0f4e8a;margin:22px 0 18px}.lead,.intro{font-size:18px;line-height:1.8;color:#475569}.price{display:flex;align-items:baseline;gap:7px;margin:25px 0 10px}.price strong{font-size:42px;color:#0f4e8a}.price span{font-weight:800;color:#64748b}.actions{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:20px}.centered{justify-content:center}.secondary,.primaryLink{display:inline-flex;align-items:center;justify-content:center;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:900}.secondary{background:#fff;color:#1167b2;border:1px solid #dbeafe}.primaryLink{background:#1167b2;color:#fff}.facts{display:flex;gap:28px;flex-wrap:wrap;margin-top:30px}.facts div{display:flex;flex-direction:column}.facts strong{font-size:22px;color:#0f4e8a}.facts span{font-size:13px;color:#64748b;font-weight:700}.visual{display:grid;place-items:center}.phoneFan{position:relative;width:340px;max-width:100%;height:320px}.phone{position:absolute;top:50%;left:50%}.section{max-width:1180px;margin:auto;padding:78px 24px}.center{text-align:center}.center .intro{max-width:760px;margin:auto}.label{color:#1167b2;font-weight:900;letter-spacing:1.8px;text-transform:uppercase;font-size:13px}.label.light{color:#93c5fd}.section h2,.dark h2,.cta h2{font-size:40px;line-height:1.15;margin:10px 0 24px}.dark{background:#0f172a;color:#fff}.benefits{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.benefits article{display:flex;gap:14px;padding:22px;border-radius:20px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1)}.benefits article>span{width:34px;height:34px;display:grid;place-items:center;background:#1167b2;border-radius:999px;font-weight:900;flex:none}.benefits h3{margin:0 0 7px}.benefits p{margin:0;color:rgba(255,255,255,.7);line-height:1.65}.compare{background:#fff;border-radius:28px;padding:34px;box-shadow:0 18px 50px rgba(15,23,42,.08);display:flex;align-items:center;justify-content:space-between;gap:30px}.compare h2{margin-bottom:10px}.compare p:not(.label){color:#64748b;line-height:1.7}.faq{display:grid;grid-template-columns:repeat(2,1fr);gap:15px}.faq article{background:#fff;padding:24px;border-radius:20px;box-shadow:0 10px 28px rgba(15,23,42,.05)}.faq h3{margin:0 0 9px}.faq p{margin:0;color:#64748b;line-height:1.7}.cta{text-align:center;padding:78px 24px;background:linear-gradient(135deg,#0f4e8a,#1167b2);color:#fff}.cta p{color:rgba(255,255,255,.82);font-size:17px}footer{text-align:center;padding:28px;color:#64748b;font-size:13px}@media(max-width:900px){.hero{grid-template-columns:1fr;text-align:center}.hero h1{font-size:42px}.lead{margin:auto}.actions,.facts{justify-content:center}.compare{flex-direction:column;text-align:center}.faq{grid-template-columns:1fr}}@media(max-width:640px){.hero{padding:42px 18px 65px}.hero h1{font-size:36px}.section{padding:60px 18px}.section h2,.dark h2,.cta h2{font-size:31px}.benefits{grid-template-columns:1fr}.phoneFan{transform:scale(.87);height:285px}}
`;
