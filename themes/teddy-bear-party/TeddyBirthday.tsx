/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { invitationCopy } from "@/lib/invitationCopy";
import Reveal from "@/components/Reveal";
import { useInvitation } from "@/components/InvitationProvider";
import { useCountdown } from "@/hooks/useCountdown";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import type { BirthdayInvitationData } from "@/types/birthday";
import s from "./style.module.css";
import safariStyles from "./safari.module.css";
import space from "./astronaut.module.css";
import pink from "./butterfly.module.css";


function Decor({ file, className, folder, eager = false }: { file: string; className?: string; folder: string; eager?: boolean }) {
  return <img className={className} src={`/photos/${folder}/${file}.webp`} alt="" aria-hidden="true" loading={eager ? "eager" : "lazy"} />;
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

function CopyGift({ value, label }: { value: string; label: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Berhasil disalin.");
    } catch {
      setStatus("Tidak bisa menyalin otomatis. Salin teks di atas secara manual.");
    }
  }
  return <><button className={s.button} type="button" onClick={copy}>{label}</button>
    <p role="status" className={s.status}>{status}</p></>;
}

export default function TeddyBirthday({ invitation }: { invitation: BirthdayInvitationData }) {
  const { opened, setOpened } = useInvitation();
  const safari = invitation.theme === "little-safari-party";
  const astronaut = invitation.theme === "little-astronaut-party";
  const butterfly = invitation.theme === "pink-butterfly-bow-party";
  const nabilaNadila = invitation.slug === "ulang-tahun-putri-nabila-botutihe-dan-putri-nadila-botutihe";
  const folder = butterfly || astronaut || safari ? invitation.theme : "teddy-bear-party";
  const character = butterfly ? "01_butterfly_bow_main" : astronaut ? "01_astronaut_boy" : safari ? "01_safari_animals" : "01_teddy_bear_utama";
  const guest = useSearchParams().get("to")?.trim() || "";
  const reduced = useReducedMotion();
  const SectionReveal = reduced ? "div" : Reveal;
  const gallery = useRef<HTMLDivElement>(null);
  const { child, event, parents, opening, gifts, musicUrl, mapsUrl, mapsEmbedUrl } = invitation;
  const celebrationName = nabilaNadila ? "Nabila Botutihe dan Nadila Botutihe" : child.name;
  const { audioRef, isPlaying, toggle } = useMusicPlayer(musicUrl, false);
  const [musicError, setMusicError] = useState(false);
  const rawDate = event?.rawDate;
  const date = rawDate && Number.isFinite(Date.parse(rawDate)) ? rawDate : null;
  const countdown = useCountdown(opened ? date : null);
  const map = mapsUrl || mapsEmbedUrl;
  const mapLink = map && /^https?:\/\//i.test(map) ? map : event?.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}` : null;
  const play = () => { if (musicUrl) void toggle().then(() => setMusicError(false)).catch(() => setMusicError(true)); };
  const photo = child.photo || invitation.coverImage;
  return <main className={`${s.root} ${safari ? safariStyles.safari : astronaut ? space.root : butterfly ? pink.root : ""}`} data-safari-theme={safari || undefined} data-astronaut-theme={astronaut || undefined} data-butterfly-theme={butterfly || undefined}>
    {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="none" />}
    {!opened ? <section className={`${s.cover} ${astronaut ? space.cover : butterfly ? pink.cover : ""}`} data-safari-cover={safari || undefined} data-nabila-cover={nabilaNadila || undefined}>
      {safari && <>
        <Decor folder={folder} file="05_tropical_leaves" className={safariStyles.leafLeft} eager />
        <Decor folder={folder} file="05_tropical_leaves" className={safariStyles.leafRight} eager />
      </>}
      {astronaut ? <>
        <Decor folder={folder} file="04_cloud_moon_stars" className={space.coverMoon} eager />
        <Decor folder={folder} file="03_planets" className={space.coverPlanets} eager />
        <Decor folder={folder} file="02_rocket" className={space.rocket} eager />
      </> : <>
        <Decor folder={folder} file={butterfly ? "03_bunting_bow" : "03_bunting_flag"} className={s.bunting} eager />
        <Decor folder={folder} file={butterfly ? "04_butterflies" : "04_cloud"} className={butterfly ? pink.coverFlutter : s.coverCloud} eager />
      </>}
      <span className={s.sparkle} aria-hidden="true">✦</span>
      <p className={s.eyebrow}>{nabilaNadila ? "Undangan Ulang Tahun" : "Birthday Party"}</p>
      {nabilaNadila && <p>Kami mengundang teman-teman untuk merayakan hari ulang tahun kami:</p>}
      <h1>{celebrationName}</h1>
      {nabilaNadila ? <p className={s.age}>Yang ke 10 Tahun</p> : child.age !== null && <p className={s.age}>Is Turning {child.age}</p>}
      {nabilaNadila && photo ? (
        <div className={`${s.frame} ${pink.frame} ${pink.coverPhotoFrame}`}>
          <img className={`${s.portrait} ${pink.portrait}`} src={photo} alt="Nabila dan Nadila" loading="eager" />
          <Decor folder={folder} file="08_photo_frame" className={s.frameArt} eager />
          <Decor folder={folder} file="05_flower_cluster" className={pink.profileFlowers} eager />
        </div>
      ) : (
        <div className={`${s.scene} ${astronaut ? space.scene : butterfly ? pink.scene : ""}`}>
          <Decor folder={folder} file={butterfly ? "02_balloon_cluster_pink" : astronaut ? "05_balloon_cluster" : "02_balloon_cluster"} className={`${s.balloons} ${astronaut ? space.balloons : butterfly ? pink.balloons : ""}`} eager />
          <Decor folder={folder} file={character} className={`${s.bear} ${safari ? safariStyles.animals : astronaut ? space.astronaut : butterfly ? pink.bow : ""}`} eager />
        </div>
      )}
      <div className={s.guest}>
        <p>Kepada Yth.<br />Bapak/Ibu/Saudara/i</p>
        <strong>{guest || "Tamu Undangan"}</strong>
        <button className={`${s.button} ${s.open}`} onClick={() => { play(); setOpened(true); window.scrollTo(0, 0); }}>Buka Undangan <span aria-hidden="true">→</span></button>
      </div>
      {safari && <Decor folder={folder} file="09_jungle_border" className={safariStyles.coverBorder} />}
    </section> : <>
      {date && <section className={`${s.section} ${s.sky}`}>
        <Decor folder={folder} file={butterfly ? "04_butterflies" : astronaut ? "04_cloud_moon_stars" : safari ? "04_cloud" : "05_moon_stars"} className={butterfly ? pink.countdownFlutter : s.moon} />
        <SectionReveal><p className={s.eyebrow}>{nabilaNadila ? "Catat Tanggalnya" : "Save the Date"}</p><h2>{nabilaNadila ? "Pesta Ulang Tahun Nabila & Nadila" : "Menuju Hari Bahagia"}</h2>
        <div className={s.countdown}>{([["Hari", countdown.days], ["Jam", countdown.hours], ["Menit", countdown.minutes], ["Detik", countdown.seconds]] as const).map(([label, value]) => <div key={label}><strong>{String(value).padStart(2,"0")}</strong><span>{label}</span></div>)}</div></SectionReveal>
      </section>}
      <section className={s.section}>
        <SectionReveal><p className={s.eyebrow}>{nabilaNadila ? "Kami yang Berbahagia" : "Si Kecil yang Berbahagia"}</p><h2>{nabilaNadila ? celebrationName : `Hallo, Aku ${child.name}`}</h2>
        <div className={`${s.frame} ${safari ? safariStyles.frame : astronaut ? space.frame : butterfly ? pink.frame : ""}`}>
          {photo ? <img className={`${s.portrait} ${safari ? safariStyles.portrait : astronaut ? space.portrait : butterfly ? pink.portrait : ""}`} src={photo} alt={child.name} loading="lazy" /> : <Decor folder={folder} file={character} className={s.placeholder} />}
          <Decor folder={folder} file="08_photo_frame" className={s.frameArt} />
          {butterfly && <Decor folder={folder} file="05_flower_cluster" className={pink.profileFlowers} />}
        </div>
        {nabilaNadila ? <p className={s.lead}>Yang ke 10 Tahun</p> : child.age !== null && <p className={s.lead}>Aku akan berulang tahun yang ke-{child.age}</p>}
        {nabilaNadila ? <p>Kami mengundang teman-teman untuk merayakan hari ulang tahun kami.</p> : <p>{opening.description?.trim() ? opening.description : invitationCopy.birthday.openingDescription}</p>}
        {!nabilaNadila && [parents.father, parents.mother].some(Boolean) && <p className={s.parents}>{butterfly ? "Putri dari" : "Putra/putri dari"} {[parents.father, parents.mother].filter(Boolean).join(" & ")}</p>}
        </SectionReveal>
      </section>
      {event && <section className={`${s.section} ${s.sky}`}>
        <SectionReveal><p className={s.eyebrow}>Waktu &amp; Tempat</p><article className={s.card}>
          <Decor folder={folder} file="07_birthday_cake" className={`${s.cake} ${safari ? safariStyles.pop : ""}`} /><h2>{nabilaNadila ? "Undangan Ulang Tahun" : "Birthday Party"}</h2>
          {event.date && <p className={s.lead}>{event.date}</p>}{event.time && <p>{event.time}</p>}{event.location && <p>{event.location}</p>}{event.address && <p>{event.address}</p>}
          {mapLink && <a className={s.button} href={mapLink} target="_blank" rel="noopener noreferrer">Lihat Lokasi</a>}
        </article></SectionReveal>
      </section>}
      {invitation.gallery.length > 0 && <section className={s.section}>
        <SectionReveal><Decor folder={folder} file={butterfly ? "05_flower_cluster" : astronaut ? "03_planets" : safari ? "05_tropical_leaves" : "04_cloud"} className={s.galleryCloud} /><p className={s.eyebrow}>Sweet Memories</p><h2>Galeri Foto</h2>
          {butterfly && <Decor folder={folder} file="04_butterflies" className={pink.galleryFlutter} />}
          <div ref={gallery} className={s.gallery} tabIndex={0} aria-label="Galeri foto, geser untuk melihat">
            {invitation.gallery.map((item, i) => <img src={item} key={`${item}-${i}`} alt={`Foto ${child.name} ${i + 1}`} loading="lazy" />)}
          </div>
          {invitation.gallery.length > 1 && <div className={s.arrows}>{[-1,1].map(direction => <button type="button" key={direction} aria-label={direction === -1 ? "Foto sebelumnya" : "Foto berikutnya"} onClick={() => gallery.current?.scrollBy({left: direction * gallery.current.clientWidth * .8, behavior: reduced ? "auto" : "smooth"})}>{direction === -1 ? "‹" : "›"}</button>)}</div>}
        </SectionReveal>
      </section>}
      <section className={`${s.section} ${s.sky}`}>
        <SectionReveal><p className={s.eyebrow}>RSVP</p><h2>Ucapan &amp; Doa</h2><Wishes id={invitation.id} guest={guest} /></SectionReveal>
      </section>
      {(gifts.some(gift => Boolean(gift.accountNumber)) || invitation.giftShipping) && <section className={s.section}>
        <SectionReveal><Decor folder={folder} file="06_gift_boxes" className={`${s.cake} ${safari ? safariStyles.pop : ""}`} /><h2>Birthday Gift</h2>
          <p>Kehadiran dan doa sudah jadi hadiah terindah.</p>
          {invitation.id === 0 && <p className={s.status}>Rekening dan alamat ini hanya contoh. Jangan gunakan untuk transfer atau pengiriman.</p>}
          {gifts.map((gift, i) => gift.accountNumber && <article className={s.card} key={i}>
            <h3>Transfer Hadiah</h3>
            {gift.bankName && <p className={s.lead}>{gift.bankName}</p>}
            <p>{gift.accountNumber}</p>
            {gift.accountName && <p>a.n. {gift.accountName}</p>}
            <CopyGift value={gift.accountNumber} label={nabilaNadila ? "Salin Nomor" : "Salin Nomor Rekening"} />
          </article>)}
          {invitation.giftShipping && <article className={s.card}>
            <h3>Kirim Kado</h3>
            <p className={s.lead}>{invitation.giftShipping.recipient}</p>
            <p style={{ whiteSpace: "pre-line" }}>{invitation.giftShipping.address}</p>
            <CopyGift value={invitation.giftShipping.address} label="Salin Alamat" />
          </article>}
        </SectionReveal>
      </section>}
      <footer className={`${s.section} ${s.footer} ${astronaut ? space.footer : butterfly ? pink.footer : ""}`}>
        <SectionReveal>{astronaut ? <div className={space.farewell}>
          <Decor folder={folder} file="09_space_border" className={space.spaceBorder} />
          <h2 className={space.ribbonTitle}><Decor folder={folder} file="11_ribbon_banner" />Thank You</h2>
          <p>Terima kasih sudah menjadi bagian dari petualangan kecilku di hari spesial ini.</p><p className={s.lead}>{child.name}</p>
        </div> : butterfly ? <>
          <h2 className={nabilaNadila ? undefined : pink.ribbonTitle}>{!nabilaNadila && <Decor folder={folder} file="11_ribbon_banner" />}{nabilaNadila ? "Sampai Jumpa!" : "Thank You"}</h2>
          <p>{nabilaNadila ? "Jangan lupa hadir ya teman-teman... Kehadiran kalian sangat berarti bagi kami ♡" : "Terima kasih sudah menjadi bagian dari hari spesialku. Kehadiran dan doamu membuat hariku semakin indah."}</p><p className={s.lead}>{nabilaNadila ? celebrationName : child.name}</p>
        </> : <><Decor folder={folder} file="11_ribbon_banner" className={s.ribbon} /><h2>Thank You</h2><p>Terima kasih sudah menjadi bagian dari hari spesialku.</p><p className={s.lead}>{child.name}</p></>}
        <Decor folder={folder} file={butterfly ? "10_footer_butterfly" : astronaut ? "10_footer_space" : safari ? "10_footer_safari" : "10_footer_teddy"} className={s.footerBear} /></SectionReveal>
        {!astronaut && <Decor folder={folder} file={butterfly ? "09_butterfly_border" : safari ? "09_jungle_border" : "09_cloud_border"} className={butterfly ? pink.footerBorder : s.cloudBorder} />}<p className={s.credit}>{invitation.brand?.name || "Vistiq Invitation"}</p>
      </footer>
      {musicUrl && <button type="button" className={s.music} aria-label={isPlaying ? "Jeda musik" : "Putar musik"} onClick={play}>{isPlaying ? "Ⅱ" : "♪"}</button>}
      {musicError && <p className={s.musicError} role="status">Musik belum bisa diputar.</p>}
    </>}
  </main>;
}
