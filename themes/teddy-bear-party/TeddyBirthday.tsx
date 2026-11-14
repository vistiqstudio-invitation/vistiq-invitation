/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { useInvitation } from "@/components/InvitationProvider";
import { useCountdown } from "@/hooks/useCountdown";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import type { BirthdayInvitationData } from "@/types/birthday";
import s from "./style.module.css";

const art = "/photos/teddy-bear-party/";
function Decor({ file, className, eager = false }: { file: string; className?: string; eager?: boolean }) {
  return <img className={className} src={art + file + ".webp"} alt="" aria-hidden="true" loading={eager ? "eager" : "lazy"} />;
}

function Wishes({ id, guest }: { id: number; guest: string }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!String(data.get("guestName") || "").trim() || !String(data.get("message") || "").trim()) {
      setStatus("Isi nama dan ucapan terlebih dahulu.");
      return;
    }
    if (!id) {
      setStatus("Contoh ucapan berhasil dikirim. Demo tidak menyimpan data.");
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: id, guestName: data.get("guestName"), attendance: data.get("attendance"), message: data.get("message"), totalGuest: 1 }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Ucapan gagal dikirim.");
      form.reset();
      setStatus("Terima kasih! Ucapan dan konfirmasi kehadiranmu sudah tersimpan.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal mengirim. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  }
  return <form className={s.form} onSubmit={send}>
    <label>Nama<input name="guestName" defaultValue={guest} required maxLength={120} autoComplete="name" /></label>
    <label>Kehadiran<select name="attendance" defaultValue="" required><option value="" disabled>Pilih kehadiran</option><option value="hadir">Hadir</option><option value="tidak">Tidak hadir</option></select></label>
    <label>Ucapan<textarea name="message" required maxLength={1000} rows={4} /></label>
    <button className={s.button} disabled={busy}>{busy ? "Mengirim…" : "Kirim Ucapan"}</button>
    <p role="status" className={s.status}>{status}</p>
  </form>;
}

