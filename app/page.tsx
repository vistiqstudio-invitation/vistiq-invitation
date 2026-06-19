export default function Home() {
  const features = [
    "Responsive Mobile Friendly",
    "Elegant & Colorful Styles",
    "Custom Nama Tamu",
    "Autoplay Backsound",
    "Galeri Foto & Video",
    "RSVP & Ucapan",
    "Navigasi Lokasi",
    "Love Gift",
    "Kutiptables Ayat / Quote",
    "Countdown Wedding",
    "Story Love Timeline",
    "Sender Tools",
  ];

  const templates = [
    {
      name: "Gold Premium Wedding",
      price: "Rp. 99.000",
      oldPrice: "Rp. 149.000",
      demo: "/andi-siti",
      image: "/preview/template-1.png",
    },
    {
      name: "Islamic Minimalist",
      price: "Rp. 99.000",
      oldPrice: "Rp. 149.000",
      demo: "/andi-siti?to=Bapak%20Ahmad",
      image: "/preview/template-2.png",
    },
    {
      name: "Luxury Floral",
      price: "Rp. 99.000",
      oldPrice: "Rp. 149.000",
      demo: "/andi-siti",
      image: "/preview/template-3.png",
    },
    {
      name: "Faceless Wedding 01",
      price: "Rp. 99.000",
      oldPrice: "Rp. 149.000",
      demo: "/andi-siti",
      image: "/preview/template-4.png",
    },
    {
      name: "Modern Soft Beige",
      price: "Rp. 99.000",
      oldPrice: "Rp. 149.000",
      demo: "/andi-siti",
      image: "/preview/template-5.png",
    },
    {
      name: "Elegant Classic",
      price: "Rp. 99.000",
      oldPrice: "Rp. 149.000",
      demo: "/andi-siti",
      image: "/preview/template-6.png",
    },
  ];

  const whatsappNumber = "6282177788281";
  const message =
    "Halo, saya tertarik untuk daftar reseller undangan digital.";

  return (
    <main style={styles.page}>
      <nav style={styles.navbar}>
        <div>
          <h1 style={styles.logo}>Brand Usaha</h1>
          <p style={styles.tagline}>Undangan Digital Kamu</p>
        </div>

        <div style={styles.navButtons}>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              message
            )}`}
            target="_blank"
            style={styles.navButtonGold}
          >
            👥 Daftar Reseller
          </a>

          <a href="#tema" style={styles.navButtonPink}>
            📊 Contoh Tema
          </a>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.badge}>Buat Usaha Undangan Digital Tanpa Ribet</div>

        <h2 style={styles.heroTitle}>
          Mau punya usaha undangan web dengan brand sendiri?
        </h2>

        <p style={styles.heroText}>
          Kami bisa bantu! Kamu gak harus repot, kami yang urus semuanya.
        </p>

        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            message
          )}`}
          target="_blank"
          style={styles.ctaBlue}
        >
          💬 Konsultasi via WA
        </a>

        <div style={styles.phoneMockup}>
          <div style={styles.phone}>Gold</div>
          <div style={{ ...styles.phone, transform: "rotate(-12deg)" }}>
            Floral
          </div>
          <div style={{ ...styles.phone, transform: "rotate(12deg)" }}>
            Islamic
          </div>
        </div>
      </section>

      <section style={styles.featureSection}>
        <div style={styles.sectionBadge}>KEUNGGULAN LAYANAN JASA KAMI</div>
        <p style={styles.featureIntro}>
          Temukan fitur-fitur menarik yang akan membuat undangan pernikahan
          Anda tampil beda.
        </p>

        <div style={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={feature} style={styles.featureCard}>
              <div style={styles.featureIcon}>{featureIcons[index]}</div>
              <p>{feature}</p>
            </div>
          ))}
        </div>

        <h3 style={styles.featureClosing}>
          Website Undangan Berikan Solusi Semua Yang Anda Butuhkan
          <br />
          Untuk Membuat Halaman Undangan Pernikahan Digital Yang Kekinian,
          Modern, & Elegan.
        </h3>

        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            message
          )}`}
          target="_blank"
          style={styles.ctaSmall}
        >
          💬 Buat Usaha
        </a>
      </section>

      <section id="tema" style={styles.templateSection}>
        <div style={styles.coupleIllustration}>🤵🏻‍♂️ 👰🏻‍♀️</div>
        <p style={styles.templateIntro}>
          Di bawah ini contoh tema
          <br />
          Undangan Digital kami
        </p>

        <div style={styles.templateGrid}>
          {templates.map((template) => (
            <div key={template.name} style={styles.templateCard}>
              <div style={styles.templateImage}>
                <span>{template.name}</span>
              </div>

              <p style={styles.templateName}>🕊 {template.name}</p>

              <h3 style={styles.price}>{template.price}</h3>

              <div style={styles.discountRow}>
                <span style={styles.discount}>34%</span>
                <span style={styles.oldPrice}>{template.oldPrice}</span>
              </div>

              <a href={template.demo} target="_blank" style={styles.demoButton}>
                👁 Lihat Demo
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Halo, saya ingin order tema ${template.name}`
                )}`}
                target="_blank"
                style={styles.orderButton}
              >
                👁 Order
              </a>
            </div>
          ))}
        </div>

        <div style={styles.finalCta}>
          <div style={styles.divider}>🕊</div>
          <p>
            Tunggu apa lagi?
            <br />
            Buat usaha kamu sekarang!
          </p>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              message
            )}`}
            target="_blank"
            style={styles.ctaBlue}
          >
            💬 Hubungi Kami
          </a>
        </div>
      </section>

      <footer style={styles.footer}>
        <strong>- Nama Website Kamu -</strong>
        <p>
          Jl. Alamat Usaha Kamu, No. 45.
          <br />
          Jakarta Barat - Indonesia
        </p>
      </footer>
    </main>
  );
}

