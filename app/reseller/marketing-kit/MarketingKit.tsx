"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { getResellerNavItems } from "@/components/reseller/navItems";
import { createClient } from "@/lib/supabase/client";
import dashboard from "@/styles/dashboard.module.css";
import kit from "./marketingKit.module.css";

type Theme = { key: string; label: string; image: string | null };
type Catalog = { category: string; title: string; path: string; themes: Theme[] };
type Reseller = {
  id: string; name: string | null; package: "reseller" | "reseller_brand" | null;
  brand_name: string | null; brand_color: string | null; logo_url: string | null;
  landing_whatsapp: string | null; brand_active: boolean | null;
  brand_expires_at: string | null;
};
type Props = {
  reseller: Reseller | null;
  profileWhatsapp: string | null;
  catalogs: Catalog[];
};
type Mode = "vistiq" | "sendiri";
type Tab = "poster" | "video" | "caption" | "katalog" | "panduan";

const ADMIN_WA = "0813 7133 8032";
const categories = [
  { id: "wedding", name: "Wedding", headline: "UNDANGAN DIGITAL PERNIKAHAN", detail: "Momen istimewa, undangan berkesan.", image: "/theme-previews/wedding/luxury-gold-card.jpg", accent: "#d5b878", backdrop: "#152d52" },
  { id: "khitan", name: "Khitan", headline: "UNDANGAN DIGITAL KHITAN", detail: "Rayakan hari spesial si kecil.", image: "/theme-previews/khitan/khitan-warna.jpg", accent: "#f1cf82", backdrop: "#203c54" },
  { id: "aqiqah", name: "Akikah", headline: "UNDANGAN DIGITAL AKIKAH", detail: "Kabar bahagia buah hati tersayang.", image: "/theme-previews/akikah/akikah-nur.jpg", accent: "#f0d49e", backdrop: "#174b62" },
  { id: "birthday", name: "Ulang Tahun", headline: "UNDANGAN DIGITAL ULANG TAHUN", detail: "Bagikan kegembiraan di hari spesial.", image: "/theme-previews/birthday/princess-fairytale.jpg", accent: "#f2cce7", backdrop: "#503360" },
  { id: "graduation", name: "Wisuda", headline: "UNDANGAN DIGITAL WISUDA", detail: "Abadikan langkah menuju pencapaian.", image: "", accent: "#f3d39a", backdrop: "#213960" },
] as const;

const videos = [
  { name: "Azure Bloom Motion", src: "/themes/azure-bloom/opening-motion.mp4", info: "Cuplikan animasi pembuka tema wedding." },
  { name: "Premium 3D Motion", src: "/themes/premium-3d-motion-2/elysian-garden-motion.mp4", info: "Cuplikan animasi tema wedding 3D." },
] as const;

const tabs: { key: Tab; text: string }[] = [
  { key: "poster", text: "Poster Promosi" },
  { key: "video", text: "Video Promosi" },
  { key: "caption", text: "Caption & Chat" },
  { key: "katalog", text: "Katalog Tema" },
  { key: "panduan", text: "Panduan Jualan" },
];

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("62") ? digits : digits.startsWith("0") ? "62" + digits.slice(1) : digits ? "62" + digits : "";
}
function formatWhatsapp(value: string) {
  return value.trim() || "Nomor WhatsApp belum diisi";
}
function fillLines(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let count = 0;
  for (const word of words) {
    const proposed = line ? line + " " + word : word;
    if (line && ctx.measureText(proposed).width > maxWidth) {
      ctx.fillText(line, x, y + count * lineHeight);
      count++;
      line = word;
    } else {
      line = proposed;
    }
  }
  if (line) ctx.fillText(line, x, y + count * lineHeight);
  return count + 1;
}
async function loadLocalImage(src: string) {
  if (!src) return null;
  const image = new Image();
  image.src = src;
  try {
    await image.decode();
    return image;
  } catch {
    return null;
  }
}
function drawCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, w: number, h: number) {
  const ratio = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const iw = image.naturalWidth * ratio;
  const ih = image.naturalHeight * ratio;
  ctx.drawImage(image, (w - iw) / 2, (h - ih) / 2, iw, ih);
}
function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob(blob => {
    if (!blob) { window.alert("Gagal menyiapkan poster. Silakan ulangi."); return; }
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, "image/png");
}