export default function TeddyBirthday({ invitation }: { invitation: BirthdayInvitationData }) {
  const { opened, setOpened } = useInvitation();
  const guest = useSearchParams().get("to")?.trim() || "";
  const reduced = useReducedMotion();
  const SectionReveal = reduced ? "div" : Reveal;
  const gallery = useRef<HTMLDivElement>(null);
  const { child, event, parents, opening, gifts, musicUrl, mapsUrl, mapsEmbedUrl } = invitation;
  const { audioRef, isPlaying, toggle } = useMusicPlayer(musicUrl, false);
  const [musicError, setMusicError] = useState(false);
  const rawDate = event?.rawDate;
  const date = rawDate && Number.isFinite(Date.parse(rawDate)) ? rawDate : null;
  const countdown = useCountdown(opened ? date : null);
  const map = mapsUrl || mapsEmbedUrl;
  const mapLink = map && /^https?:\/\//i.test(map) ? map : event?.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}` : null;
  const play = () => { if (musicUrl) void toggle().then(() => setMusicError(false)).catch(() => setMusicError(true)); };
  const photo = child.photo || invitation.coverImage;
  return <main className={s.root}>
    {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="none" />}
    {!opened ? <section className={s.cover}>
      <Decor file="03_bunting_flag" className={s.bunting} eager />
      <Decor file="04_cloud" className={s.coverCloud} eager />
      <span className={s.sparkle} aria-hidden="true">✦</span>
      <p className={s.eyebrow}>Birthday Party</p>
      <h1>{child.name}</h1>
      {child.age !== null && <p className={s.age}>Is Turning {child.age}</p>}
      <div className={s.scene}>
        <Decor file="02_balloon_cluster" className={s.balloons} eager />
        <Decor file="01_teddy_bear_utama" className={s.bear} eager />
      </div>
      <div className={s.guest}>
        <p>Kepada Yth.<br />Bapak/Ibu/Saudara/i</p>
        <strong>{guest || "Tamu Undangan"}</strong>
        <button className={`${s.button} ${s.open}`} onClick={() => { play(); setOpened(true); window.scrollTo(0, 0); }}>Buka Undangan <span aria-hidden="true">→</span></button>
      </div>
    </section> : <>
      {date && <section className={`${s.section} ${s.sky}`}>
        <Decor file="05_moon_stars" className={s.moon} />
        <SectionReveal><p className={s.eyebrow}>Save the Date</p><h2>Menuju Hari Bahagia</h2>
        <div className={s.countdown}>{([["Hari", countdown.days], ["Jam", countdown.hours], ["Menit", countdown.minutes], ["Detik", countdown.seconds]] as const).map(([label, value]) => <div key={label}><strong>{String(value).padStart(2,"0")}</strong><span>{label}</span></div>)}</div></SectionReveal>
      </section>}
      <section className={s.section}>
        <SectionReveal><p className={s.eyebrow}>Si Kecil yang Berbahagia</p><h2>Hallo, Aku {child.name}</h2>
        <div className={s.frame}>
          {photo ? <img className={s.portrait} src={photo} alt={child.name} loading="lazy" /> : <Decor file="01_teddy_bear_utama" className={s.placeholder} />}
          <Decor file="08_photo_frame" className={s.frameArt} />
        </div>
        {child.age !== null && <p className={s.lead}>Aku akan berulang tahun yang ke-{child.age}</p>}
        {opening.description && <p>{opening.description}</p>}
        {[parents.father, parents.mother].some(Boolean) && <p className={s.parents}>Putra/putri dari {[parents.father, parents.mother].filter(Boolean).join(" & ")}</p>}
        </SectionReveal>
      </section>
      {event && <section className={`${s.section} ${s.sky}`}>
        <SectionReveal><p className={s.eyebrow}>Waktu &amp; Tempat</p><article className={s.card}>
          <Decor file="07_birthday_cake" className={s.cake} /><h2>Birthday Party</h2>
          {event.date && <p className={s.lead}>{event.date}</p>}{event.time && <p>{event.time}</p>}{event.location && <p>{event.location}</p>}
          {mapLink && <a className={s.button} href={mapLink} target="_blank" rel="noopener noreferrer">Lihat Lokasi</a>}
        </article></SectionReveal>
      </section>}
      {invitation.gallery.length > 0 && <section className={s.section}>
        <SectionReveal><Decor file="04_cloud" className={s.galleryCloud} /><p className={s.eyebrow}>Sweet Memories</p><h2>Galeri Foto</h2>
          <div ref={gallery} className={s.gallery} tabIndex={0} aria-label="Galeri foto, geser untuk melihat">
            {invitation.gallery.map((item, i) => <img src={item} key={`${item}-${i}`} alt={invitation.id ? `Foto ${child.name} ${i + 1}` : `Dekorasi pesta ${i + 1}`} loading="lazy" />)}
          </div>
          {invitation.gallery.length > 1 && <div className={s.arrows}>{[-1,1].map(direction => <button type="button" key={direction} aria-label={direction === -1 ? "Foto sebelumnya" : "Foto berikutnya"} onClick={() => gallery.current?.scrollBy({left: direction * gallery.current.clientWidth * .8, behavior: reduced ? "auto" : "smooth"})}>{direction === -1 ? "‹" : "›"}</button>)}</div>}
        </SectionReveal>
      </section>}
      <section className={`${s.section} ${s.sky}`}>
        <SectionReveal><p className={s.eyebrow}>RSVP</p><h2>Ucapan &amp; Doa</h2><Wishes id={invitation.id} guest={guest} /></SectionReveal>
      </section>
      {gifts.length > 0 && <section className={s.section}>
        <SectionReveal><Decor file="06_gift_boxes" className={s.cake} /><h2>Birthday Gift</h2>
          {gifts.map((gift, i) => <div className={s.card} key={i}><p className={s.lead}>{gift.bankName}</p><p>{gift.accountNumber}</p><p>{gift.accountName}</p></div>)}
        </SectionReveal>
      </section>}
      <footer className={`${s.section} ${s.footer}`}>
        <SectionReveal><Decor file="11_ribbon_banner" className={s.ribbon} /><h2>Thank You</h2><p>Terima kasih sudah menjadi bagian dari hari spesialku.</p><p className={s.lead}>{child.name}</p>
        <Decor file="10_footer_teddy" className={s.footerBear} /></SectionReveal>
        <Decor file="09_cloud_border" className={s.cloudBorder} /><p className={s.credit}>{invitation.brand?.name || "Vistiq Invitation"}</p>
      </footer>
      {musicUrl && <button type="button" className={s.music} aria-label={isPlaying ? "Jeda musik" : "Putar musik"} onClick={play}>{isPlaying ? "Ⅱ" : "♪"}</button>}
      {musicError && <p className={s.musicError} role="status">Musik belum bisa diputar.</p>}
    </>}
  </main>;
}
