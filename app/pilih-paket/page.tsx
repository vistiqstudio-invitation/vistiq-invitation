import type { Metadata } from "next";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import PhoneMockup from "@/components/PhoneMockup";
import ThemeBrowser from "@/components/ThemeBrowser";
import { PAYMENT_PACKAGES, type PaymentPackageId } from "@/lib/paymentPackages";

export const metadata: Metadata = {
  title: "Pilih Paket & Mulai Bisnis Undangan Digital | Vistiq Invitation",
  description: "Pilih paket Client, Reseller, atau Reseller Brand Vistiq Invitation.",
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
    description: "Untuk mulai jualan undangan digital Vistiq tanpa batas dengan modal join ringan.",
    features: [
      "Rp149.000 sekali bayar, akses selamanya",
      "Jual dan kelola client tanpa batas",
      "80% bagian reseller setiap transaksi client",
      "Fee platform 20% setiap transaksi client",
      "Dashboard khusus reseller",
    ],
    button: "Join Reseller Rp149.000",
    featured: true,
  },
  {
    id: "reseller-brand",
    title: "Bangun Brand Sendiri",
    eyebrow: "Paket Reseller Brand",
    description: "Untuk membangun usaha undangan white label dengan identitas bisnis sendiri.",
    features: [
      "Nama, logo, dan warna brand sendiri",
      "Subdomain gratis atau custom domain",
      "Keuntungan penjualan 100% milik Anda",
      "Update tema dan konten promosi",
      "Rp59.000 per bulan",
    ],
    button: "Pilih Reseller Brand",
  },
];

