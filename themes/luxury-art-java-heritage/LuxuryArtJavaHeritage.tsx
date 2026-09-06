"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { GiftAccount, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 }, transition: { duration: 0.85, ease } };
const icons = ["⌂", "♙", "▦", "▣", "♡", "◉", "♧"];
const ids = ["home", "couple", "event", "gallery", "story", "rsvp", "gift"];

function ArchPhoto({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  return <div className={`${styles.archPhoto} ${className}`}>{src && <Image src={src} alt={alt} fill sizes="(max-width:600px) 62vw,300px"/>}<i/></div>;
}
function Flora({ position = "bottom" }: { position?: "top" | "bottom" | "side" }) { return <i className={`${styles.flora} ${styles[`flora${position[0].toUpperCase()}${position.slice(1)}`]}`}/>; }
function Landscape({ withHouse = false }: { withHouse?: boolean }) { return <div className={styles.landscape} aria-hidden="true"><i className={styles.trees}/>{withHouse && <i className={styles.house}/>}</div>; }

function Cover({ invitation, onOpen }: { invitation: InvitationData; onOpen: () => void }) {
  const guest = useSearchParams().get("to") || "Bpk/Ibu/Saudara/i";
  const bride = invitation.bride.nickname || invitation.bride.name.split(" ")[0];
  const groom = invitation.groom.nickname || invitation.groom.name.split(" ")[0];
  return <motion.section className={styles.cover} exit={{ y: "-105%" }} transition={{ duration: 1.35, ease }}>
    <div className={styles.coverBackground}>{invitation.coverImage && <Image src={invitation.coverImage} alt="" fill priority sizes="500px"/>}</div>
    <motion.div className={styles.coverCard} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .2, ease }}>
      <Flora position="side"/><ArchPhoto src={invitation.coverImage} alt={`${bride} dan ${groom}`}/><small>The Wedding of</small><h1>{bride} &amp; {groom}</h1><p>Kepada Yth.<strong>{guest}</strong>di Tempat</p><button type="button" onClick={onOpen}>▣ Buka Undangan</button>
    </motion.div>
  </motion.section>;
}

function Hero({ invitation, active }: { invitation: InvitationData; active: boolean }) {
  const bride = invitation.bride.nickname || invitation.bride.name.split(" ")[0]; const groom = invitation.groom.nickname || invitation.groom.name.split(" ")[0];
  return <section id="home" className={styles.hero}><Flora position="top"/><motion.div className={styles.heroCopy} initial={{opacity:0,y:34,scale:.97}} animate={active?{opacity:1,y:0,scale:1}:{opacity:0,y:34,scale:.97}} transition={{duration:1.05,delay:.55,ease}}><small>The Wedding of</small><ArchPhoto src={invitation.coverImage} alt={`${bride} dan ${groom}`}/><motion.h2 initial={{opacity:0,y:12}} animate={active?{opacity:1,y:0}:{opacity:0,y:12}} transition={{duration:.75,delay:1.05,ease}}>{bride} &amp; {groom}</motion.h2><motion.p initial={{opacity:0}} animate={active?{opacity:1}:{opacity:0}} transition={{duration:.7,delay:1.3}}>{invitation.events[0]?.date}</motion.p></motion.div><Landscape withHouse/></section>;
}

function Opening({ invitation }: { invitation: InvitationData }) {
  return <section className={styles.opening}><motion.blockquote {...reveal}><p>“{invitation.opening.quote || "Dan diantara tanda-tanda kekuasaan-Nya ialah diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapat ketenangan hati."}”</p><strong>({invitation.opening.quoteSource || "QS. Ar-Rum: 21"})</strong></motion.blockquote><div className={styles.openingPaper}><motion.div {...reveal}><h2>{invitation.opening.greeting || "Assalamu’alaikum Wr. Wb."}</h2><p>{invitation.opening.description || "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaa Allah kami akan menyelenggarakan acara pernikahan."}</p></motion.div></div></section>;
}

function Couple({ invitation }: { invitation: InvitationData }) {
  const people = [{ data: invitation.bride, role: "Putri" }, { data: invitation.groom, role: "Putra" }];
  return <section id="couple" className={styles.couple}><Flora position="side"/>{people.map(({data,role},i)=><motion.article key={role} {...reveal}><ArchPhoto src={data.photo} alt={data.name}/><h3>{data.name}</h3><p>{role} pertama dari {data.parents}</p>{data.instagram&&<a href={`https://instagram.com/${data.instagram.replace("@","")}`} target="_blank" rel="noreferrer">◎</a>}{i===0&&<b>&amp;</b>}</motion.article>)}<Landscape/></section>;
}

