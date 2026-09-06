import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import PhoneMockup from "@/components/PhoneMockup";
import ThemeBrowser from "@/components/ThemeBrowser";
import { getThemeCoverImage } from "@/lib/themeCoverImages";

const HERO_FAN = [
  { key: "jawa-merah", rotate: -18, x: -108, y: 20, scale: 0.82, z: 1 },
  { key: "santorini", rotate: -9, x: -58, y: 4, scale: 0.9, z: 2 },
  { key: "golden-romance", rotate: 0, x: 0, y: -10, scale: 1, z: 3 },
  { key: "menara-cahaya", rotate: 9, x: 58, y: 4, scale: 0.9, z: 2 },
  { key: "art-deco-glam", rotate: 18, x: 108, y: 20, scale: 0.82, z: 1 },
];

const BENEFITS = [
  ["Jual undangan tanpa batas", "Buat dan jual undangan ke sebanyak mungkin client tanpa batas jumlah."],
  ["Akses dashboard selamanya", "Cukup bayar Rp149.000 sekali. Tidak ada biaya join bulanan untuk paket Reseller."],
  ["Fee platform hanya 20%", "Pada setiap transaksi client, 20% menjadi fee platform dan 80% menjadi bagian reseller."],
  ["Tema premium siap jual", "Wedding, aqiqah, khitan, ulang tahun, dan kategori lainnya sudah siap digunakan."],
  ["Client bisa edit sendiri", "Client dapat mengubah data dan mengunggah foto dari dashboard pribadinya."],
  ["Bisa dikerjakan dari HP", "Kelola client dan undangan dari mana saja tanpa perlu coding atau desain dari nol."],
];

const STEPS = [
  ["1", "Join Rp149.000", "Bayar sekali untuk mengaktifkan akun Reseller Vistiq."],
  ["2", "Cari Client", "Tawarkan undangan digital ke calon pengantin atau siapa pun yang punya acara."],
  ["3", "Buat Undangan", "Pilih tema, masukkan data client, lalu bagikan link undangan."],
  ["4", "Jual Tanpa Batas", "Tidak ada batas jumlah client. Setiap transaksi dikenakan fee platform 20%."],
];

const FAQS = [
  ["Berapa biaya join Reseller?", "Rp149.000 sekali bayar dan akun Reseller aktif selamanya."],
  ["Apakah ada batas jumlah undangan?", "Tidak. Reseller dapat menjual dan membuat undangan sebanyak yang dibutuhkan."],
  ["Bagaimana pembagian setiap transaksi?", "80% menjadi bagian reseller dan 20% menjadi fee platform Vistiq pada setiap transaksi client."],
  ["Apakah harus bisa desain atau coding?", "Tidak. Tema dan sistem sudah tersedia; reseller cukup memilih tema dan mengisi data client."],
  ["Apakah Reseller bisa memakai logo sendiri?", "Paket Reseller memakai brand Vistiq. Untuk white label, logo, warna, dan domain sendiri gunakan Reseller Brand."],
];

const WHATSAPP_URL = `https://wa.me/6281371338032?text=${encodeURIComponent(
  "Halo Vistiq Invitation, saya tertarik join Reseller Rp149.000 sekali bayar. Saya ingin daftar melalui WhatsApp. Mohon dibantu proses pendaftarannya.",
)}`;

