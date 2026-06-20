"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./luxury-gold.module.css";

const ASSET = "/themes/luxury-gold";
const MUSIC = "/music/wedding2.mp3";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const MAP_AKAD =
  "https://www.google.com/maps/search/?api=1&query=Masjid+Agung+Al-Muttaqin+Bandung";
const MAP_RESEPSI =
  "https://www.google.com/maps/search/?api=1&query=Savoy+Homann+Bidakara+Hotel+Bandung";

const stories = [
  {
    year: "2019",
    icon: "♡",
    title: "Awal Bertemu",
    desc: "Tidak ada yang kebetulan di dunia ini. Kami dipertemukan dalam sebuah pertemuan sederhana yang menjadi awal perjalanan panjang kami.",
  },
  {
    year: "2022",
    icon: "◇",
    title: "Lamaran",
    desc: "Dengan restu kedua keluarga, kami memutuskan melangkah menuju hubungan yang lebih serius.",
  },
  {
    year: "2026",
    icon: "♔",
    title: "Menikah",
    desc: "InsyaAllah kami akan menyempurnakan separuh agama dalam ikatan suci pernikahan.",
  },
];

const rundown = [
  {
    time: "07.00 – 08.30 WIB",
    title: "Penyambutan Tamu",
    desc: "Keluarga besar menyambut para tamu undangan yang mulai berdatangan.",
  },
  {
    time: "08.30 – 10.00 WIB",
    title: "Akad Nikah",
    desc: "Prosesi ijab kabul yang sakral disaksikan keluarga dan sahabat terdekat.",
  },
  {
    time: "10.30 – 12.00 WIB",
    title: "Sungkeman & Foto Keluarga",
    desc: "Prosesi sungkeman kepada kedua orang tua dan sesi foto bersama keluarga besar.",
  },
  {
    time: "12.00 – 16.00 WIB",
    title: "Resepsi & Jamuan",
    desc: "Resepsi pernikahan dan jamuan makan bersama tamu undangan.",
  },
];
type InvitationData = {
  id?: string;
  slug?: string;
  groom_name?: string;
  bride_name?: string;
  event_date?: string;
  akad_location?: string;
  reception_location?: string;
  maps_url?: string;
  bank_name?: string;
  bank_account?: string;
  bank_holder?: string;
  music_url?: string;
  cover_photo?: string;
  bride_photo?: string;
  groom_photo?: string;
  gallery_photos?: string[];
};
type Wish = {
  id?: number;
  name: string;
  whatsapp?: string;
  attendance: string;
  message: string;
  created_at?: string;
};