function Countdown({ date, label }: { date: string; label: string }) {
  const target=useMemo(()=>new Date(date).getTime(),[date]); const [now,setNow]=useState<number|null>(null);
  useEffect(()=>{const tick=()=>setNow(Date.now());tick();const t=window.setInterval(tick,1000);return()=>window.clearInterval(t)},[]);
  const d=now===null?null:Math.max(0,target-now); const vals=d===null?["--","--","--","--"]:[Math.floor(d/86400000),Math.floor(d/3600000)%24,Math.floor(d/60000)%60,Math.floor(d/1000)%60].map(v=>String(v).padStart(2,"0"));
  return <section className={styles.countdown}><Flora position="side"/><motion.div {...reveal} className={styles.squareCard}><span>▦</span><p>Kami akan menikah,<br/>dan kami ingin Anda menjadi bagian<br/>dari hari istimewa kami!</p><div>{vals.map((v,i)=><b key={["Hari","Jam","Menit","Detik"][i]}>{v}<small>{["Hari","Jam","Menit","Detik"][i]}</small></b>)}</div><em>{label}</em><a href="#event">▣ Save The Date</a></motion.div></section>;
}

function Event({ invitation }: { invitation: InvitationData }) { return <section id="event" className={styles.events}><Flora position="side"/>{invitation.events.map(ev=><motion.article key={ev.name} {...reveal}><span>♧</span><h2>{ev.name}</h2><h3>{ev.date}</h3><p>{ev.time}</p><i>⌖</i><strong>{ev.location}</strong>{invitation.mapsUrl&&<a href={invitation.mapsUrl} target="_blank" rel="noreferrer">⌕ Lihat Maps</a>}<Landscape withHouse/></motion.article>)}</section> }

function Gallery({ invitation }: { invitation: InvitationData }) { const [active,setActive]=useState<number|null>(null); return <section id="gallery" className={styles.gallery}><Flora position="side"/><h2>Our Gallery</h2><span>♧</span><div className={styles.video}>{invitation.videoUrl?<iframe src={invitation.videoUrl} title="Wedding video" allow="autoplay; fullscreen"/>:invitation.gallery[0]&&<Image src={invitation.gallery[0]} alt="Wedding video" fill sizes="500px"/>}</div><div className={styles.masonry}>{invitation.gallery.slice(0,8).map((src,i)=><button key={src} type="button" onClick={()=>setActive(i)}><Image src={src} alt={`Galeri ${i+1}`} fill sizes="180px"/></button>)}</div><AnimatePresence>{active!==null&&<motion.div className={styles.lightbox} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActive(null)}><button>×</button><Image src={invitation.gallery[active]} alt="Galeri" fill sizes="90vw"/></motion.div>}</AnimatePresence></section> }

function Story({ invitation }: { invitation: InvitationData }) { const image=invitation.gallery[6]||invitation.gallery[1]||invitation.coverImage; return <section id="story" className={styles.story}><Landscape/><ArchPhoto src={image} alt="Love story"/><h2>Love Story</h2><div>{invitation.story.map(item=><motion.article key={`${item.year}-${item.title}`} {...reveal}><i/><time>{item.year}</time><h3>{item.title}</h3><p>{item.description}</p></motion.article>)}</div></section> }

