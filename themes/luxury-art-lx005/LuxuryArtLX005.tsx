"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

type IconName = "home" | "couple" | "calendar" | "gallery" | "heart" | "chat" | "gift" | "music" | "envelope" | "pin" | "copy" | "instagram";

function Icon({ name }: { name: IconName }) {
  const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.65, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "home" && <><path {...line} d="M3.5 11 12 4l8.5 7"/><path {...line} d="M5.5 10v9h13v-9M9.5 19v-5h5v5"/></>}
      {name === "couple" && <><circle {...line} cx="8" cy="8" r="2.3"/><circle {...line} cx="16" cy="8" r="2.3"/><path {...line} d="M3.8 19v-2.2A4.2 4.2 0 0 1 8 12.6a4 4 0 0 1 4 4V19M12 19v-2.4a4 4 0 0 1 8 0V19"/></>}
      {name === "calendar" && <><rect {...line} x="3.5" y="5" width="17" height="15" rx="2"/><path {...line} d="M7 3v4M17 3v4M3.5 9.5h17M8 13h3v3H8z"/></>}
      {name === "gallery" && <><rect {...line} x="3.5" y="4" width="17" height="16" rx="2"/><circle {...line} cx="8.5" cy="9" r="1.5"/><path {...line} d="m5.5 17 4.2-4 2.7 2.4 2.6-2.7 3.5 4.3"/></>}
      {name === "heart" && <path {...line} d="M20.7 6.8c0 5-8.7 11.3-8.7 11.3S3.3 11.8 3.3 6.8C3.3 4.7 5 3 7.2 3c1.9 0 3.2 1 4.8 3 1.6-2 2.9-3 4.8-3 2.2 0 3.9 1.7 3.9 3.8Z"/>}
      {name === "chat" && <><path {...line} d="M4 5.5h16v11H9l-5 3v-14Z"/><path {...line} d="M8 10h8M8 13h5"/></>}
      {name === "gift" && <><rect {...line} x="3.5" y="9" width="17" height="11" rx="1.5"/><path {...line} d="M2.8 6.5h18.4V10H2.8zM12 6.5V20M12 6.5C8.5 6.5 7 5.5 7 3.9 7 2.7 8 2 9.1 2 10.8 2 12 4 12 6.5Zm0 0c3.5 0 5-1 5-2.6C17 2.7 16 2 14.9 2 13.2 2 12 4 12 6.5Z"/></>}
      {name === "music" && <><path {...line} d="M9 18V5l10-2v13"/><circle {...line} cx="6" cy="18" r="3"/><circle {...line} cx="16" cy="16" r="3"/></>}
      {name === "envelope" && <><rect {...line} x="3" y="5.5" width="18" height="13" rx="2.2"/><path {...line} d="m4.5 7 7.5 6 7.5-6"/></>}
      {name === "pin" && <><path {...line} d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z"/><circle {...line} cx="12" cy="10" r="2"/></>}
      {name === "copy" && <><rect {...line} x="8" y="8" width="11" height="12" rx="2"/><path {...line} d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/></>}
      {name === "instagram" && <><rect {...line} x="4" y="4" width="16" height="16" rx="5"/><circle {...line} cx="12" cy="12" r="3.5"/><circle cx="17.3" cy="6.8" r="1" fill="currentColor"/></>}
    </svg>
  );
}

function firstName(name: string, nickname?: string | null) {
  return nickname?.trim() || name.trim().split(" ")[0];
}

function dateParts(raw: string | null | undefined) {
  const d = raw ? new Date(raw) : new Date();
  return {
    day: new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(d),
    date: new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(d),
    month: new Intl.DateTimeFormat("id-ID", { month: "long" }).format(d),
    year: new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(d),
  };
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .78, delay, ease }}>{children}</motion.div>;
}

function Flora({ position }: { position: "tl" | "tr" | "bl" | "br" | "center" }) {
  return <div className={`${styles.flora} ${styles[`flora_${position}`]}`} aria-hidden="true"><i/><i/><i/><b/><b/></div>;
}

