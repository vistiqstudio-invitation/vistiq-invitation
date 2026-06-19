import { supabase } from "../../lib/supabase";
import Countdown from "../../components/Countdown";
import MusicPlayer from "../../components/MusicPlayer";
import RsvpForm from "../../components/RsvpForm";
import WishForm from "../../components/WishForm";
import styles from "./style.module.css";
import OpeningScreen from "../../components/OpeningScreen";

export default async function Invitation({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: invitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!invitation) return <h1>Undangan tidak ditemukan</h1>;

  const { data: banks } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("invitation_id", invitation.id);

  const { data: wishes } = await supabase
    .from("wishes")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false });

  const galleries = [
    invitation.gallery_1,
    invitation.gallery_2,
    invitation.gallery_3,
    invitation.gallery_4,
  ].filter(Boolean);

  return (
    <main className={styles.page}>
  <OpeningScreen
    groomName={invitation.groom_name}
    brideName={invitation.bride_name}
    eventDate={invitation.event_date}
  />

  <MusicPlayer url={invitation.music_url} />

      <section
        className={styles.cover}
        style={{ backgroundImage: `url(${invitation.cover_image})` }}
      >
        <div className={styles.coverOverlay}>
          <p className={styles.smallText}>THE WEDDING OF</p>
          <h1 className={styles.coverNames}>
            {invitation.groom_name}
            <span>&</span>
            {invitation.bride_name}
          </h1>
          <p className={styles.date}>{invitation.event_date}</p>
          <a href="#opening" className={styles.primaryButton}>
            Buka Undangan
          </a>
        </div>
      </section>

      <section id="opening" className={styles.section}>
        <div className={styles.archCard}>
          <p className={styles.smallText}>ASSALAMU'ALAIKUM</p>
          <h2>Dengan Rahmat Allah SWT</h2>
          <p>
            Assalamu’alaikum Warahmatullahi Wabarakatuh.
            <br />
            <br />
            Tanpa mengurangi rasa hormat, kami mengundang
            Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.
          </p>
          <blockquote>
            “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
            untukmu pasangan hidup agar kamu merasa tenteram kepadanya.”
            <br />
            <strong>QS. Ar-Rum: 21</strong>
          </blockquote>
        </div>
      </section>

      <section id="couple" className={styles.section}>
        <p className={styles.smallText}>BRIDE & GROOM</p>
        <h2 className={styles.title}>Mempelai</h2>

        <div className={styles.coupleGrid}>
          <div className={styles.profileCard}>
            {invitation.groom_photo && (
              <img
                src={invitation.groom_photo}
                alt={invitation.groom_name}
                className={styles.couplePhoto}
              />
            )}
            <h3>{invitation.groom_name}</h3>
            <p>Putra dari</p>
            <strong>{invitation.groom_parent}</strong>
          </div>

          <div className={styles.andSymbol}>&</div>

          <div className={styles.profileCard}>
            {invitation.bride_photo && (
              <img
                src={invitation.bride_photo}
                alt={invitation.bride_name}
                className={styles.couplePhoto}
              />
            )}
            <h3>{invitation.bride_name}</h3>
            <p>Putri dari</p>
            <strong>{invitation.bride_parent}</strong>
          </div>
        </div>
      </section>

      <section id="countdown" className={styles.section}>
        <p className={styles.smallText}>WEDDING DAY</p>
        <h2 className={styles.title}>Menuju Hari Bahagia</h2>
        <Countdown date={invitation.akad_date || invitation.event_date} />
      </section>

      <section id="event" className={styles.section}>
        <p className={styles.smallText}>DETAIL ACARA</p>
        <h2 className={styles.title}>Akad & Resepsi</h2>

        <div className={styles.eventCard}>
          <h3>Akad Nikah</h3>
          <p>{invitation.event_date}</p>
          <strong>{invitation.akad_time}</strong>
          <p>{invitation.akad_location || invitation.location}</p>
          <a
            href={invitation.maps_url}
            target="_blank"
            className={styles.primaryButton}
          >
            Lihat Lokasi
          </a>

          <div className={styles.divider} />

          <h3>Resepsi</h3>
          <p>{invitation.event_date}</p>
          <strong>{invitation.reception_time}</strong>
          <p>{invitation.resepsi_location || invitation.location}</p>
          <a
            href={invitation.maps_url}
            target="_blank"
            className={styles.primaryButton}
          >
            Lihat Lokasi
          </a>
        </div>
      </section>

      <section id="story" className={styles.section}>
        <p className={styles.smallText}>OUR STORY</p>
        <h2 className={styles.title}>Love Story</h2>

        <div className={styles.timeline}>
          {[1, 2, 3].map((n) => (
            <div className={styles.timelineItem} key={n}>
              <span>{n}</span>
              <h3>{invitation[`story_${n}_title`]}</h3>
              <p>{invitation[`story_${n}_desc`]}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className={styles.section}>
        <p className={styles.smallText}>GALLERY</p>
        <h2 className={styles.title}>Momen Bahagia</h2>

        <div className={styles.gallery}>
          {galleries.map((img, index) => (
            <img key={index} src={img} alt={`Gallery ${index + 1}`} />
          ))}
        </div>
      </section>

      <section id="wishes" className={styles.section}>
        <p className={styles.smallText}>DOA & UCAPAN</p>
        <h2 className={styles.title}>Kirim Doa Terbaik</h2>

        <WishForm invitationId={invitation.id} />

        <div className={styles.wishList}>
          {wishes?.map((wish) => (
            <div className={styles.wishCard} key={wish.id}>
              <strong>{wish.guest_name}</strong>
              <p>{wish.message}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="rsvp" className={styles.section}>
        <p className={styles.smallText}>RSVP</p>
        <h2 className={styles.title}>Konfirmasi Kehadiran</h2>
        <RsvpForm invitationId={invitation.id} />
      </section>

      <section id="gift" className={styles.section}>
        <p className={styles.smallText}>WEDDING GIFT</p>
        <h2 className={styles.title}>Amplop Digital</h2>

        <div className={styles.giftBox}>
          <p>
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
            Namun jika memberi adalah ungkapan tanda kasih, Anda dapat
            memberikan hadiah secara cashless.
          </p>

          {banks?.map((bank) => (
            <div className={styles.bankCard} key={bank.id}>
              <img
                src={
                  bank.bank_name?.toLowerCase().includes("bca")
                    ? "/banks/BCA.png"
                    : bank.bank_name?.toLowerCase().includes("mandiri")
                    ? "/banks/Mandiri.png"
                    : "/banks/default-bank.png"
                }
                alt={bank.bank_name}
                className={styles.bankLogo}
              />

              <p>a.n {bank.account_holder}</p>
              <strong>{bank.account_number}</strong>

              <button className={styles.copyButton}>
                📋 Salin Nomor Rekening
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="adab" className={styles.section}>
        <p className={styles.smallText}>WEDDING ETIQUETTE</p>
        <h2 className={styles.title}>Adab Menghadiri Acara</h2>

        <div className={styles.etiquetteCard}>
          <p>
            Untuk menjaga acara pernikahan berlangsung dalam keadaan yang penuh
            keberkahan, mohon memperhatikan adab dalam menghadiri acara.
          </p>

          <div className={styles.etiquetteGrid}>
            <div>
              <span>🤝</span>
              <p>Tidak Bergunjing</p>
            </div>
            <div>
              <span>👔</span>
              <p>Berpakaian Sopan</p>
            </div>
            <div>
              <span>🕌</span>
              <p>Memperhatikan Waktu Sholat</p>
            </div>
            <div>
              <span>🤲</span>
              <p>Mendoakan Pengantin</p>
            </div>
            <div>
              <span>🍽️</span>
              <p>Tidak Mubazir</p>
            </div>
            <div>
              <span>🪑</span>
              <p>Duduk Saat Makan</p>
            </div>
          </div>
        </div>
      </section>

      <section id="family" className={styles.section}>
        <p className={styles.smallText}>TURUT MENGUNDANG</p>
        <h2 className={styles.title}>Keluarga Besar</h2>

        <div className={styles.familyCard}>
          <p>
            Atas kehadiran dan doa restunya kami ucapkan terima kasih.
            Kami yang berbahagia, keluarga besar kedua mempelai.
          </p>

          <h3>
            {invitation.groom_name} & {invitation.bride_name}
          </h3>

          <div className={styles.familyBlock}>
            <p>Keluarga Besar</p>
            <strong>{invitation.groom_name}</strong>
            <span>Putra dari {invitation.groom_parent}</span>
          </div>

          <div className={styles.familyBlock}>
            <p>Keluarga Besar</p>
            <strong>{invitation.bride_name}</strong>
            <span>Putri dari {invitation.bride_parent}</span>
          </div>

          <div className={styles.invitedBy}>
            <p>Turut Mengundang:</p>
            <span>Keluarga besar kedua mempelai dan seluruh keluarga lainnya.</span>
          </div>
        </div>
      </section>

      <section className={styles.closing}>
        <h2>Terima Kasih</h2>
        <p>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>
        <h3>
          {invitation.groom_name} & {invitation.bride_name}
        </h3>
      </section>

      <nav className={styles.nav}>
        <a href="#opening">✉</a>
        <a href="#couple">♡</a>
        <a href="#event">📅</a>
        <a href="#wishes">✎</a>
        <a href="#gift">🎁</a>
      </nav>
    </main>
  );
}