const featureIcons = [
  "💎",
  "🎨",
  "🏷️",
  "🎵",
  "🎥",
  "💌",
  "📍",
  "🎁",
  "📜",
  "📅",
  "💞",
  "📨",
];

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "#fffaf4",
    color: "#4b2c17",
    fontFamily: "Georgia, serif",
  },

  navbar: {
    height: 80,
    background: "#4e6a78",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 8%",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },

  logo: {
    color: "white",
    fontSize: 32,
    margin: 0,
    lineHeight: 1,
  },

  tagline: {
    color: "#e0b845",
    fontSize: 18,
    margin: 0,
    fontStyle: "italic",
  },

  navButtons: {
    display: "flex",
    gap: 12,
  },

  navButtonGold: {
    background: "#e6c19d",
    color: "white",
    padding: "12px 24px",
    borderRadius: 6,
    textDecoration: "none",
    fontFamily: "Arial",
    fontWeight: "bold",
  },

  navButtonPink: {
    background: "#ffa2ad",
    color: "white",
    padding: "12px 24px",
    borderRadius: 6,
    textDecoration: "none",
    fontFamily: "Arial",
    fontWeight: "bold",
  },

  hero: {
    minHeight: 530,
    textAlign: "center",
    padding: "50px 24px 0",
    background:
      "radial-gradient(circle at top left, rgba(255,255,255,.8), transparent 20%), linear-gradient(180deg, #f6e5d0, #f9ead8)",
    overflow: "hidden",
  },

  badge: {
    display: "inline-block",
    background: "#caa47b",
    color: "white",
    padding: "12px 30px",
    borderRadius: 8,
    fontSize: 20,
    fontWeight: "bold",
  },

  heroTitle: {
    fontSize: 38,
    margin: "18px auto 12px",
    maxWidth: 900,
  },

  heroText: {
    fontSize: 18,
    fontFamily: "Arial",
    lineHeight: 1.6,
  },

  ctaBlue: {
    display: "inline-block",
    background: "#4e6a78",
    color: "white",
    padding: "14px 32px",
    borderRadius: 8,
    marginTop: 20,
    textDecoration: "none",
    fontFamily: "Arial",
    fontWeight: "bold",
  },

  phoneMockup: {
    margin: "70px auto 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 18,
  },

  phone: {
    width: 170,
    height: 280,
    border: "8px solid #2b2018",
    borderRadius: 32,
    background: "linear-gradient(180deg, #4e6a78, #f2d6b7)",
    color: "#f8e9c7",
    display: "grid",
    placeItems: "center",
    fontSize: 28,
    boxShadow: "0 20px 45px rgba(0,0,0,.25)",
  },

  featureSection: {
    background: "#b08b63",
    color: "white",
    padding: "54px 24px 70px",
    textAlign: "center",
  },

  sectionBadge: {
    display: "inline-block",
    background: "#d4b38e",
    padding: "10px 34px",
    borderRadius: 8,
    fontWeight: "bold",
  },

  featureIntro: {
    fontFamily: "Arial",
    fontWeight: "bold",
    margin: "22px 0",
  },

  featureGrid: {
    maxWidth: 980,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
  },

  featureCard: {
    background: "rgba(255,255,255,.12)",
    padding: "24px 14px",
    borderRadius: 8,
    fontFamily: "Arial",
    fontWeight: "bold",
  },

  featureIcon: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    background: "white",
    margin: "0 auto 16px",
    display: "grid",
    placeItems: "center",
    fontSize: 26,
  },

  featureClosing: {
    marginTop: 46,
    lineHeight: 1.4,
  },

  ctaSmall: {
    display: "inline-block",
    marginTop: 20,
    background: "#4e6a78",
    color: "white",
    padding: "10px 24px",
    borderRadius: 6,
    textDecoration: "none",
    fontFamily: "Arial",
    fontWeight: "bold",
  },

  templateSection: {
    padding: "56px 24px 70px",
    textAlign: "center",
  },

  coupleIllustration: {
    fontSize: 90,
    marginBottom: 10,
  },

  templateIntro: {
    fontSize: 18,
    lineHeight: 1.6,
  },

  templateGrid: {
    maxWidth: 980,
    margin: "50px auto 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 22,
    textAlign: "left",
  },

  templateCard: {
    border: "1px solid #caa47b",
    borderRadius: 6,
    padding: 18,
    background: "white",
  },

  templateImage: {
    height: 250,
    borderRadius: 6,
    background:
      "linear-gradient(160deg, #4e6a78, #f3d2b8 60%, #b08b63)",
    display: "grid",
    placeItems: "center",
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },

  templateName: {
    fontFamily: "Arial",
    marginBottom: 4,
  },

  price: {
    fontSize: 28,
    margin: 0,
  },

  discountRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    margin: "10px 0 14px",
  },

  discount: {
    background: "#b08b63",
    color: "white",
    padding: "8px 10px",
    borderRadius: 4,
    fontFamily: "Arial",
    fontWeight: "bold",
  },

  oldPrice: {
    textDecoration: "line-through",
    color: "#aaa",
    fontFamily: "Arial",
  },

  demoButton: {
    display: "block",
    border: "1px solid #b08b63",
    color: "#b08b63",
    padding: "10px",
    borderRadius: 5,
    textAlign: "center",
    textDecoration: "none",
    fontFamily: "Arial",
    marginBottom: 10,
  },

  orderButton: {
    display: "block",
    background: "#b08b63",
    color: "white",
    padding: "11px",
    borderRadius: 5,
    textAlign: "center",
    textDecoration: "none",
    fontFamily: "Arial",
  },

  finalCta: {
    marginTop: 60,
    textAlign: "center",
    fontFamily: "Arial",
  },

  divider: {
    maxWidth: 240,
    margin: "0 auto 28px",
    borderTop: "1px solid #b08b63",
    paddingTop: 10,
    color: "#b08b63",
  },

  footer: {
    background: "#b08b63",
    color: "white",
    padding: "36px 8%",
    fontFamily: "Arial",
    lineHeight: 1.8,
  },
};