import type { Metadata } from "next";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import {
  PAYMENT_PACKAGES,
  type PaymentPackageId,
} from "@/lib/paymentPackages";

export const metadata: Metadata = {
  title: "Pilih Paket | Vistiq Invitation",
  description:
    "Pilih paket Client, Reseller, atau Reseller Brand Vistiq Invitation.",
};

type PageProps = {
  searchParams: Promise<{
    paket?: string | string[];
    ref?: string | string[];
  }>;
};

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
    description:
      "Untuk Anda yang membutuhkan satu undangan digital premium.",
    features: [
      "1 undangan digital premium",
      "Edit data dan unggah foto sendiri",
      "RSVP, galeri, musik, dan amplop digital",
    ],
    button: "Bikin Undangan Sekarang",
  },
  {
    id: "reseller",
    title: "Daftar Reseller",
    eyebrow: "Paket Reseller",
    description:
      "Untuk mulai menjual undangan menggunakan platform Vistiq.",
    features: [
      "Dashboard khusus reseller",
      "Tambah dan kelola client sendiri",
      "Sekali bayar, akses selamanya",
    ],
    button: "Bayar & Daftar Reseller",
    featured: true,
  },
  {
    id: "reseller-brand",
    title: "Reseller Brand",
    eyebrow: "Paket White Label",
    description:
      "Untuk membangun usaha undangan dengan nama dan logo brand sendiri.",
    features: [
      "Semua fitur paket Reseller",
      "Nama dan logo brand sendiri",
      "Keuntungan penjualan 100% milik Anda",
    ],
    button: "Pilih Reseller Brand",
  },
];

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function cleanReferral(value?: string) {
  return (value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 32);
}