export default function GabungResellerPage() {
  const midtransProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  return (
    <main className="page">
      <style>{css}</style>

      <section className="hero">
        <div className="heroCopy">
          <p className="badge">Paket Reseller · Sekali Bayar</p>
          <h1>Mulai Usaha Undangan Digital Cuma Rp149.000</h1>
          <p className="lead">
            Tidak perlu bikin website dari nol. Dapatkan dashboard Reseller Vistiq,
            jual undangan digital sebebasnya tanpa batas, dan cukup bayar fee platform
            20% setiap ada transaksi client.
          </p>
          <div className="price"><strong>Rp149.000</strong><span>sekali bayar · akses selamanya</span></div>
          <div className="actions">
            <CheckoutButton packageId="reseller" label="Join Reseller Sekarang" featured production={midtransProduction} />
            <Link href="/demo" className="secondary">Lihat Demo Tema</Link>
          </div>
          <div className="facts">
            <div><strong>Tanpa Batas</strong><span>Jumlah client</span></div>
            <div><strong>20%</strong><span>Fee platform/transaksi</span></div>
            <div><strong>1x Bayar</strong><span>Akses selamanya</span></div>
          </div>
        </div>

        <div className="visual">
          <div className="phoneFan">
            {HERO_FAN.map((item) => (
              <PhoneMockup
                key={item.key}
                themeKey={item.key}
                width={128}
                mode="static"
                coverImage={getThemeCoverImage(item.key, "/demo")}
                className="phone"
                style={{
                  transform: `translate(calc(-50% + ${item.x}px), calc(-50% + ${item.y}px)) rotate(${item.rotate}deg) scale(${item.scale})`,
                  zIndex: item.z,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section center">
        <p className="label">Kenapa Jadi Reseller</p>
        <h2>Sistem Sudah Siap, Kamu Fokus Jualan</h2>
        <p className="intro">
          Cocok untuk pemula yang ingin punya penghasilan dari undangan digital tanpa modal besar,
          tanpa coding, dan tanpa harus membangun platform sendiri.
        </p>
      </section>

      <section className="dark">
        <div className="section">
          <p className="label light">Yang Kamu Dapatkan</p>
          <h2>Paket Reseller Rp149.000</h2>
          <div className="benefits">
            {BENEFITS.map(([title, desc]) => (
              <article className="benefit" key={title}>
                <span>✓</span><div><h3>{title}</h3><p>{desc}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <p className="label">Cara Kerja</p>
        <h2>Mulai dalam 4 Langkah</h2>
        <div className="steps">
          {STEPS.map(([n, title, desc]) => (
            <article className="step" key={n}><span>{n}</span><h3>{title}</h3><p>{desc}</p></article>
          ))}
        </div>
      </section>

      <section className="dark themes">
        <div className="section">
          <p className="label light">Tema Siap Dijual</p>
          <h2>Pilih Tema Sesuai Kebutuhan Client</h2>
          <ThemeBrowser priceWasLabel="Rp 149.000" discountLabel="34%" />
        </div>
      </section>

      <section className="section">
        <div className="brandCallout">
          <div>
            <p className="label">Mau Punya Brand Sendiri?</p>
            <h2>Upgrade ke Reseller Brand</h2>
            <p>Gunakan nama, logo, warna, subdomain atau custom domain sendiri dan nikmati fitur white label.</p>
          </div>
          <Link href="/gabung-resellerbrand" className="primaryLink">Lihat Reseller Brand</Link>
        </div>
      </section>

      <section className="section">
        <p className="label">FAQ</p>
        <h2>Pertanyaan Umum</h2>
        <div className="faq">
          {FAQS.map(([q, a]) => <article key={q}><h3>{q}</h3><p>{a}</p></article>)}
        </div>
      </section>

      <section className="cta">
        <h2>Siap Mulai Jual Undangan Digital?</h2>
        <p>Join Reseller Rp149.000 sekali bayar, jual undangan tanpa batas.</p>
        <div className="actions centered ctaActions">
          <CheckoutButton
            packageId="reseller"
            label="Daftar & Bayar via Midtrans"
            featured
            production={midtransProduction}
          />
          <a
            href={WHATSAPP_URL}
            className="waButton"
            target="_blank"
            rel="noreferrer"
          >
            Daftar via WhatsApp
          </a>
        </div>
        <p className="ctaNote">Pilih daftar otomatis melalui Midtrans atau dibantu langsung melalui WhatsApp.</p>
      </section>

      <footer>© 2026 Vistiq Invitation. All rights reserved.</footer>
    </main>
  );
}

const css = `
*{box-sizing:border-box}html,body{margin:0;padding:0;overflow-x:hidden}.page{min-height:100vh;background:#f6f8fb;color:#0f172a;font-family:Arial,Helvetica,sans-serif}.hero{max-width:1180px;margin:auto;padding:64px 24px 88px;display:grid;grid-template-columns:1.08fr .92fr;gap:42px;align-items:center;background:radial-gradient(circle at 85% 15%,rgba(17,103,178,.09),transparent 52%)}.badge{display:inline-block;margin:0;background:#dbeafe;color:#0f4e8a;padding:10px 16px;border-radius:999px;font-weight:900;font-size:13px}.hero h1{font-size:52px;line-height:1.08;color:#0f4e8a;margin:22px 0 18px}.lead,.intro{font-size:18px;line-height:1.8;color:#475569}.price{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin:25px 0 10px}.price strong{font-size:42px;color:#0f4e8a}.price span{font-size:14px;color:#64748b;font-weight:800}.actions{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:20px}.centered{justify-content:center}.priceButton{appearance:none;border:0;background:#1167b2;color:#fff;padding:14px 24px;border-radius:999px;font-size:15px;font-weight:900;line-height:1.2;cursor:pointer;box-shadow:0 10px 24px rgba(17,103,178,.24);transition:transform .2s ease,box-shadow .2s ease}.priceButton:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(17,103,178,.3)}.secondary,.primaryLink,.waButton{display:inline-flex;align-items:center;justify-content:center;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:900}.secondary{background:#fff;color:#1167b2;border:1px solid #dbeafe}.primaryLink{background:#1167b2;color:#fff}.facts{display:flex;gap:28px;flex-wrap:wrap;margin-top:30px}.facts div{display:flex;flex-direction:column}.facts strong{font-size:24px;color:#0f4e8a}.facts span{font-size:13px;color:#64748b;font-weight:700}.visual{display:grid;place-items:center}.phoneFan{position:relative;width:340px;max-width:100%;height:320px}.phone{position:absolute;top:50%;left:50%}.section{max-width:1180px;margin:auto;padding:78px 24px}.center{text-align:center}.center .intro{max-width:760px;margin:auto}.label{color:#1167b2;font-weight:900;letter-spacing:1.8px;text-transform:uppercase;font-size:13px}.label.light{color:#93c5fd}.section h2,.dark h2,.cta h2{font-size:40px;line-height:1.15;margin:10px 0 24px}.dark{background:#0f172a;color:#fff}.benefits{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.benefit{display:flex;gap:14px;padding:22px;border-radius:20px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1)}.benefit>span{width:34px;height:34px;display:grid;place-items:center;background:#1167b2;border-radius:999px;font-weight:900;flex:none}.benefit h3{margin:0 0 7px}.benefit p{margin:0;color:rgba(255,255,255,.7);line-height:1.65}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.step{background:#fff;padding:24px;border-radius:22px;box-shadow:0 12px 30px rgba(15,23,42,.06)}.step>span{display:grid;place-items:center;width:40px;height:40px;border-radius:999px;background:#1167b2;color:#fff;font-weight:900}.step h3{margin:16px 0 8px}.step p{margin:0;color:#64748b;line-height:1.65}.brandCallout{background:#fff;border-radius:28px;padding:34px;box-shadow:0 18px 50px rgba(15,23,42,.08);display:flex;align-items:center;justify-content:space-between;gap:30px}.brandCallout h2{margin-bottom:10px}.brandCallout p:not(.label){color:#64748b;line-height:1.7}.faq{display:grid;grid-template-columns:repeat(2,1fr);gap:15px}.faq article{background:#fff;padding:24px;border-radius:20px;box-shadow:0 10px 28px rgba(15,23,42,.05)}.faq h3{margin:0 0 9px}.faq p{margin:0;color:#64748b;line-height:1.7}.cta{text-align:center;padding:78px 24px;background:linear-gradient(135deg,#0f4e8a,#1167b2);color:#fff}.cta p{color:rgba(255,255,255,.82);font-size:17px}.cta .priceButton{background:#fff;color:#0f4e8a;box-shadow:0 12px 28px rgba(0,0,0,.16)}.ctaActions{margin-top:26px}.waButton{background:#22c55e;color:#fff;box-shadow:0 12px 28px rgba(0,0,0,.15)}.waButton:hover{transform:translateY(-2px)}.cta .ctaNote{font-size:13px;margin:18px 0 0;color:rgba(255,255,255,.72)}footer{text-align:center;padding:28px;color:#64748b;font-size:13px}@media(max-width:900px){.hero{grid-template-columns:1fr;text-align:center}.hero h1{font-size:42px}.lead{margin:auto}.price,.actions,.facts{justify-content:center}.steps{grid-template-columns:repeat(2,1fr)}.brandCallout{flex-direction:column;text-align:center}.faq{grid-template-columns:1fr}}@media(max-width:640px){.hero{padding:42px 18px 65px}.hero h1{font-size:36px}.section{padding:60px 18px}.section h2,.dark h2,.cta h2{font-size:31px}.benefits,.steps{grid-template-columns:1fr}.phoneFan{transform:scale(.87);height:285px}.ctaActions{flex-direction:column;align-items:stretch;max-width:360px;margin-left:auto;margin-right:auto}.ctaActions .priceButton,.waButton{width:100%}}
`;