function GardenHorizon({ deep = false }: { deep?: boolean }) {
  return <div className={`${styles.horizon} ${deep ? styles.horizonDeep : ""}`} aria-hidden="true"><i className={styles.cloudOne}/><i className={styles.cloudTwo}/><i className={styles.hillOne}/><i className={styles.hillTwo}/><i className={styles.shrubOne}/><i className={styles.shrubTwo}/></div>;
}

function PortraitArch({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  return <div className={`${styles.portraitArch} ${className}`}><div className={styles.portraitArchInner}>{src && <Image src={src} alt={alt} fill sizes="(max-width: 540px) 78vw, 370px"/>}</div><Flora position="bl"/><Flora position="tr"/></div>;
}

function Cover({ invitation, onOpen, staticMode = false }: { invitation: InvitationData; onOpen: () => void; staticMode?: boolean }) {
  const query = useSearchParams();
  const guest = query.get("to") || "Bapak/Ibu/Saudara/i";
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const photo = invitation.coverImage || invitation.gallery[0] || invitation.bride.photo || invitation.groom.photo;
  const parts = dateParts(invitation.events[0]?.rawDate || invitation.events[0]?.date);
  const body = (
    <section className={styles.cover}>
      <div className={styles.coverGlow}/><GardenHorizon deep/>
      <div className={styles.coverTopFlora}><Flora position="tl"/><Flora position="tr"/></div>
      <div className={styles.coverHeading}><p>The Wedding Of</p><h1><em>{bride}</em><span>&amp;</span><em>{groom}</em></h1></div>
      <div className={styles.coverPortrait}><PortraitArch src={photo} alt={`${bride} & ${groom}`}/></div>
      <div className={styles.coverDate}><span>{parts.day}</span><strong>{parts.date}</strong><span>{parts.month} {parts.year}</span></div>
      <div className={styles.coverGuest}><small>Kepada Yth.</small><strong>{guest}</strong><p>Mohon maaf apabila ada kesalahan penulisan nama/gelar</p><button type="button" onClick={onOpen}><Icon name="envelope"/> Buka Undangan</button></div>
      <div className={styles.coverBottomFlora}><Flora position="bl"/><Flora position="br"/></div>
    </section>
  );
  if (staticMode) return body;
  return <motion.div className={styles.coverLayer} exit={{ y: "-105%", opacity: .7 }} transition={{ duration: 1.35, ease }}>{body}</motion.div>;
}

function Hero({ invitation }: { invitation: InvitationData }) {
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const photo = invitation.gallery[0] || invitation.coverImage || invitation.bride.photo;
  return <section id="home" className={styles.hero}><GardenHorizon deep/><Flora position="tl"/><Flora position="br"/>
    <motion.div className={styles.heroCopy} initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .85, ease }}><p>The Wedding Of</p><h2><em>{bride}</em><span>&amp;</span><em>{groom}</em></h2></motion.div>
    <motion.div className={styles.heroPhoto} initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .6, duration: 1, ease }}><PortraitArch src={photo} alt={`${bride} & ${groom}`}/></motion.div>
    <motion.p className={styles.heroTagline} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: .8 }}>We invite you to celebrate our wedding</motion.p>
  </section>;
}

function Opening({ invitation }: { invitation: InvitationData }) {
  const quotePhoto = invitation.gallery[1] || invitation.coverImage;
  return <section className={styles.opening}><Flora position="tr"/>
    <Reveal className={styles.quoteCard}><div className={styles.miniArch}>{quotePhoto && <Image src={quotePhoto} alt="Wedding moment" fill sizes="220px"/>}</div><p>“{invitation.opening.quote || "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu merasa tenteram kepadanya."}”</p><cite>{invitation.opening.quoteSource || "QS. Ar-Rum : 21"}</cite></Reveal>
    <Reveal className={styles.salam} delay={.08}><div className={styles.ornamentLine}><span>❦</span></div><h3>{invitation.opening.greeting || "Assalamu’alaikum Wr. Wb."}</h3><p>{invitation.opening.description || "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami."}</p></Reveal>
    <GardenHorizon/>
  </section>;
}