export default async function PilihPaketPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const requestedPackage = first(params.paket);
  const selected = packageDetails.some(
    (item) => item.id === requestedPackage,
  )
    ? (requestedPackage as PaymentPackageId)
    : null;
  const referralCode = cleanReferral(first(params.ref));
  const midtransProduction =
    process.env.MIDTRANS_IS_PRODUCTION === "true";

  return (
    <main className="packagePage">
      <style>{css}</style>

      <header className="packageHeader">
        <Link href="/" className="packageBrand">
          <span>VISTIQ</span>
          <strong>Invitation</strong>
        </Link>
        <Link href="/" className="homeLink">
          Kembali ke Homepage
        </Link>
      </header>

      <section className="packageHero">
        <p className="packageLabel">PILIH PAKET VISTIQ</p>
        <h1>Satu langkah lagi untuk memulai</h1>
        <p>
          Pilih paket sesuai kebutuhan Anda. Pembayaran aman melalui
          Midtrans dan akun dibuat otomatis setelah pembayaran berhasil.
        </p>
        {referralCode && (
          <div className="referralNotice">
            ✓ Link rekomendasi Affiliate Vistiq terverifikasi
          </div>
        )}
      </section>

      <section className="packageGrid">
        {packageDetails.map((item) => {
          const isSelected = selected === item.id;
          const price = PAYMENT_PACKAGES[item.id].amount;

          return (
            <article
              id={item.id}
              key={item.id}
              className={`packageCard ${
                item.featured ? "featuredCard" : ""
              } ${isSelected ? "selectedCard" : ""}`}
            >
              {isSelected && (
                <span className="selectedBadge">
                  Paket pilihan Anda
                </span>
              )}
              {!isSelected && item.featured && (
                <span className="popularBadge">Paling Populer</span>
              )}
              <p className="cardEyebrow">{item.eyebrow}</p>
              <h2>{item.title}</h2>
              <p className="cardDescription">{item.description}</p>
              <strong className="packagePrice">
                Rp {price.toLocaleString("id-ID")}
                <small>/sekali bayar</small>
              </strong>
              <ul>
                {item.features.map((feature) => (
                  <li key={feature}>
                    <span>✓</span>
                    {feature}
                  </li>
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
              <small className="paymentMethods">
                QRIS · Virtual Account · E-Wallet
              </small>
            </article>
          );
        })}
      </section>

      <section className="trustSection">
        <div>
          <strong>Pembayaran Aman</strong>
          <span>Diproses melalui Midtrans</span>
        </div>
        <div>
          <strong>Akun Otomatis</strong>
          <span>Dibuat setelah pembayaran sukses</span>
        </div>
        <div>
          <strong>Bantuan Admin</strong>
          <span>Siap membantu jika ada kendala</span>
        </div>
      </section>

      <footer className="packageFooter">
        © 2026 Vistiq Invitation. All rights reserved.
      </footer>
    </main>
  );
}

const css = `
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0}
.packagePage{min-height:100vh;background:linear-gradient(180deg,#f7fbff 0%,#fff 42%,#f5f9fd 100%);color:#0f172a;font-family:Arial,Helvetica,sans-serif}
.packageHeader{max-width:1180px;margin:0 auto;padding:24px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.packageBrand{text-decoration:none;display:grid;color:#0f172a}
.packageBrand span{color:#1167b2;font-size:12px;font-weight:900;letter-spacing:3px}
.packageBrand strong{font-size:25px}
.homeLink{padding:11px 18px;border:1px solid #dbeafe;border-radius:999px;color:#1167b2;background:#fff;text-decoration:none;font-size:13px;font-weight:800}
.packageHero{max-width:780px;margin:0 auto;padding:60px 24px 38px;text-align:center}
.packageLabel{margin:0;color:#1167b2;font-size:12px;font-weight:900;letter-spacing:2px}
.packageHero h1{margin:14px 0 16px;color:#0f4e8a;font-size:48px;line-height:1.08;letter-spacing:-.04em}
.packageHero>p:not(.packageLabel){max-width:680px;margin:0 auto;color:#64748b;font-size:17px;line-height:1.75}
.referralNotice{display:inline-flex;margin-top:22px;padding:9px 14px;border:1px solid #bbf7d0;border-radius:999px;background:#f0fdf4;color:#15803d;font-size:12px;font-weight:800}
.packageGrid{max-width:1180px;margin:0 auto;padding:24px 24px 70px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:stretch}
.packageCard{position:relative;display:flex;flex-direction:column;padding:30px;border:1px solid #e2e8f0;border-radius:26px;background:#fff;box-shadow:0 18px 55px rgba(15,23,42,.07);transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
.packageCard:hover{transform:translateY(-4px);border-color:#93c5fd;box-shadow:0 22px 60px rgba(17,103,178,.12)}
.featuredCard{border-color:#1167b2;box-shadow:0 22px 60px rgba(17,103,178,.16)}
.selectedCard{border:2px solid #16a34a;box-shadow:0 24px 65px rgba(22,163,74,.16)}
.selectedBadge,.popularBadge{align-self:flex-start;margin:-44px 0 20px;padding:8px 12px;border-radius:999px;color:#fff;font-size:11px;font-weight:900}
.selectedBadge{background:#16a34a}
.popularBadge{background:#1167b2}
.cardEyebrow{margin:0 0 8px;color:#1167b2;font-size:11px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase}
.packageCard h2{margin:0;font-size:29px;letter-spacing:-.03em}
.cardDescription{min-height:70px;margin:12px 0 4px;color:#64748b;font-size:14px;line-height:1.65}
.packagePrice{display:block;margin:14px 0 18px;color:#1167b2;font-size:30px}
.packagePrice small{margin-left:5px;color:#94a3b8;font-size:11px;font-weight:700}
.packageCard ul{display:grid;gap:12px;margin:0 0 24px;padding:0;list-style:none;flex:1}
.packageCard li{display:flex;align-items:flex-start;gap:9px;color:#475569;font-size:13px;line-height:1.5}
.packageCard li span{display:grid;place-items:center;flex:0 0 20px;height:20px;border-radius:50%;background:#dcfce7;color:#15803d;font-size:11px;font-weight:900}
.packageCard .priceButton{width:100%;min-height:48px;margin-top:auto;border:0;border-radius:13px;background:linear-gradient(135deg,#1167b2,#0f4e8a);color:#fff;font-family:inherit;font-weight:900;cursor:pointer;box-shadow:0 12px 26px rgba(17,103,178,.2)}
.packageCard .featuredButton{background:linear-gradient(135deg,#1167b2,#0f4e8a);color:#fff}
.paymentMethods{display:block;margin-top:11px;color:#94a3b8;font-size:9px;font-weight:800;letter-spacing:.08em;text-align:center}
.trustSection{max-width:920px;margin:0 auto 70px;padding:24px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.trustSection div{display:grid;gap:6px;padding:18px;border:1px solid #e2e8f0;border-radius:16px;background:rgba(255,255,255,.8);text-align:center}
.trustSection strong{color:#0f4e8a;font-size:13px}
.trustSection span{color:#64748b;font-size:11px;line-height:1.5}
.packageFooter{padding:28px;color:#94a3b8;font-size:12px;text-align:center;border-top:1px solid #e2e8f0}
@media(max-width:820px){
 .packageHero{padding-top:38px}
 .packageHero h1{font-size:38px}
 .packageGrid{grid-template-columns:1fr;max-width:520px;gap:32px}
 .cardDescription{min-height:0}
 .trustSection{grid-template-columns:1fr;max-width:520px}
}
@media(max-width:520px){
 .packageHeader{padding:18px}
 .packageBrand strong{font-size:21px}
 .homeLink{padding:10px 13px;font-size:11px}
 .packageHero{padding:34px 20px 28px}
 .packageHero h1{font-size:34px}
 .packageHero>p:not(.packageLabel){font-size:15px}
 .packageGrid{padding:24px 16px 55px}
 .packageCard{padding:25px 21px;border-radius:22px}
 .packageCard h2{font-size:26px}
}
`;