const FAQS = [
  ["Apa perbedaan Reseller dan Reseller Brand?", "Reseller memakai brand Vistiq, join Rp149.000 sekali bayar, dapat menjual tanpa batas, dan setiap transaksi client dikenakan fee platform 20%. Reseller Brand memakai identitas bisnis sendiri dan menyimpan 100% harga jualnya."],
  ["Apakah Reseller ada biaya bulanan?", "Tidak. Paket Reseller Rp149.000 dibayar sekali dan aktif selamanya."],
  ["Apakah jumlah client Reseller dibatasi?", "Tidak. Reseller dapat menjual undangan dan mengelola client sebanyak yang dibutuhkan."],
  ["Bagaimana fee 20% dihitung?", "Pada transaksi client paket Reseller, 80% menjadi bagian reseller dan 20% menjadi fee platform Vistiq."],
  ["Apakah harus bisa desain atau coding?", "Tidak. Tema, dashboard, dan sistem sudah disiapkan."],
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
      <header className="header">
        <Link href="/" className="brand"><p>VISTIQ</p><h1>Invitation</h1></Link>
        <Link href="/demo" className="headerLink">Lihat Demo</Link>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="badge">Platform Undangan Digital Siap Pakai</p>
          <h1>Pilih Paket Sesuai Tujuan Anda</h1>
          <p className="lead">Buat undangan sendiri, mulai jualan sebagai Reseller, atau bangun bisnis white label dengan Reseller Brand.</p>
          <a href="#paket" className="primary">Lihat Pilihan Paket</a>
        </div>
        <div className="visual">
          {HERO_FAN.map((item) => (
            <PhoneMockup key={item.key} themeKey={item.key} width={122} className="phone" style={{ transform: `translate(calc(-50% + ${item.x}px), calc(-50% + ${item.y}px)) rotate(${item.rotate}deg) scale(${item.scale})`, zIndex: item.z }} />
          ))}
        </div>
      </section>

      {referralCode && <div className="referral">✓ Link rekomendasi Affiliate Vistiq terverifikasi</div>}

      <section id="paket" className="section">
        <p className="label">PILIHAN PAKET</p>
        <h2>Pilih yang Paling Cocok</h2>
        <div className="packageGrid">
          {packageDetails.map((item) => {
            const isSelected = selected === item.id;
            const price = PAYMENT_PACKAGES[item.id].amount;
            return (
              <article id={item.id} key={item.id} className={`packageCard ${item.featured ? "featured" : ""} ${isSelected ? "selected" : ""}`}>
                {item.featured && <span className="topBadge">Paling Populer</span>}
                {isSelected && <span className="selectedBadge">Paket Pilihan Anda</span>}
                <p className="eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p className="description">{item.description}</p>
                <strong className="price">Rp {price.toLocaleString("id-ID")}<small>{item.id === "reseller-brand" ? "/bulan" : "/sekali bayar"}</small></strong>
                <ul>{item.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
                <CheckoutButton packageId={item.id} label={item.button} featured={item.featured} production={midtransProduction} autoOpen={isSelected} referralCode={referralCode} />
                <small className="payment">QRIS · Virtual Account · E-Wallet</small>
                {item.id === "reseller" && <Link className="learn" href="/gabung-reseller">Pelajari paket Reseller →</Link>}
                {item.id === "reseller-brand" && <Link className="learn" href="/gabung-resellerbrand">Pelajari Reseller Brand →</Link>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="demoSection">
        <div className="section">
          <p className="label light">DEMO UNDANGAN</p>
          <h2>Lihat Produk yang Akan Anda Gunakan atau Jual</h2>
          <ThemeBrowser priceWasLabel="Rp 149.000" discountLabel="34%" />
        </div>
      </section>

      <section className="section faqSection">
        <p className="label">PERTANYAAN UMUM</p><h2>Sebelum Memilih Paket</h2>
        <div className="faq">{FAQS.map(([q,a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div>
      </section>

      <footer>© 2026 Vistiq Invitation. All rights reserved.</footer>
    </main>
  );
}

const css = `
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}.page{min-height:100vh;background:#f7f9fc;color:#0f172a;font-family:Arial,Helvetica,sans-serif}.header{max-width:1180px;margin:auto;padding:22px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e2e8f0}.brand{text-decoration:none}.brand p{margin:0;color:#1167b2;font-size:12px;font-weight:900;letter-spacing:3px}.brand h1{margin:0;color:#0f172a;font-size:28px}.headerLink{color:#1167b2;text-decoration:none;font-weight:900}.hero{max-width:1180px;margin:auto;padding:68px 24px 88px;display:grid;grid-template-columns:1.08fr .92fr;gap:48px;align-items:center}.badge,.label{color:#1167b2;font-size:12px;font-weight:900;letter-spacing:2px}.badge{display:inline-block;padding:9px 15px;border-radius:999px;background:#dbeafe}.hero h1{margin:20px 0;color:#0f4e8a;font-size:54px;line-height:1.06}.lead{max-width:650px;color:#64748b;font-size:18px;line-height:1.75}.primary{display:inline-flex;margin-top:18px;padding:14px 22px;border-radius:999px;background:#1167b2;color:#fff;text-decoration:none;font-weight:900}.visual{position:relative;width:330px;max-width:100%;height:340px;margin:auto}.phone{position:absolute;top:50%;left:50%}.referral{width:max-content;max-width:calc(100% - 32px);margin:-44px auto 36px;padding:9px 14px;border:1px solid #bbf7d0;border-radius:999px;background:#f0fdf4;color:#15803d;font-size:12px;font-weight:800}.section{max-width:1180px;margin:auto;padding:78px 24px}.section h2{margin:10px 0 34px;font-size:40px}.packageGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:stretch}.packageCard{position:relative;display:flex;flex-direction:column;padding:30px;border:1px solid #e2e8f0;border-radius:26px;background:#fff;box-shadow:0 18px 50px rgba(15,23,42,.07)}.packageCard.featured{border:2px solid #1167b2;transform:translateY(-8px)}.packageCard.selected{outline:3px solid #22c55e}.topBadge,.selectedBadge{align-self:flex-start;padding:7px 11px;border-radius:999px;font-size:10px;font-weight:900}.topBadge{background:#1167b2;color:#fff}.selectedBadge{margin-top:8px;background:#dcfce7;color:#15803d}.eyebrow{margin:18px 0 7px;color:#1167b2;font-size:11px;font-weight:900;letter-spacing:1.3px}.packageCard h3{margin:0;font-size:27px}.description{min-height:70px;color:#64748b;font-size:14px;line-height:1.6}.price{display:block;margin:10px 0 18px;color:#1167b2;font-size:30px}.price small{margin-left:4px;color:#94a3b8;font-size:11px}.packageCard ul{display:grid;gap:11px;margin:0 0 24px;padding:0;list-style:none;flex:1}.packageCard li{display:flex;gap:9px;color:#475569;font-size:13px;line-height:1.45}.packageCard li span{display:grid;place-items:center;flex:0 0 20px;height:20px;border-radius:50%;background:#dcfce7;color:#15803d;font-size:11px;font-weight:900}.packageCard .priceButton{width:100%;min-height:48px;border:0;border-radius:13px;background:linear-gradient(135deg,#1167b2,#0f4e8a);color:#fff;font-family:inherit;font-weight:900;cursor:pointer}.payment{display:block;margin-top:10px;color:#94a3b8;font-size:9px;text-align:center}.learn{display:block;margin-top:14px;text-align:center;color:#1167b2;text-decoration:none;font-size:12px;font-weight:900}.demoSection{background:#0f172a;color:#fff}.label.light{color:#7dd3fc}.demoSection h2{color:#fff}.faq{max-width:820px}.faq details{margin-bottom:12px;padding:20px 22px;border:1px solid #e2e8f0;border-radius:17px;background:#fff}.faq summary{display:flex;justify-content:space-between;cursor:pointer;font-weight:900}.faq summary span{color:#1167b2}.faq p{margin:14px 0 0;color:#64748b;line-height:1.65}footer{padding:28px;color:#94a3b8;font-size:12px;text-align:center}@media(max-width:900px){.hero{grid-template-columns:1fr;text-align:center}.lead{margin:auto}.packageGrid{grid-template-columns:1fr;max-width:560px;margin:auto}.packageCard.featured{transform:none}}@media(max-width:640px){.hero{padding:44px 18px 62px}.hero h1{font-size:38px}.section{padding:60px 18px}.section h2{font-size:31px}}
`;
