import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";

export default function GabungResellerBrandPage() {
  return (
    <main className="page">
      <style>{css}</style>
      <SiteNavbar />
      <section className="closed">
        <div className="card">
          <p className="badge">MITRA BRAND</p>
          <h1>Pendaftaran Mitra Brand Sudah Ditutup</h1>
          <p>
            Vistiq tidak menerima pendaftaran Mitra Brand baru. Akun Mitra Brand
            yang sudah terdaftar sebelumnya tetap dapat digunakan seperti biasa.
          </p>
          <Link href="/gabung-reseller" className="button">Lihat Paket Reseller</Link>
        </div>
      </section>
      <footer>© 2026 Vistiq Invitation. All rights reserved.</footer>
    </main>
  );
}

const css = `
*{box-sizing:border-box}.page{min-height:100vh;background:#f6f8fb;color:#0f172a;font-family:Arial,Helvetica,sans-serif;display:flex;flex-direction:column}.closed{flex:1;min-height:78vh;display:grid;place-items:center;padding:150px 20px 80px}.card{width:min(100%,680px);padding:52px 42px;text-align:center;background:#fff;border:1px solid #e2e8f0;border-radius:30px;box-shadow:0 22px 60px rgba(15,23,42,.09)}.badge{display:inline-block;margin:0 0 18px;padding:9px 15px;border-radius:999px;background:#dbeafe;color:#0f4e8a;font-size:12px;font-weight:900;letter-spacing:1.5px}.card h1{margin:0;color:#0f4e8a;font-size:42px;line-height:1.15}.card>p:not(.badge){max-width:560px;margin:20px auto 30px;color:#64748b;font-size:17px;line-height:1.75}.button{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 25px;border-radius:999px;background:#1863ad;color:#fff;text-decoration:none;font-weight:800}footer{text-align:center;padding:28px;color:#64748b;font-size:13px}@media(max-width:640px){.closed{padding:125px 16px 60px}.card{padding:38px 22px;border-radius:24px}.card h1{font-size:32px}.card>p:not(.badge){font-size:15px}}
`;