function PersonCard({ person, role, photo, reverse = false }: { person: InvitationData["bride"] | InvitationData["groom"]; role: string; photo: string | null; reverse?: boolean }) {
  return <Reveal className={`${styles.personCard} ${reverse ? styles.personReverse : ""}`}><div className={styles.personVisual}><PortraitArch src={photo || person.photo} alt={person.name}/></div><div className={styles.personText}><small>{role}</small><h3>{person.name}</h3><p>{person.parents || "Putra/putri dari keluarga tercinta"}</p>{person.instagram && <a href={`https://instagram.com/${person.instagram.replace("@", "")}`} target="_blank" rel="noreferrer"><Icon name="instagram"/> {person.instagram.startsWith("@") ? person.instagram : `@${person.instagram}`}</a>}</div></Reveal>;
}

function CoupleSection({ invitation }: { invitation: InvitationData }) {
  return <section id="couple" className={styles.coupleSection}><div className={styles.sectionIntro}><span>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span><p>Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan</p></div><PersonCard person={invitation.bride} role="The Bride" photo={invitation.gallery[2] || invitation.bride.photo}/><div className={styles.ampersand}>&amp;</div><PersonCard person={invitation.groom} role="The Groom" photo={invitation.gallery[3] || invitation.groom.photo} reverse/><Flora position="bl"/><Flora position="tr"/></section>;
}