function RSVP({ invitation }: { invitation: InvitationData }) { const {submit,submitting,submitted,entries}=useRsvpWishes(invitation.id); const [name,setName]=useState("");const [message,setMessage]=useState("");const [attendance,setAttendance]=useState<Attendance>("Hadir");async function send(e:React.FormEvent){e.preventDefault();if(!name.trim()||!message.trim())return;const r=await submit({name,whatsapp:"",attendance,message});if(!r.error){setName("");setMessage("")}}return <section id="rsvp" className={styles.rsvp}><Flora position="side"/><h2>Tinggalkan Do’a Ucapan</h2><p>Berikan ucapan terbaik untuk Kedua Mempelai &amp; Konfirmasi Kehadiran.</p>{submitted?<b>Terima kasih, konfirmasi Anda telah terkirim.</b>:<form onSubmit={send}><input placeholder="Nama Kamu" value={name} onChange={e=>setName(e.target.value)}/><textarea placeholder="Berikan Ucapan & Do’a" value={message} onChange={e=>setMessage(e.target.value)}/><div>{(["Hadir","Tidak Hadir"] as Attendance[]).map(v=><button type="button" key={v} className={v===attendance?styles.selected:""} onClick={()=>setAttendance(v)}>{v}</button>)}</div><button disabled={submitting}>{submitting?"Mengirim...":"Send"}</button></form>}<div className={styles.wishes}>{entries.slice(0,4).map(e=><article key={e.id}><strong>{e.name}</strong><small>{e.attendance}</small><p>{e.message}</p></article>)}</div></section> }

function Gift({ invitation }: { invitation: InvitationData }) { const [open,setOpen]=useState(false);const [copied,setCopied]=useState<number|null>(null);async function copy(a:GiftAccount,i:number){if(!a.accountNumber)return;await navigator.clipboard.writeText(a.accountNumber);setCopied(i);setTimeout(()=>setCopied(null),1400)}return <section id="gift" className={styles.gift}><div className={styles.giftCard}><b>Wedding Gift</b><p>Mungkin karena jarak, waktu ataupun keadaan yang menghalangi untuk ikut hadir dalam momen bahagia kami, silakan klik tombol di bawah untuk mengirimkan kado/hadiah.</p><button onClick={()=>setOpen(v=>!v)}>▦ Amplop Digital</button></div>{open&&<div className={styles.accounts}>{invitation.gifts.map((a,i)=><article key={i}><small>{a.bankName}</small><strong>{a.accountNumber}</strong><span>{a.accountName}</span><button onClick={()=>copy(a,i)}>{copied===i?"Tersalin":"Salin"}</button></article>)}</div>}</section> }

function Footer({ invitation }: { invitation: InvitationData }) { const bride=invitation.bride.nickname||invitation.bride.name.split(" ")[0];const groom=invitation.groom.nickname||invitation.groom.name.split(" ")[0];return <footer className={styles.footer}><Flora position="side"/><ArchPhoto src={invitation.coverImage} alt={`${bride} dan ${groom}`}/><p>Atas kehadiran dan do’a restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan Terima Kasih.</p><h3>Wassalamu’alaikum Wr. Wb.</h3><small>Kami yang berbahagia</small><h2>{bride} &amp; {groom}</h2><Landscape withHouse/></footer> }

function Navigation(){return <nav className={styles.nav}>{icons.map((icon,i)=><button key={ids[i]} onClick={()=>document.getElementById(ids[i])?.scrollIntoView({behavior:"smooth"})}>{icon}</button>)}</nav>}

export default function LuxuryArtJavaHeritage({ invitation }: { invitation: InvitationData }) { const {opened,setOpened}=useInvitation();const {audioRef,isPlaying,toggle}=useMusicPlayer(invitation.musicUrl,false);const date=invitation.events[0]?.rawDate;useEffect(()=>{document.body.style.overflow=opened?"":"hidden";return()=>{document.body.style.overflow=""}},[opened]);async function open(){setOpened(true);if(invitation.musicUrl&&!isPlaying)await toggle().catch(()=>{})}return <main className={styles.root}><aside className={styles.desktop}>{invitation.coverImage&&<Image src={invitation.coverImage} alt="" fill priority sizes="calc(100vw - 500px)"/>}</aside><div className={styles.shell}><Hero invitation={invitation} active={opened}/><Opening invitation={invitation}/><Couple invitation={invitation}/>{date&&<Countdown date={date} label={invitation.events[0]?.date||""}/>}<Event invitation={invitation}/>{invitation.gallery.length>0&&<Gallery invitation={invitation}/>}<Story invitation={invitation}/><RSVP invitation={invitation}/><Gift invitation={invitation}/><Footer invitation={invitation}/>{invitation.musicUrl&&<audio ref={audioRef} src={invitation.musicUrl} loop preload="none"/>}<AnimatePresence>{!opened&&<Cover invitation={invitation} onOpen={open}/>}</AnimatePresence>{opened&&<><button className={styles.music} onClick={()=>void toggle()}>{isPlaying?"♫":"♪"}</button><Navigation/></>}</div></main> }
