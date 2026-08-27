"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

type IconName = "home" | "couple" | "calendar" | "gallery" | "heart" | "chat" | "gift" | "music" | "mail" | "pin" | "copy" | "play";

function Icon({ name }: { name: IconName }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "home" && <><path {...p} d="M3.5 11 12 4l8.5 7"/><path {...p} d="M5.5 10v9h13v-9M9.5 19v-5h5v5"/></>}
      {name === "couple" && <><circle {...p} cx="8" cy="8" r="2.3"/><circle {...p} cx="16" cy="8" r="2.3"/><path {...p} d="M4 19v-2.3A4.1 4.1 0 0 1 8 12.6a4 4 0 0 1 4 4V19M12 19v-2.4a4 4 0 0 1 8 0V19"/></>}
      {name === "calendar" && <><rect {...p} x="3.5" y="5" width="17" height="15" rx="2"/><path {...p} d="M7 3v4M17 3v4M3.5 9.5h17"/></>}
      {name === "gallery" && <><rect {...p} x="3.5" y="4" width="17" height="16" rx="2"/><circle {...p} cx="8" cy="9" r="1.4"/><path {...p} d="m5.5 17 4-4 3 2.5 2.5-2.7 3.5 4.2"/></>}
      {name === "heart" && <path {...p} d="M20.5 7c0 4.8-8.5 11-8.5 11S3.5 11.8 3.5 7A4 4 0 0 1 7.5 3c1.9 0 3.2 1.1 4.5 3 1.3-1.9 2.6-3 4.5-3a4 4 0 0 1 4 4Z"/>}
      {name === "chat" && <><path {...p} d="M4 5.5h16v11H9l-5 3v-14Z"/><path {...p} d="M8 10h8M8 13h5"/></>}
      {name === "gift" && <><rect {...p} x="3.5" y="9" width="17" height="11" rx="1.4"/><path {...p} d="M2.8 6.5h18.4V10H2.8zM12 6.5V20M12 6.5C8.5 6.5 7 5.5 7 3.9 7 2.7 8 2 9.1 2 10.8 2 12 4 12 6.5Zm0 0c3.5 0 5-1 5-2.6C17 2.7 16 2 14.9 2 13.2 2 12 4 12 6.5Z"/></>}
      {name === "music" && <><path {...p} d="M9 18V5l10-2v13"/><circle {...p} cx="6" cy="18" r="3"/><circle {...p} cx="16" cy="16" r="3"/></>}
      {name === "mail" && <><rect {...p} x="3" y="5.5" width="18" height="13" rx="2"/><path {...p} d="m4.5 7 7.5 6 7.5-6"/></>}
      {name === "pin" && <><path {...p} d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z"/><circle {...p} cx="12" cy="10" r="2"/></>}
      {name === "copy" && <><rect {...p} x="8" y="8" width="11" height="12" rx="2"/><path {...p} d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/></>}
      {name === "play" && <path d="m9 7 8 5-8 5V7Z" fill="currentColor"/>}
    </svg>
  );
}

function firstName(name: string, nickname?: string | null) {
  return nickname?.trim() || name.trim().split(" ")[0];
}

function dateParts(raw?: string | null) {
  const d = raw ? new Date(raw) : new Date();
  return {
    weekday: new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(d),
    date: new Intl.DateTimeFormat("id-ID", { day: "numeric" }).format(d),
    month: new Intl.DateTimeFormat("id-ID", { month: "long" }).format(d),
    year: new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(d),
  };
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .72, delay, ease }}>{children}</motion.div>;
}

function Photo({ src, alt, className = "", priority = false }: { src: string | null; alt: string; className?: string; priority?: boolean }) {
  return <div className={className}>{src && <Image src={src} alt={alt} fill sizes="(max-width:520px) 100vw, 420px" priority={priority}/>}</div>;
}

function Cover({ invitation, onOpen }: { invitation: InvitationData; onOpen: () => void }) {
  const query = useSearchParams();
  const guest = query.get("to") || "Bpk/Ibu/Saudara/i";
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const cover = invitation.coverImage || invitation.gallery[0] || invitation.bride.photo;
  return (
    <motion.section className={styles.cover} exit={{ opacity: 0, y: -40 }} transition={{ duration: .8, ease }}>
      <Photo src={cover} alt={`${bride} & ${groom}`} className={styles.coverPhoto} priority/>
      <div className={styles.coverVeil}/>
      <div className={styles.coverTopOrnament}><span/><b/><span/></div>
      <div className={styles.coverCopy}>
        <p className={styles.curvedTitle}>THE WEDDING OF</p>
        <h1>{bride} <em>&amp;</em> {groom}</h1>
        <div className={styles.coverGuest}><span>Kepada Yth.</span><strong>{guest}</strong><small>di Tempat</small></div>
        <button onClick={onOpen}><Icon name="mail"/> Buka Undangan</button>
      </div>
      <div className={styles.leafShadow}/>
    </motion.section>
  );
}