function CountdownSection({ invitation }: { invitation: InvitationData }) {
  const event = invitation.events[0];
  const target = useMemo(() => new Date(event?.rawDate || event?.date || Date.now()).getTime(), [event?.rawDate, event?.date]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return <section id="event" className={styles.countdownSection}><GardenHorizon deep/><Reveal className={styles.countdownCard}><p>Save The Date</p><h2>Our Special Day</h2><div className={styles.countdownGrid}>{[[days,"Days"],[hours,"Hours"],[mins,"Minutes"],[secs,"Seconds"]].map(([n,label]) => <div key={String(label)}><strong>{String(n).padStart(2,"0")}</strong><span>{label}</span></div>)}</div><p className={styles.countdownNote}>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p></Reveal><Flora position="br"/></section>;
}

function EventCard({ event, index }: { event: InvitationData["events"][number]; index: number }) {
  const p = dateParts(event.rawDate || event.date);
  return <Reveal className={styles.eventCard} delay={index * .08}><div className={styles.eventRibbon}>{index === 0 ? "Akad Nikah" : "Resepsi"}</div><div className={styles.eventDate}><span>{p.day}</span><strong>{p.date}</strong><span>{p.month}<br/>{p.year}</span></div><div className={styles.eventDetails}><p>{event.time}</p><h3>{event.location}</h3><a href="#" onClick={(e) => { e.preventDefault(); const url = event.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}` : "#"; window.open(url, "_blank", "noopener,noreferrer"); }}><Icon name="pin"/> Lihat Lokasi</a></div></Reveal>;
}

function Events({ invitation }: { invitation: InvitationData }) {
  const list = invitation.events.length ? invitation.events.slice(0,2) : [];
  return <section className={styles.eventsSection}><div className={styles.sectionTitle}><p>Wedding Event</p><h2>Save The Date</h2></div>{list.map((event,index)=><EventCard key={`${event.name}-${index}`} event={event} index={index}/>)}<Flora position="tl"/><GardenHorizon/></section>;
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const photos = [...invitation.gallery, invitation.coverImage].filter(Boolean) as string[];
  const items = photos.length ? photos.slice(0,6) : [];
  return <section id="gallery" className={styles.gallerySection}><div className={styles.sectionTitle}><p>Our Moment</p><h2>Wedding Gallery</h2><span>Every picture tells our little story</span></div><div className={styles.galleryGrid}>{items.map((src,i)=><motion.div key={`${src}-${i}`} className={`${styles.galleryItem} ${i===0||i===3?styles.galleryTall:""}`} initial={{ opacity:0, scale:.94 }} whileInView={{opacity:1,scale:1}} viewport={{once:true, amount:.2}} transition={{duration:.65,delay:i*.06,ease}}><Image src={src} alt={`Gallery ${i+1}`} fill sizes="(max-width:540px) 46vw, 220px"/></motion.div>)}</div><Flora position="br"/></section>;
}

function Story({ invitation }: { invitation: InvitationData }) {
  const fallback = [
    {year:"2022",title:"First Meet",description:"Berawal dari sebuah pertemuan sederhana, cerita kami perlahan menemukan jalannya."},
    {year:"2024",title:"Engagement",description:"Kami memantapkan hati dan meminta restu keluarga untuk melangkah ke jenjang yang lebih serius."},
    {year:"2026",title:"Forever Begins",description:"Dengan penuh syukur, kami memilih untuk berjalan bersama dalam ikatan pernikahan."},
  ];
  const stories = invitation.story.length ? invitation.story.slice(0,4) : fallback;
  return <section id="story" className={styles.storySection}><GardenHorizon/><div className={styles.sectionTitle}><p>How It Started</p><h2>Our Love Story</h2></div><div className={styles.storyTimeline}>{stories.map((s,i)=><Reveal key={`${s.year}-${i}`} className={styles.storyItem} delay={i*.05}><div className={styles.storyDot}><Icon name="heart"/></div><div><span>{s.year}</span><h3>{s.title}</h3><p>{s.description}</p></div></Reveal>)}</div><Flora position="tr"/></section>;
}

function Rsvp({ invitation }: { invitation: InvitationData }) {
  const { entries, counts, submit, submitting, submitted, hasMore, loadMore } = useRsvpWishes(invitation.id);
  const [name,setName] = useState(""); const [whatsapp,setWhatsapp] = useState(""); const [attendance,setAttendance] = useState<Attendance>("Hadir"); const [message,setMessage] = useState(""); const [error,setError] = useState("");
  const onSubmit = async (e: FormEvent) => { e.preventDefault(); setError(""); if(!name.trim()||!message.trim()){setError("Nama dan ucapan wajib diisi.");return;} const result=await submit({name:name.trim(),whatsapp:whatsapp.trim(),attendance,message:message.trim()}); if(result.error){setError(result.error);return;} setName("");setWhatsapp("");setMessage(""); };
  return <section id="wishes" className={styles.rsvpSection}><div className={styles.sectionTitle}><p>Prayers & Wishes</p><h2>RSVP & Ucapan</h2><span>Kehadiran dan doa baik Anda adalah hadiah yang berarti bagi kami.</span></div><Reveal className={styles.rsvpCard}><form onSubmit={onSubmit}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama"/><input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="No. WhatsApp (opsional)"/><select value={attendance} onChange={e=>setAttendance(e.target.value as Attendance)}><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tuliskan ucapan dan doa..." rows={4}/>{error&&<p className={styles.formError}>{error}</p>}{submitted&&<p className={styles.formSuccess}>Terima kasih, ucapan Anda sudah terkirim.</p>}<button disabled={submitting} type="submit"><Icon name="chat"/> {submitting?"Mengirim...":"Kirim Ucapan"}</button></form><div className={styles.rsvpStats}><span><strong>{counts.hadir}</strong> Hadir</span><span><strong>{counts.tidakHadir}</strong> Tidak Hadir</span><span><strong>{counts.raguRagu}</strong> Ragu</span></div></Reveal><div className={styles.wishList}>{entries.map(e=><div className={styles.wishItem} key={e.id}><strong>{e.name}</strong><span>{e.attendance}</span><p>{e.message}</p></div>)}{hasMore&&<button className={styles.moreButton} onClick={loadMore}>Lihat ucapan lainnya</button>}</div><Flora position="bl"/></section>;
}

function Gift({ invitation }: { invitation: InvitationData }) {
  const gifts = invitation.gifts.length ? invitation.gifts : [{owner:"Mempelai",bankName:"BCA",accountNumber:"1234567890",accountName:"Bride & Groom"}];
  const copy = (value:string|null) => value && navigator.clipboard?.writeText(value);
  return <section id="gift" className={styles.giftSection}><GardenHorizon deep/><div className={styles.sectionTitle}><p>Wedding Gift</p><h2>Share Your Love</h2><span>Doa restu Anda merupakan karunia yang sangat berarti. Namun jika memberi adalah ungkapan kasih, dapat disampaikan melalui:</span></div><div className={styles.giftStack}>{gifts.slice(0,2).map((g,i)=><Reveal key={`${g.owner}-${i}`} className={styles.bankCard} delay={i*.08}><div className={styles.bankTop}><span>{g.bankName||"Bank"}</span><Icon name="gift"/></div><strong>{g.accountNumber||"-"}</strong><p>a.n. {g.accountName||g.owner}</p><button onClick={()=>copy(g.accountNumber)}><Icon name="copy"/> Salin Nomor</button></Reveal>)}</div><Flora position="tr"/><Flora position="bl"/></section>;
}

function Closing({ invitation }: { invitation: InvitationData }) {
  const bride=firstName(invitation.bride.name,invitation.bride.nickname); const groom=firstName(invitation.groom.name,invitation.groom.nickname); const photo=invitation.gallery[5]||invitation.gallery[0]||invitation.coverImage;
  return <section className={styles.closing}><GardenHorizon deep/><Reveal className={styles.closingPhoto}><PortraitArch src={photo} alt={`${bride} & ${groom}`}/></Reveal><Reveal className={styles.closingCopy}><p>Thank You</p><h2>{bride} <span>&amp;</span> {groom}</h2><blockquote>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</blockquote><small>Wassalamu’alaikum Wr. Wb.</small></Reveal><Flora position="br"/></section>;
}

const nav = [
  ["home","home"],["couple","couple"],["event","calendar"],["gallery","gallery"],["story","heart"],["wishes","chat"],["gift","gift"],
] as const;

export default function LuxuryArtLX005({ invitation, previewMode = false }: { invitation: InvitationData; previewMode?: boolean }) {
  const [opened,setOpened]=useState(false);
  const scrollTo=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
  if(previewMode) return <div className={styles.previewShell}><Cover invitation={invitation} onOpen={()=>{}} staticMode/></div>;
  return <main className={styles.stage}><div className={styles.invitation}><AnimatePresence>{!opened&&<Cover invitation={invitation} onOpen={()=>setOpened(true)}/>}</AnimatePresence><div className={`${styles.content} ${opened?styles.contentOpen:""}`}><Hero invitation={invitation}/><Opening invitation={invitation}/><CoupleSection invitation={invitation}/><CountdownSection invitation={invitation}/><Events invitation={invitation}/><Gallery invitation={invitation}/><Story invitation={invitation}/><Rsvp invitation={invitation}/><Gift invitation={invitation}/><Closing invitation={invitation}/></div>{opened&&<nav className={styles.bottomNav} aria-label="Navigasi undangan">{nav.map(([id,icon])=><button key={id} onClick={()=>scrollTo(id)} aria-label={id}><Icon name={icon}/></button>)}</nav>}</div><aside className={styles.desktopScene}><div><span>VISTIQ INVITATION</span><p>Luxury Art Collection</p><h2>{firstName(invitation.bride.name,invitation.bride.nickname)} <em>&amp;</em> {firstName(invitation.groom.name,invitation.groom.nickname)}</h2><small>Scroll undangan di panel kanan</small></div><GardenHorizon deep/><Flora position="bl"/><Flora position="tr"/></aside></main>;
}