export default function LuxuryGold({ invitation }: { invitation?: InvitationData }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState("Bapak/Ibu/Saudara/i");
  const [isPlaying, setIsPlaying] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);

  const [form, setForm] = useState({ 
    name: "",
    whatsapp: "",
    attendance: "",
    message: "",
  });
  const groomName = invitation?.groom_name || "Rizky";
  const brideName = invitation?.bride_name || "Nabila";
  const coupleNames = `${groomName} & ${brideName}`;

  const eventDateText = invitation?.event_date
    ? new Date(invitation.event_date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "20 September 2026";

  const eventDateTarget = invitation?.event_date
    ? new Date(`${invitation.event_date}T08:30:00`).getTime()
    : new Date("2026-09-20T08:30:00").getTime();

  const coverImage = invitation?.cover_photo || `${ASSET}/cover.png`;
  const sampulImage = invitation?.cover_photo || `${ASSET}/sampul.png`;
  const brideImage = invitation?.bride_photo || `${ASSET}/bride.png`;
  const groomImage = invitation?.groom_photo || `${ASSET}/groom.png`;
  const coupleImage = invitation?.cover_photo || `${ASSET}/couple.png`;

  const musicSource = invitation?.music_url || MUSIC;

  const akadLocation = invitation?.akad_location || "Masjid Agung Al-Muttaqin";
  const receptionLocation =
    invitation?.reception_location || "Savoy Homann Bidakara Hotel";

  const mapsUrl = invitation?.maps_url || MAP_AKAD;

  const bankName = invitation?.bank_name || "Bank BCA";
  const bankAccount = invitation?.bank_account || "1234 5678 90";
  const bankHolder = invitation?.bank_holder || `a/n ${coupleNames}`;

  const galleryImages =
    invitation?.gallery_photos && invitation.gallery_photos.length > 0
      ? invitation.gallery_photos
      : [
          `${ASSET}/Photo 01.png`,
          `${ASSET}/Photo 02.png`,
          `${ASSET}/Photo 03.png`,
          `${ASSET}/Photo 04.png`,
        ];
  const targetDate = useMemo(() => eventDateTarget, [eventDateTarget]);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");

    if (to) {
      setGuestName(decodeURIComponent(to.replace(/\+/g, " ")));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      setTimeLeft({
        days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(
          2,
          "0"
        ),
        hours: String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(
          2,
          "0"
        ),
        minutes: String(Math.floor((distance / (1000 * 60)) % 60)).padStart(
          2,
          "0"
        ),
        seconds: String(Math.floor((distance / 1000) % 60)).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const fetchWishes = async () => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/rsvp_wishes?select=*&order=created_at.desc&limit=8`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setWishes(data);
      }
    } catch {
      setWishes([]);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const openInvitation = async () => {
    setIsOpened(true);

    setTimeout(() => {
      document.getElementById("cover")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 350);

    try {
      if (audioRef.current) {
        audioRef.current.volume = 0.55;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      await audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const copyBank = async (number: string) => {
    await navigator.clipboard.writeText(number);
    setCopyMessage("Nomor rekening berhasil disalin");

    setTimeout(() => {
      setCopyMessage("");
    }, 1800);
  };

  const submitRsvp = async () => {
    if (!form.name || !form.attendance || !form.message) {
      setSubmitMessage("Mohon lengkapi nama, kehadiran, dan ucapan.");
      return;
    }

    const payload = {
      name: form.name,
      whatsapp: form.whatsapp,
      attendance: form.attendance,
      message: form.message,
    };

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setWishes((prev) => [{ ...payload, created_at: new Date().toISOString() }, ...prev]);
      setSubmitMessage("Ucapan berhasil ditambahkan.");
      setForm({ name: "", whatsapp: "", attendance: "", message: "" });
      return;
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rsvp_wishes`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal submit");

      setSubmitMessage("Terima kasih, konfirmasi Anda berhasil dikirim.");
      setForm({ name: "", whatsapp: "", attendance: "", message: "" });
      fetchWishes();
    } catch {
      setSubmitMessage("Gagal mengirim. Periksa koneksi atau Supabase.");
    }
  };

  return (
    <main className={styles.page}>
      <audio ref={audioRef} src={musicSource} loop preload="auto" />

      {!isOpened && (
        <section className={styles.openingScreen}>
          <img src={sampulImage} alt="Sampul" className={styles.bg} />
          <div className={styles.overlay} />

          <div className={styles.sampulContent}>
            <p className={styles.arabic}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            <p className={styles.overline}>The Wedding Of</p>

            <h1 className={styles.names}>
              {groomName} <span>&</span> {brideName}
            </h1>

            <div className={styles.guestBox}>
              <span>Kepada Yth.</span>
              <strong>{guestName}</strong>
            </div>

            <button onClick={openInvitation} className={styles.goldButton}>
              Buka Undangan
            </button>
          </div>
        </section>
      )}

      <button onClick={toggleMusic} className={styles.musicButton}>
        {isPlaying ? "♫" : "♪"}
      </button>

      <section id="cover" className={styles.cover}>
        <img src={coverImage} alt="Cover" className={styles.bg} />
        <div className={styles.overlay} />
        <div className={styles.coverContent}>
          <p className={styles.overline}>The Wedding Of</p>
          <h1 className={styles.names}>
            Rizky <span>&</span> Nabila
          </h1>
          <p className={styles.date}>20 September 2026</p>
        </div>
      </section>

      <section className={styles.darkSection}>
        <div className={styles.quoteCard}>
          <p className={styles.arabic}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
          <p className={styles.overline}>Firman Allah SWT</p>
          <blockquote>
            “Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
            pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa
            tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan
            sayang.”
          </blockquote>
          <strong>QS. Ar-Rum : 21</strong>
          <p>
            Dengan penuh rasa syukur kepada Allah SWT dan memohon ridho-Nya,
            kami bermaksud menyelenggarakan resepsi pernikahan putra-putri kami.
            Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i
            untuk hadir memberikan doa restu.
          </p>
        </div>
      </section>

      <section className={styles.darkSection}>
        <p className={styles.overline}>Bride & Groom</p>
        <h2 className={styles.title}>Dua Jiwa, Satu Ikatan</h2>
        <div className={styles.coupleBox}>
          <img src={coupleImage} alt="Couple" />
          <div>
            <h3>{coupleNames}</h3>
            <p>Setiap momen bersamamu adalah awal dari sebuah cerita indah.</p>
          </div>
        </div>
      </section>

      <section id="mempelai" className={styles.lightSection}>
  <p className={styles.overline}>Mempelai</p>
        <h2 className={styles.titleDark}>Pasangan Mempelai</h2>

        <div className={styles.profileGrid}>
          <div className={styles.profileCard}>
            <img src={brideImage} alt="Bride" />
            <h3>Nabila Azzahra Kusumawati, S.Pd.</h3>
            <p>Putri pertama dari</p>
            <strong>Bapak H. Kusuma Wijaya & Ibu Hj. Sri Rahayu</strong>
          </div>

          <div className={styles.profileCard}>
            <img src={groomImage} alt="Groom" />
            <h3>Muhammad Rizky Pratama, S.T.</h3>
            <p>Putra kedua dari</p>
            <strong>Bapak Ir. Budi Santoso & Ibu Dewi Lestari, S.E.</strong>
          </div>
        </div>
      </section>

      <section className={styles.storySection}>
        <p className={styles.overline}>Our Story</p>
        <h2 className={styles.title}>Perjalanan Cinta Kami</h2>
        <p className={styles.storyIntro}>
          Setiap langkah adalah takdir, setiap momen adalah anugerah, dan setiap
          doa adalah penguat cinta ini.
        </p>

        <div className={styles.storyWrap}>
          {stories.map((item, index) => (
            <div
              className={styles.storyItem}
              key={item.year}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.storyYear}>{item.year}</div>
              <div className={styles.storyNode}>
                <span>{item.icon}</span>
              </div>
              <div className={styles.storyCard}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.darkSection}>
        <p className={styles.overline}>Menghitung Hari</p>
        <h2 className={styles.title}>Hari Bahagia Kami</h2>
        <p className={styles.date}>Sabtu, {eventDateText} · Bandung</p>

        <div className={styles.countdown}>
          <div>
            <strong>{timeLeft.days}</strong>
            <span>Hari</span>
          </div>
          <div>
            <strong>{timeLeft.hours}</strong>
            <span>Jam</span>
          </div>
          <div>
            <strong>{timeLeft.minutes}</strong>
            <span>Menit</span>
          </div>
          <div>
            <strong>{timeLeft.seconds}</strong>
            <span>Detik</span>
          </div>
        </div>
      </section>

      <section id="acara" className={styles.rundownSection}>
        <p className={styles.overline}>Rangkaian Acara</p>
        <h2 className={styles.title}>Jadwal Hari H</h2>

        <div className={styles.rundownLine}>
          {rundown.map((item) => (
            <div className={styles.rundownItem} key={item.title}>
              <span className={styles.diamond} />
              <div className={styles.rightBox}>
                <small>{item.time}</small>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.lightSection}>
        <p className={styles.overline}>Lokasi</p>
        <h2 className={styles.titleDark}>Tempat Acara</h2>

        <div className={styles.eventGrid}>
          <div className={styles.eventCard}>
  <h3>Akad Nikah</h3>
  <p>{akadLocation}</p>
  <strong>08.30 – 10.00 WIB</strong>
  <a href={mapsUrl} target="_blank" className={styles.goldButton}>
    Lihat Peta
  </a>
</div>

          <div className={styles.eventCard}>
  <h3>Resepsi</h3>
  <p>{receptionLocation}</p>
  <strong>12.00 – 16.00 WIB</strong>
  <a href={mapsUrl} target="_blank" className={styles.goldButton}>
    Lihat Peta
  </a>
</div>
        </div>
      </section>

      <section className={styles.darkSection}>
        <p className={styles.overline}>Dress Code</p>
        <h2 className={styles.title}>Warna yang Disarankan</h2>

        <div className={styles.dressGrid}>
          <div>🤎 Cokelat Tanah</div>
          <div>🤍 Krem Gading</div>
          <div>✨ Tembaga / Gold</div>
        </div>

        <p className={styles.note}>Hindari warna putih penuh & hitam pekat.</p>
      </section>

      <section className={styles.darkSection}>
        <p className={styles.overline}>Kenangan</p>
        <h2 className={styles.title}>Galeri Foto</h2>
        <p className={styles.storyIntro}>
          Setiap detik bersama adalah cerita yang akan kami kenang selamanya.
        </p>

        <div className={styles.gallery}>
  {galleryImages.map((photo, index) => (
    <img key={photo} src={photo} alt={`Gallery ${index + 1}`} />
  ))}
</div>
      </section>

      <section className={styles.rsvpSection}>
        <p className={styles.overline}>Konfirmasi</p>
        <h2 className={styles.title}>RSVP</h2>
        <p className={styles.storyIntro}>
          Mohon konfirmasi kehadiran Anda paling lambat 13 September 2026.
        </p>

        <form className={styles.rsvpForm}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="tel"
            placeholder="No. WhatsApp"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />

          <select
            value={form.attendance}
            onChange={(e) => setForm({ ...form, attendance: e.target.value })}
          >
            <option value="">Pilih Kehadiran</option>
            <option value="Hadir">Hadir</option>
            <option value="Tidak Hadir">Tidak Hadir</option>
            <option value="Masih Ragu">Masih Ragu</option>
          </select>

          <textarea
            placeholder="Tulis doa dan ucapan terbaik..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <button type="button" onClick={submitRsvp} className={styles.goldButton}>
            Kirim Konfirmasi
          </button>
        </form>

        {submitMessage && <p className={styles.formMessage}>{submitMessage}</p>}
      </section>

      <section className={styles.darkSection}>
        <p className={styles.overline}>Ucapan & Doa</p>
        <h2 className={styles.title}>Kata-Kata Tulus</h2>

        <div className={styles.wishList}>
          {wishes.length === 0 ? (
            <div className={styles.wishCard}>
              <strong>Dinda Maharani</strong>
              <span>Hadir</span>
              <p>
                Selamat menempuh hidup baru. Semoga menjadi keluarga yang
                sakinah, mawaddah, warahmah.
              </p>
            </div>
          ) : (
            wishes.map((wish, index) => (
              <div className={styles.wishCard} key={`${wish.name}-${index}`}>
                <strong>{wish.name}</strong>
                <span>{wish.attendance}</span>
                <p>{wish.message}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className={styles.lightSection}>
        <p className={styles.overline}>Hadiah</p>
        <h2 className={styles.titleDark}>Amplop Digital</h2>
        <p className={styles.centerText}>
          Kehadiran dan doa Anda adalah hadiah terbesar bagi kami. Namun bila
          berkenan memberikan tanda kasih, berikut informasinya.
        </p>

        <div className={styles.eventGrid}>
          <div className={styles.eventCard}>
            <h3>{bankName}</h3>
            <strong>{bankAccount}</strong>
            <p>{bankHolder}</p>
            <button
              type="button"
              onClick={() => copyBank(bankAccount)}
              className={styles.goldButton}
            >
              Salin Nomor
            </button>
          </div>
          
          <div className={styles.eventCard}>
            <h3>Bank Mandiri</h3>
            <strong>1400 0987 6543</strong>
            <p>a/n Nabila Azzahra Kusumawati</p>
            <button
              type="button"
              onClick={() => copyBank("140009876543")}
              className={styles.goldButton}
            >
              Salin Nomor
            </button>
          </div>
        </div>

        {copyMessage && <p className={styles.formMessageDark}>{copyMessage}</p>}
      </section>
      <nav className={styles.bottomNav}>
  <button onClick={() => document.getElementById("cover")?.scrollIntoView({ behavior: "smooth" })}>
    <span>⌂</span>
    Home
  </button>

  <button onClick={() => document.getElementById("mempelai")?.scrollIntoView({ behavior: "smooth" })}>
    <span>♡</span>
    Mempelai
  </button>

  <button onClick={() => document.getElementById("acara")?.scrollIntoView({ behavior: "smooth" })}>
    <span>◷</span>
    Acara
  </button>

  <button onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}>
    <span>▧</span>
    Galeri
  </button>

  <button onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}>
    <span>✉</span>
    RSVP
  </button>
</nav>

      <section className={styles.closing}>
        <h2>Rizky & Nabila</h2>
        <p>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>
        <h3>“Together is a beautiful place to be.”</h3>
        <p>#RizkyNabila2026 · 20 September 2026 · Bandung</p>
      </section>
    </main>
  );
}