export default function MarketingKit({ reseller, profileWhatsapp, catalogs }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("poster");
  const [mode, setMode] = useState<Mode>("vistiq");
  const [category, setCategory] = useState<string>("wedding");
  const [size, setSize] = useState<"feed" | "story">("feed");
  const [ownName, setOwnName] = useState(reseller?.brand_name || reseller?.name || "");
  const [ownWhatsapp, setOwnWhatsapp] = useState(reseller?.landing_whatsapp || profileWhatsapp || "");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [catalogFilter, setCatalogFilter] = useState("all");
  const [notice, setNotice] = useState("");

  const current = categories.find(item => item.id === category) || categories[0];
  const brandName = mode === "vistiq" ? "Vistiq Invitation" : ownName.trim();
  const contact = mode === "vistiq" ? ADMIN_WA : ownWhatsapp.trim();
  const contactLink = normalizeWhatsapp(contact) ? "https://wa.me/" + normalizeWhatsapp(contact) : "";
  const baseUrl = "https://www.vistiqinvitation.com";
  const catalogLink = mode === "sendiri" && reseller?.id
    ? baseUrl + "/promo/" + reseller.id
    : baseUrl + "/demo";
  const announcement = "Undangan digital " + current.name + " dengan pilihan tema, informasi acara, peta lokasi, RSVP, dan galeri sesuai kebutuhan.\n\nLihat pilihan tema: " + catalogLink + "\nKonsultasi/Order: " + (contactLink || "Hubungi penjual");
  const displayBrand = brandName || "Nama Brand Anda";
  const isMissingBrand = mode === "sendiri" && (!ownName.trim() || !normalizeWhatsapp(ownWhatsapp));

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice("Teks berhasil disalin.");
    } catch {
      setNotice("Tidak dapat menyalin otomatis. Pilih dan salin teks secara manual.");
    }
  }

  async function exportPoster() {
    if (isMissingBrand) {
      setNotice("Isi nama brand dan nomor WhatsApp terlebih dahulu untuk versi reseller.");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      const w = 1080, h = size === "story" ? 1920 : 1350;
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Browser tidak mendukung ekspor poster.");
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, current.backdrop);
      gradient.addColorStop(1, "#081b34");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      const image = await loadLocalImage(current.image);
      if (image) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(74, 170, w - 148, h * 0.46, 38);
        ctx.clip();
        ctx.save();
        ctx.translate(74, 170);
        drawCover(ctx, image, w - 148, h * 0.46);
        ctx.restore();
        ctx.restore();
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.roundRect(74, 170, w - 148, h * 0.46, 38);
        ctx.fill();
        ctx.fillStyle = current.accent;
        ctx.beginPath();
        ctx.arc(800, 360, 175, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = current.backdrop;
        ctx.beginPath();
        ctx.arc(800, 360, 136, 0, Math.PI * 2);
        ctx.fill();
      }
      const shade = ctx.createLinearGradient(0, h * 0.44, 0, h);
      shade.addColorStop(0, "rgba(8,25,45,0)");
      shade.addColorStop(0.35, "rgba(8,25,45,0.96)");
      shade.addColorStop(1, "rgba(8,25,45,1)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, h * 0.38, w, h * 0.62);
      ctx.fillStyle = current.accent;
      ctx.fillRect(78, 84, 94, 6);
      ctx.font = "bold 40px Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      fillLines(ctx, displayBrand.toUpperCase(), 78, 130, w - 156, 45);
      const titleY = h * 0.68;
      ctx.font = "bold 70px Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      const lineCount = fillLines(ctx, current.headline, 78, titleY, w - 156, 79);
      ctx.font = "34px Arial, sans-serif";
      ctx.fillStyle = "#e1eaf5";
      const descY = titleY + lineCount * 81 + 17;
      fillLines(ctx, current.detail, 78, descY, w - 156, 45);
      ctx.fillStyle = current.accent;
      ctx.beginPath();
      ctx.roundRect(78, h - 188, w - 156, 94, 24);
      ctx.fill();
      ctx.fillStyle = "#142b45";
      ctx.font = "bold 37px Arial, sans-serif";
      ctx.fillText("KONSULTASI VIA WHATSAPP", 110, h - 127);
      ctx.font = "30px Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(formatWhatsapp(contact), 78, h - 45);
      downloadCanvas(canvas, "marketing-kit-" + category + "-" + mode + "-" + size + ".png");
      setNotice("Poster PNG disiapkan dengan ukuran " + w + "×" + h + ".");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Ekspor gagal. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  const scripts = [
    { id: "caption", title: "Caption promosi", text: "Mau undangan yang praktis dibagikan lewat WhatsApp?\n\n" + announcement + "\n\nTanya tema yang cocok untuk acara kamu, yuk! #UndanganDigital #Undangan" + current.name.replace(/\s+/g, "") },
    { id: "story", title: "Status WhatsApp", text: "Lagi siapin acara " + current.name + "?\nAda undangan digital dengan berbagai pilihan tema ✨\nLihat demo: " + catalogLink + "\nChat saya: " + (contactLink || formatWhatsapp(contact)) },
    { id: "opening", title: "Balasan calon pembeli", text: "Halo, terima kasih sudah menghubungi " + displayBrand + " 😊\nKami menyediakan undangan digital untuk berbagai acara. Mau undangan untuk acara apa dan kapan tanggal acaranya? Saya bantu kirimkan pilihan tema yang sesuai, ya." },
    { id: "demo", title: "Kirim katalog", text: "Ini katalog tema undangan yang bisa dilihat langsung ya:\n" + catalogLink + "\nSilakan pilih tema yang paling cocok. Kalau sudah ada pilihan, kirimkan nama temanya, nanti saya bantu proses." },
    { id: "followup", title: "Follow-up yang sopan", text: "Halo Kak, izin follow-up mengenai pilihan undangannya 😊\nApakah sudah ada tema yang disukai? Kalau masih bingung, boleh cerita konsep atau warna acaranya supaya saya bantu pilihkan." },
    { id: "closing", title: "Chat pemesanan", text: "Siap Kak! Untuk melanjutkan, mohon kirim nama tema yang dipilih, jenis acara, tanggal acara, nama yang diundang, dan foto jika tema menggunakan foto. Saya jelaskan harga serta proses pengerjaannya sebelum pembayaran, ya." },
  ];

  async function logout() {
    await createClient().auth.signOut();
    router.push("/login");
  }

  const validOwnNumber = normalizeWhatsapp(ownWhatsapp);
  const brandStyle = reseller?.brand_color
    ? ({ "--accent": reseller.brand_color } as React.CSSProperties)
    : undefined;

  return (
    <main className={dashboard.page} style={brandStyle}>
      <DashboardSidebar
        brandTop={reseller?.brand_name || "VISTIQ"}
        brandBottom={reseller?.package === "reseller_brand" ? "Mitra Brand" : "Reseller"}
        logoUrl={reseller?.logo_url}
        accentColor={reseller?.brand_color}
        items={getResellerNavItems(reseller?.package, reseller?.id)}
        activeKey="marketing-kit"
        notificationRole="reseller"
        onLogout={logout}
      />
      <section className={dashboard.content}>
        <header className={dashboard.header}>
          <div>
            <p className={dashboard.label}>PUSAT MATERI RESELLER</p>
            <h1 className={dashboard.title}>Marketing Kit</h1>
            <p className={dashboard.subtitle}>Poster siap unduh, cuplikan video, template pesan, katalog tema, dan panduan promosi dalam satu tempat.</p>
          </div>
        </header>

        {!reseller ? (
          <div className={dashboard.warningBox}>Akun reseller belum terhubung. Hubungi admin Vistiq untuk memeriksa profil akun Anda.</div>
        ) : (
          <>
            <div className={kit.brandPanel}>
              <div>
                <strong>Pilih versi materi promosi</strong>
                <p>Versi Vistiq menggunakan kontak admin Vistiq. Versi brand sendiri menggunakan nama dan WhatsApp Anda.</p>
              </div>
              <div className={kit.switcher} role="group" aria-label="Versi branding">
                <button type="button" className={mode === "vistiq" ? kit.selected : ""} onClick={() => setMode("vistiq")}>Vistiq Invitation</button>
                <button type="button" className={mode === "sendiri" ? kit.selected : ""} onClick={() => setMode("sendiri")}>Brand Saya</button>
              </div>
              {mode === "sendiri" && (
                <div className={kit.brandFields}>
                  <label>Nama brand<input value={ownName} maxLength={70} onChange={e => setOwnName(e.target.value)} placeholder="Nama usaha Anda" /></label>
                  <label>WhatsApp jualan<input value={ownWhatsapp} inputMode="tel" onChange={e => setOwnWhatsapp(e.target.value)} placeholder="08xxxxxxxxxx" /></label>
                  {!validOwnNumber && <small>Isi nomor WhatsApp agar poster dan template chat mengarah ke kontak Anda.</small>}
                  <small>Pengaturan ini untuk materi promosi. Untuk menyimpan perubahan profil brand, buka menu Dashboard → Brand Saya.</small>
                </div>
              )}
            </div>

            <div className={kit.tabs} role="tablist" aria-label="Menu Marketing Kit">
              {tabs.map(item => (
                <button key={item.key} role="tab" aria-selected={tab === item.key}
                  className={tab === item.key ? kit.tabActive : ""}
                  onClick={() => { setTab(item.key); setNotice(""); }}>{item.text}</button>
              ))}
            </div>
            {notice && <p role="status" className={kit.notice}>{notice}</p>}

            {tab === "poster" && (
              <div className={kit.columns}>
                <section className={kit.panel}>
                  <h2>Poster siap promosi</h2>
                  <p>Gunakan preview untuk melihat komposisi. Unduh dalam ukuran feed atau story, dengan branding yang dipilih di atas.</p>
                  <div className={kit.choices}>
                    {categories.map(item => (
                      <button type="button" key={item.id} className={category === item.id ? kit.chosen : ""}
                        onClick={() => setCategory(item.id)}>{item.name}</button>
                    ))}
                  </div>
                  <label className={kit.field}>Ukuran poster
                    <select value={size} onChange={e => setSize(e.target.value as "feed" | "story")}>
                      <option value="feed">Feed 1080 × 1350</option>
                      <option value="story">Story / Status 1080 × 1920</option>
                    </select>
                  </label>
                  <button type="button" className={kit.primary} onClick={() => void exportPoster()} disabled={saving || isMissingBrand}>
                    {saving ? "Menyiapkan poster..." : "Unduh Poster PNG"}
                  </button>
                  {isMissingBrand && <p className={kit.warning}>Isi nama brand dan WhatsApp pada bagian Brand Saya sebelum mengunduh.</p>}
                  {category === "graduation" && <p className={kit.hint}>Materi wisuda berupa poster promosi umum. Demo tema wisuda belum tersedia di katalog website.</p>}
                </section>
                <section className={kit.previewWrap} aria-label="Preview poster">
                  <div className={kit.poster} style={{ aspectRatio: size === "story" ? "9 / 16" : "4 / 5", background: current.backdrop }}>
                    {current.image && <img src={current.image} alt="Ilustrasi poster" />}
                    <div className={kit.posterTop}>{displayBrand}</div>
                    <div className={kit.posterCopy}>
                      <span>INVITATION COLLECTION</span>
                      <h2>{current.headline}</h2>
                      <p>{current.detail}</p>
                      <strong>KONSULTASI VIA WHATSAPP</strong>
                      <small>{formatWhatsapp(contact)}</small>
                    </div>
                  </div>
                  <p className={kit.hint}>Preview menampilkan komposisi poster. Berkas PNG diekspor sesuai ukuran pilihan.</p>
                </section>
              </div>
            )}

            {tab === "video" && (
              <section className={kit.panel}>
                <h2>Cuplikan video tema</h2>
                <p>Video pembuka dari aset tema Vistiq yang sudah tersedia. Ini adalah cuplikan tema asli, bukan iklan Reels dengan teks/branding tambahan. Bisa diunduh untuk bahan promosi dan diedit sesuai kebutuhan.</p>
                <div className={kit.videos}>
                  {videos.map(video => (
                    <article key={video.src} className={kit.videoCard}>
                      <video src={video.src} controls playsInline preload="metadata" aria-label={video.name} />
                      <h3>{video.name}</h3>
                      <p>{video.info}</p>
                      <a className={kit.primary} href={video.src} download>Unduh MP4</a>
                    </article>
                  ))}
                </div>
                <p className={kit.hint}>Untuk tema lain, buka tab Katalog Tema, tampilkan demo dan rekam bagian yang ingin dipromosikan. Jangan menjanjikan video full yang belum tersedia.</p>
              </section>
            )}

            {tab === "caption" && (
              <section className={kit.panel}>
                <h2>Caption & template chat siap salin</h2>
                <p>Gunakan sesuai kebutuhan dan sesuaikan harga serta estimasi pengerjaan dengan penawaran Anda. Link dan kontak otomatis mengikuti versi branding.</p>
                <label className={kit.field}>Topik caption
                  <select value={category} onChange={e => setCategory(e.target.value)}>
                    {categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </label>
                <div className={kit.templates}>
                  {scripts.map(script => (
                    <article className={kit.template} key={script.id}>
                      <h3>{script.title}</h3>
                      <pre>{script.text}</pre>
                      <button type="button" className={kit.secondary} onClick={() => void copyText(script.text)}>Salin teks</button>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {tab === "katalog" && (
              <section className={kit.panel}>
                <h2>Katalog & link demo tema</h2>
                <p>Link demo asli Vistiq. Untuk versi Brand Saya, bagikan juga landing page reseller agar calon pembeli bisa menghubungi Anda melalui brand sendiri.</p>
                <div className={kit.catalogTools}>
                  <label className={kit.field}>Kategori
                    <select value={catalogFilter} onChange={e => setCatalogFilter(e.target.value)}>
                      <option value="all">Semua kategori</option>
                      {catalogs.map(group => <option key={group.category} value={group.category}>{group.title}</option>)}
                    </select>
                  </label>
                  <label className={kit.field}>Cari tema
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama tema..." />
                  </label>
                </div>
                <div className={kit.catalogActions}>
                  <a className={kit.primary} href={catalogLink} target="_blank" rel="noreferrer">Buka {mode === "sendiri" ? "Landing Saya" : "Katalog Vistiq"}</a>
                  <button className={kit.secondary} onClick={() => void copyText(catalogLink)}>Salin link katalog</button>
                </div>
                {catalogs.filter(g => catalogFilter === "all" || catalogFilter === g.category).map(group => {
                  const visible = group.themes.filter(theme => theme.label.toLowerCase().includes(search.toLowerCase()));
                  return visible.length ? (
                    <div key={group.category} className={kit.group}>
                      <h3>{group.title} <small>{visible.length} tema</small></h3>
                      <div className={kit.themeGrid}>
                        {visible.map(theme => {
                          const href = baseUrl + group.path + "/" + encodeURIComponent(theme.key);
                          return <article className={kit.themeCard} key={theme.key}>
                            {theme.image ? <img src={theme.image} alt={"Cover demo " + theme.label} loading="lazy" /> : <div className={kit.noImage}>Preview tema</div>}
                            <strong>{theme.label}</strong>
                            <div className={kit.themeActions}>
                              <a href={href} target="_blank" rel="noreferrer">Lihat demo</a>
                              <button type="button" onClick={() => void copyText(href)}>Salin link</button>
                            </div>
                          </article>;
                        })}
                      </div>
                    </div>
                  ) : null;
                })}
              </section>
            )}

            {tab === "panduan" && (
              <section className={kit.panel}>
                <h2>Panduan jualan reseller</h2>
                <p>Alur praktis dari promosi sampai undangan dikirim. Cocok untuk Reseller maupun Mitra Brand.</p>
                <ol className={kit.guide}>
                  <li><strong>Siapkan identitas jualan.</strong><span>Isi nama usaha dan nomor WhatsApp. Pilih poster versi Vistiq atau versi brand sendiri.</span></li>
                  <li><strong>Publikasikan konten.</strong><span>Gunakan poster di status WhatsApp, Instagram Story/Feed, dan cuplikan video di Reels/TikTok.</span></li>
                  <li><strong>Berikan contoh nyata.</strong><span>Kirim link demo tema yang sesuai dengan jenis acara. Gunakan landing reseller untuk memudahkan order melalui brand Anda.</span></li>
                  <li><strong>Tanyakan kebutuhan client.</strong><span>Catat jenis acara, tanggal, konsep, foto, dan tema yang dipilih. Jelaskan harga berdasarkan paket Anda sendiri.</span></li>
                  <li><strong>Konfirmasi pesanan.</strong><span>Terangkan data yang perlu dikumpulkan, revisi, dan estimasi pengerjaan. Pastikan pembayaran mengikuti proses resmi Vistiq.</span></li>
                  <li><strong>Proses dan cek undangan.</strong><span>Isi data client di dashboard, cek nama, foto, tanggal, maps, RSVP, dan branding di preview sebelum membagikan link.</span></li>
                </ol>
                <div className={kit.catalogActions}>
                  <a href="/reseller/invitations" className={kit.primary}>Buat Undangan</a>
                  <a href="/reseller/clients" className={kit.secondary}>Daftar Client</a>
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