function Hero({ invitation }: { invitation: InvitationData }) {
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const p = dateParts(invitation.events[0]?.rawDate);
  const photo = invitation.gallery[0] || invitation.coverImage;
  return <section id="home" className={styles.hero}>
    <Photo src={photo} alt={`${bride} & ${groom}`} className={styles.heroPhoto}/>
    <div className={styles.heroWhitePanel}>
      <p>THE WEDDING OF</p>
      <h2>{bride} <span>&amp;</span> {groom}</h2>
      <small>{p.weekday}, {p.date} {p.month} {p.year}</small>
      <i className={styles.lineArch}/>
    </div>
  </section>;
}

function QuoteCountdown({ invitation }: { invitation: InvitationData }) {
  const event = invitation.events[0];
  const target = useMemo(() => new Date(event?.rawDate || Date.now()).getTime(), [event?.rawDate]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  const diff = Math.max(0, target - now);
  const values = [Math.floor(diff/86400000), Math.floor(diff/3600000)%24, Math.floor(diff/60000)%60, Math.floor(diff/1000)%60];
  const photos = [invitation.gallery[1], invitation.gallery[2], invitation.gallery[3]].filter(Boolean) as string[];
  const initials = `${firstName(invitation.bride.name, invitation.bride.nickname)[0] || "A"}${firstName(invitation.groom.name, invitation.groom.nickname)[0] || "H"}`;
  return <section className={styles.quoteSection}>
    <Reveal className={styles.collage}>
      <div className={styles.monogram}>{initials}</div>
      {photos.slice(0,3).map((src,i)=><Photo key={src} src={src} alt="Wedding collage" className={styles[`collagePhoto${i+1}`]}/>) }
    </Reveal>
    <Reveal className={styles.quoteCopy} delay={.08}>
      <p>“{invitation.opening.quote || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."}”</p>
      <strong>~ {invitation.opening.quoteSource || "QS. Ar-Rum : 21"} ~</strong>
      <div className={styles.quoteLine}/>
      <div className={styles.countdown}>{values.map((v,i)=><div key={i}><b>{String(v).padStart(2,"0")}</b><span>{["Hari","Jam","Menit","Detik"][i]}</span></div>)}</div>
      <button className={styles.smallButton}><Icon name="calendar"/> Save The Date</button>
    </Reveal>
  </section>;
}

function Couple({ invitation }: { invitation: InvitationData }) {
  const bridePhoto = invitation.bride.photo || invitation.gallery[2];
  const groomPhoto = invitation.groom.photo || invitation.gallery[3];
  return <section id="couple" className={styles.coupleSection}>
    <div className={styles.greeting}>
      <div className={styles.dotOrnament}>•••••• ◯ ••••••</div>
      <h3>{invitation.opening.greeting || "Assalamu’alaikum Wr. Wb."}</h3>
      <p>{invitation.opening.description || "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaaAllah kami akan menyelenggarakan acara pernikahan:"}</p>
    </div>
    <Reveal className={styles.personBlock}>
      <div className={styles.personShapeLeft}/>
      <Photo src={bridePhoto} alt={invitation.bride.name} className={styles.personPhotoLeft}/>
      <div className={styles.verticalWordRight}>THE GROOM</div>
      <div className={styles.personInfoLeft}><h3>{invitation.bride.name}</h3><p>{invitation.bride.parents}</p></div>
    </Reveal>
    <Reveal className={`${styles.personBlock} ${styles.groomBlock}`}>
      <div className={styles.personShapeRight}/>
      <div className={styles.verticalWordLeft}>THE BRIDE</div>
      <Photo src={groomPhoto} alt={invitation.groom.name} className={styles.personPhotoRight}/>
      <div className={styles.personInfoRight}><h3>{invitation.groom.name}</h3><p>{invitation.groom.parents}</p></div>
    </Reveal>
  </section>;
}

function EventCard({ event, photo, side, reverse = false }: { event: InvitationData["events"][number]; photo: string | null; side: string; reverse?: boolean }) {
  const p = dateParts(event.rawDate);
  return <Reveal className={`${styles.eventCard} ${reverse ? styles.eventReverse : ""}`}>
    <Photo src={photo} alt={event.name} className={styles.eventPhoto}/>
    <div className={styles.eventBody}>
      <div className={styles.eventSide}>{side}</div>
      <div className={styles.eventDetails}>
        <div className={styles.eventDate}><strong>{p.date}</strong><span>{p.weekday.toUpperCase()}<br/>{p.month.toUpperCase()}<br/>{p.year}</span></div>
        <hr/>
        <p>◷ &nbsp; {event.time} - Selesai</p>
        <h4>Lokasi Acara</h4>
        <b>{event.location}</b>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noreferrer"><Icon name="pin"/> Google Maps</a>
      </div>
    </div>
  </Reveal>;
}

function Events({ invitation }: { invitation: InvitationData }) {
  return <section id="event" className={styles.eventsSection}>
    <div className={styles.scriptHeading}><b>Wedding</b><em>Event</em></div>
    {invitation.events.slice(0,2).map((event,i)=><EventCard key={`${event.name}-${i}`} event={event} photo={invitation.gallery[4+i] || invitation.gallery[i]} side={i===0?"AKAD NIKAH":"RESEPSI"} reverse={i===1}/>)}
  </section>;
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const photos = invitation.gallery.slice(0,8);
  const video = invitation.videoUrl;
  return <section id="gallery" className={styles.gallerySection}>
    <div className={styles.scriptHeading}><em>Our</em><b>Gallery</b></div>
    <div className={styles.videoBox}>
      {video ? <iframe src={video} title="Wedding video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/> : <><Photo src={photos[0] || invitation.coverImage} alt="Wedding video preview" className={styles.videoPoster}/><div className={styles.videoOverlay}><span><Icon name="play"/></span><b>Our Wedding Film</b><small>YouTube</small></div></>}
    </div>
    <div className={styles.galleryGrid}>{photos.slice(1).map((src,i)=><Photo key={`${src}-${i}`} src={src} alt={`Gallery ${i+1}`} className={`${styles.galleryItem} ${i===4?styles.galleryWide:""}`}/>)}</div>
  </section>;
}

function Story({ invitation }: { invitation: InvitationData }) {
  const photo = invitation.gallery[6] || invitation.gallery[0] || invitation.coverImage;
  return <section id="story" className={styles.storySection}>
    <Photo src={photo} alt="Love story" className={styles.storyPhoto}/>
    <div className={styles.storyLabel}>LOVE STORY</div>
    <div className={styles.storyBody}>
      <div className={styles.storySide}>TRUE STORY</div>
      <div className={styles.storyList}>{invitation.story.slice(0,4).map((item,i)=><Reveal key={`${item.year}-${i}`} className={styles.storyItem} delay={i*.04}><span>♥</span><div><h4>{item.title}</h4><p>{item.description}</p></div></Reveal>)}</div>
    </div>
  </section>;
}

function Wishes({ invitation }: { invitation: InvitationData }) {
  const { entries, submit, submitting, submitted } = useRsvpWishes(invitation.id);
  const [name,setName]=useState(""); const [message,setMessage]=useState(""); const [attendance,setAttendance]=useState<Attendance>("Hadir"); const [page,setPage]=useState(1); const perPage=4; const total=Math.max(1,Math.ceil(entries.length/perPage));
  const onSubmit=async(e:FormEvent)=>{e.preventDefault(); if(!name.trim()||!message.trim()) return; await submit({name:name.trim(),whatsapp:"",attendance,message:message.trim()}); setName("");setMessage("");};
  const visible=entries.slice((page-1)*perPage,page*perPage);
  return <section id="wishes" className={styles.wishesSection}>
    <div className={styles.wishesHeading}><b>RSVP & Ucapan</b><em>Wishes</em></div>
    <Reveal className={styles.wishesCard}>
      <p>Berikan ucapan terbaik untuk kedua mempelai</p>
      <form onSubmit={onSubmit}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama Kamu"/>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Berikan Ucapan & Do’a" rows={4}/>
        <label>Konfirmasi Kehadiran ?</label>
        <div className={styles.attendance}><button type="button" className={attendance==="Hadir"?styles.selected:""} onClick={()=>setAttendance("Hadir")}>◉ Hadir</button><button type="button" className={attendance==="Tidak Hadir"?styles.selected:""} onClick={()=>setAttendance("Tidak Hadir")}>⊗ Tidak Hadir</button></div>
        <button className={styles.sendButton} disabled={submitting}>{submitting?"Mengirim...":"Send"}</button>
        {submitted&&<small className={styles.sent}>Terima kasih, ucapan Anda sudah terkirim.</small>}
      </form>
      <div className={styles.wishList}>{visible.map(e=><div className={styles.wishItem} key={e.id}><i>●</i><div><b>{e.name} {e.attendance==="Hadir"?"✓":"✕"}</b><small>{e.createdAt ? new Date(e.createdAt).toLocaleDateString("id-ID") : ""}</small><p>{e.message}</p></div></div>)}</div>
      <div className={styles.pagination}><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>←</button><span>{page}/{total}</span><button disabled={page>=total} onClick={()=>setPage(p=>p+1)}>→</button></div>
    </Reveal>
  </section>;
}

function Gift({ invitation }: { invitation: InvitationData }) {
  const first = invitation.gifts[0];
  const copy=()=>first?.accountNumber&&navigator.clipboard?.writeText(first.accountNumber);
  return <section id="gift" className={styles.giftSection}>
    <Reveal className={styles.giftCard}><div className={styles.giftIcon}><Icon name="gift"/></div><h3>Kirim Hadiah</h3><p>Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</p><button onClick={copy}><Icon name="gift"/> Amplop Digital</button>{first&&<small>{first.bankName} • {first.accountNumber}<br/>{first.accountName}</small>}</Reveal>
  </section>;
}

function Closing({ invitation }: { invitation: InvitationData }) {
  const bride=firstName(invitation.bride.name,invitation.bride.nickname); const groom=firstName(invitation.groom.name,invitation.groom.nickname); const photo=invitation.gallery[5]||invitation.gallery[0]||invitation.coverImage;
  return <section className={styles.closing}><div className={styles.closingText}><p>Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do’a restu kepada kami.</p><b>Wassalamualaikum Wr. Wb.</b></div><Photo src={photo} alt={`${bride} & ${groom}`} className={styles.closingPhoto}/><div className={styles.closingNames}><small>Kami yang berbahagia,</small><h2>{bride} <span>&amp;</span> {groom}</h2></div></section>;
}

const nav:[string,IconName][]=[["home","home"],["couple","couple"],["event","calendar"],["gallery","gallery"],["story","heart"],["wishes","chat"],["gift","mail"]];

export default function ChampagneRomance({ invitation }: { invitation: InvitationData }) {
  const [opened,setOpened]=useState(false); const [playing,setPlaying]=useState(false); const audioRef=useRef<HTMLAudioElement>(null);
  const scroll=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
  const toggleMusic=async()=>{const audio=audioRef.current;if(!audio)return;if(audio.paused){await audio.play().catch(()=>{});setPlaying(true);}else{audio.pause();setPlaying(false);}};
  const open=async()=>{setOpened(true);if(audioRef.current){await audioRef.current.play().catch(()=>{});setPlaying(!audioRef.current.paused);}};
  return <main className={styles.stage}>
    {invitation.musicUrl&&<audio ref={audioRef} src={invitation.musicUrl} loop preload="none"/>}
    <div className={styles.invitation}>
      <AnimatePresence>{!opened&&<Cover invitation={invitation} onOpen={open}/>}</AnimatePresence>
      <div className={`${styles.content} ${opened?styles.opened:""}`}><Hero invitation={invitation}/><QuoteCountdown invitation={invitation}/><Couple invitation={invitation}/><Events invitation={invitation}/><Gallery invitation={invitation}/><Story invitation={invitation}/><Wishes invitation={invitation}/><Gift invitation={invitation}/><Closing invitation={invitation}/></div>
      {opened&&<><div className={styles.sideActions}><button onClick={()=>scroll("gift")} aria-label="Gift"><Icon name="gift"/></button><button onClick={toggleMusic} aria-label="Music" className={playing?styles.playing:""}><Icon name="music"/></button></div><nav className={styles.bottomNav}>{nav.map(([id,icon])=><button key={id} onClick={()=>scroll(id)} aria-label={id}><Icon name={icon}/></button>)}</nav></>}
    </div>
  </main>;
}
