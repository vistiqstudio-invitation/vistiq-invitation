"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useInvitation } from "@/components/InvitationProvider";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ASSET = "/themes/jawa-sasmaya";

function firstName(name: string, fallback: string) {
  return name.trim().split(/\s+/)[0] || fallback;
}

function instagramUrl(value: string | null) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://instagram.com/${value.replace(/^@/, "")}`;
}

function waUrl(value?: string | null) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits.startsWith("0") ? `62${digits.slice(1)}` : digits}`;
}

function Countdown({ date }: { date?: string | null }) {
  const target = useMemo(() => (date ? new Date(date).getTime() : NaN), [date]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const remaining = Number.isFinite(target) ? Math.max(0, target - now) : 0;
  const seconds = Math.floor(remaining / 1000);
  const parts = [
    [Math.floor(seconds / 86400), "Hari"],
    [Math.floor((seconds % 86400) / 3600), "Jam"],
    [Math.floor((seconds % 3600) / 60), "Menit"],
    [seconds % 60, "Detik"],
  ] as const;
  return <div className={styles.countdown}>{parts.map(([value,label]) => <div key={label}><b>{String(value).padStart(2,"0")}</b><span>{label}</span></div>)}</div>;
}

function OrnamentDivider() {
  return <div className={styles.divider} aria-hidden="true"><img src={`${ASSET}/sasmaya-cloud-cluster.webp`} alt="" /><img src={`${ASSET}/sasmaya-scallop-divider.webp`} alt="" /><img src={`${ASSET}/sasmaya-cloud-cluster.webp`} alt="" /></div>;
}

export default function JawaSasmaya({ invitation }: { invitation: InvitationData }) {
  const { opened, setOpened } = useInvitation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [form, setForm] = useState({ name: "", whatsapp: "", attendance: "Hadir" as Attendance, message: "" });
  const [formError, setFormError] = useState("");
  const rsvp = useRsvpWishes(invitation.id);
  const groom = firstName(invitation.groom.name, "Rizky");
  const bride = firstName(invitation.bride.name, "Nabila");
  const coverEvent = invitation.coverEvent || invitation.events[1] || invitation.events[0];
  const coverPhoto = invitation.coverImage || invitation.groom.photo || invitation.bride.photo || "/photos/jawa-cover.webp";
  const storyPhotos = invitation.storyPhotos || invitation.gallery;

  useEffect(() => {
    if (!opened || !audioRef.current || !invitation.musicUrl) return;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => undefined);
  }, [opened, invitation.musicUrl]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => undefined);
    else { audio.pause(); setPlaying(false); }
  };

  const submitRsvp = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim()) { setFormError("Nama dan ucapan wajib diisi."); return; }
    const result = await rsvp.submit(form);
    if (result.error) { setFormError(result.error); return; }
    setFormError(""); setForm({ name: "", whatsapp: "", attendance: "Hadir", message: "" });
  };

  return <div className={styles.root}>
    {!opened && <div className={styles.cover} style={{ backgroundImage: `linear-gradient(180deg,rgba(16,8,5,.18),rgba(16,8,5,.74)),url(${coverPhoto})` }}>
      <img className={styles.coverGunungan} src={`${ASSET}/sasmaya-gunungan-pair.webp`} alt="Ornamen gunungan Jawa" />
      <div className={styles.coverCopy}><span>The Wedding of</span><h1>{groom} <i>&amp;</i> {bride}</h1><p>{coverEvent?.date || "Minggu, 20 September 2026"}</p></div>
      <div className={styles.guest}><small>Kepada Yth. Bapak/Ibu/Saudara/i</small><strong>Nama Tamu</strong><button onClick={() => setOpened(true)}>Buka Undangan</button></div>
    </div>}

    {opened && <main>
      <section id="home" className={`${styles.section} ${styles.hero}`} style={{ backgroundImage: `linear-gradient(180deg,rgba(247,239,227,.88),rgba(247,239,227,.98)),url(${coverPhoto})` }}>
        <img className={styles.cloudLeft} src={`${ASSET}/sasmaya-cloud-double.webp`} alt="" />
        <img className={styles.cloudRight} src={`${ASSET}/sasmaya-cloud-double.webp`} alt="" />
        <p className={styles.eyebrow}>UNDANGAN PERNIKAHAN</p>
        <img className={styles.heroGunungan} src={`${ASSET}/sasmaya-gunungan-pair.webp`} alt="Ornamen gunungan Jawa" />
        <h1>{groom} <span>&amp;</span> {bride}</h1>
        <p>{coverEvent?.date}</p>
        <Countdown date={coverEvent?.rawDate} />
      </section>

      <OrnamentDivider />

      <section className={`${styles.section} ${styles.quote}`}>
        <img src={`${ASSET}/sasmaya-rose.webp`} alt="Bunga dekoratif" />
        <p>{invitation.opening.quote || "Di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa kasih dan sayang."}</p>
        <strong>{invitation.opening.quoteSource || "QS. Ar-Rum: 21"}</strong>
      </section>

      <section id="couple" className={`${styles.section} ${styles.couple}`}>
        <img className={styles.cornerGunungan} src={`${ASSET}/sasmaya-gunungan-cloud.webp`} alt="" />
        <p className={styles.script}>{invitation.opening.greeting || "Assalamu'alaikum Wr. Wb."}</p>
        <p>{invitation.opening.description || "Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia kami."}</p>
        <div className={styles.coupleGrid}>
          {[{person:invitation.groom,label:"Mempelai Pria"},{person:invitation.bride,label:"Mempelai Wanita"}].map(({person,label}) => <article className={styles.person} key={label}>
            <div className={styles.portrait}><img src={person.photo || (label === "Mempelai Pria" ? "/photos/jawa-groom.webp" : "/photos/jawa-bride.webp")} alt={`Foto ${person.name}`} /><img className={styles.portraitFrame} src={`${ASSET}/sasmaya-gunungan-pair.webp`} alt="" /></div>
            <small>{label}</small><h2>{person.name}</h2><p>{person.parents}</p>
            {person.instagram && <a href={instagramUrl(person.instagram)} target="_blank" rel="noreferrer">Instagram</a>}
          </article>)}
        </div>
      </section>

      <OrnamentDivider />

      <section id="event" className={`${styles.section} ${styles.events}`}>
        <p className={styles.script}>Save The Date</p><h2>Hari Bahagia Kami</h2>
        <div className={styles.eventGrid}>{invitation.events.map((item,index) => <article className={styles.eventCard} key={`${item.name}-${index}`}>
          <img src={`${ASSET}/sasmaya-cloud-single.webp`} alt="" /><h3>{item.name}</h3><b>{item.date}</b><p>{item.time}</p><p>{item.location}</p>
          {(invitation.mapsUrl || invitation.mapsEmbedUrl) && <a href={invitation.mapsUrl || invitation.mapsEmbedUrl || "#"} target="_blank" rel="noreferrer">Lokasi</a>}
        </article>)}</div>
        {invitation.liveStreamingUrl && <a className={styles.live} href={invitation.liveStreamingUrl} target="_blank" rel="noreferrer">Saksikan Live Streaming</a>}
      </section>

      {invitation.story.length > 0 && <section id="story" className={`${styles.section} ${styles.story}`}><p className={styles.script}>Love Story</p><div className={styles.storyList}>{invitation.story.map((item,index) => <article key={`${item.year}-${index}`}>
        <img src={storyPhotos[index] || invitation.gallery[index] || coverPhoto} alt="Momen perjalanan cinta" /><div><small>{item.year}</small><h3>{item.title}</h3><p>{item.description}</p></div>
      </article>)}</div></section>}

      {invitation.gallery.length > 0 && <section id="gallery" className={`${styles.section} ${styles.gallery}`}><p className={styles.script}>Mini Gallery</p><div>{invitation.gallery.map((photo,index) => <img src={photo} alt={`Galeri ${index+1}`} key={`${photo}-${index}`} />)}</div></section>}

      {invitation.gifts.length > 0 && <section id="gift" className={`${styles.section} ${styles.gift}`}><img src={`${ASSET}/sasmaya-gunungan-cloud.webp`} alt=""/><p className={styles.script}>Wedding Gift</p><p>Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Jika memberi adalah ungkapan tanda kasih, Anda dapat mengirimkannya melalui:</p><div className={styles.giftGrid}>{invitation.gifts.map((gift,index)=><article key={`${gift.accountNumber}-${index}`}><span>{gift.bankName || "Rekening"}</span><b>{gift.accountNumber}</b><p>a.n. {gift.accountName || gift.owner}</p><button onClick={()=>navigator.clipboard?.writeText(gift.accountNumber || "")}>Salin Nomor</button></article>)}</div>{waUrl(invitation.contactWhatsapp) && <a className={styles.confirmGift} href={waUrl(invitation.contactWhatsapp)} target="_blank" rel="noreferrer">Konfirmasi Hadiah</a>}</section>}

      <section id="rsvp" className={`${styles.section} ${styles.rsvp}`}><p className={styles.script}>RSVP &amp; Ucapan</p><p>Mohon mengisi konfirmasi kehadiran dan doa untuk kedua mempelai.</p><form onSubmit={submitRsvp}><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nama Kamu"/><input value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="Nomor WhatsApp (opsional)"/><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Berikan Ucapan & Doa"/><div className={styles.attendance}>{(["Hadir","Tidak Hadir","Masih Ragu"] as Attendance[]).map(value=><button type="button" data-active={form.attendance===value} onClick={()=>setForm({...form,attendance:value})} key={value}>{value}</button>)}</div>{formError && <p className={styles.error}>{formError}</p>}<button className={styles.submit} disabled={rsvp.submitting}>{rsvp.submitting ? "Mengirim..." : "Kirim Ucapan"}</button></form><div className={styles.wishes}>{rsvp.entries.map(entry=><article key={entry.id}><b>{entry.name}</b><span>{entry.attendance}</span><p>{entry.message}</p></article>)}{rsvp.hasMore && <button onClick={rsvp.loadMore}>Lihat Ucapan Lainnya</button>}</div></section>

      <section className={`${styles.section} ${styles.closing}`}><img src={`${ASSET}/sasmaya-gunungan-cloud.webp`} alt="Ornamen Jawa"/><p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p><strong>{invitation.closingGreeting || "Wassalamu'alaikum Wr. Wb."}</strong><h2>{groom} <span>&amp;</span> {bride}</h2></section>
      <footer className={styles.footer}>Made with ♥ by {invitation.brand?.name || "Vistiq Invitation"}</footer>
      <nav className={styles.nav}><a href="#home">⌂</a><a href="#couple">♡</a><a href="#event">◫</a><a href="#gallery">▧</a><a href="#rsvp">✉</a></nav>
      {invitation.musicUrl && <><audio ref={audioRef} src={invitation.musicUrl} loop/><button className={styles.music} onClick={toggleMusic} aria-label={playing ? "Jeda musik" : "Putar musik"}>{playing ? "♫" : "♪"}</button></>}
    </main>}
  </div>;
}
