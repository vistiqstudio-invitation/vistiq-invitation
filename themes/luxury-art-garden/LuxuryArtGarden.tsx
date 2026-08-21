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

function Scene({ dense = false, staged = false }: { dense?: boolean; staged?: boolean }) {
  return (
    <div className={`${styles.scene} ${dense ? styles.sceneDense : ""}`} aria-hidden="true">
      <motion.i
        className={styles.sceneArtwork}
        initial={staged ? { opacity: 0, scale: 1.08 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.45, ease }}
      />
      <motion.i className={styles.cloudOne} animate={{ x: [0, 24, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} />
      <motion.i className={styles.cloudTwo} animate={{ x: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
      <motion.i
        className={styles.botanicalForeground}
        initial={staged ? { opacity: 0, y: 100, scale: .88 } : false}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: [-.35, .35, -.35] }}
        transition={{ opacity: { delay: .75, duration: 1.15, ease }, y: { delay: .75, duration: 1.15, ease }, scale: { delay: .75, duration: 1.15, ease }, rotate: { delay: 1.9, duration: 4.8, repeat: Infinity, ease: "easeInOut" } }}
      />
    </div>
  );
}

function OvalPortrait({ src, alt, className = "", priority = false }: { src: string | null; alt: string; className?: string; priority?: boolean }) {
  return <div className={`${styles.ovalPortrait} ${className}`}><div className={styles.ovalInner}>{src && <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 600px) 68vw, 380px" />}</div><Image className={styles.ovalFrameAsset} src="/themes/luxury-art-garden/oval-frame.webp" alt="" fill priority={priority} sizes="(max-width: 600px) 78vw, 430px" aria-hidden="true" /></div>;
}

function Loading() { return <motion.div className={styles.loading} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: .65, ease }}><span>N <i>&amp;</i> R</span><small>Luxury Art</small></motion.div>; }

function Cover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const guest = useSearchParams().get("to") || "Bapak/Ibu/Saudara/i";
  const bride = invitation.bride.nickname || invitation.bride.name;
  const groom = invitation.groom.nickname || invitation.groom.name;
  return <motion.section className={styles.cover} exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }} transition={{ duration: 1.15, ease }}><Scene dense staged/><div className={styles.coverBorder}><i/></div><motion.div className={styles.coverBirds} initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{delay:.7}}>⌁　⌁</motion.div><motion.div className={styles.coverTitle} initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:.85,duration:.8,ease}}><p>The Wedding of</p><h1>{bride} <span>&amp;</span> {groom}</h1></motion.div><motion.div className={styles.coverPortrait} initial={{opacity:0,scale:.72,y:78}} animate={{opacity:1,scale:1,y:0}} transition={{delay:1.3,duration:1.25,ease}}><OvalPortrait src={invitation.coverImage} alt={`${bride} dan ${groom}`} priority/></motion.div><motion.div className={styles.guestCard} initial={{opacity:0,y:90}} animate={{opacity:1,y:0}} transition={{delay:2.15,duration:.95,ease}}><p>Kepada Yth.<br/><strong>{guest}</strong></p><motion.button whileTap={{scale:.96}} animate={{boxShadow:["0 0 0 0 rgba(117,99,130,.32)","0 0 0 10px rgba(117,99,130,0)"]}} transition={{delay:3, duration:1.8,repeat:Infinity}} onClick={()=>setOpened(true)}><span>✉</span> Buka Undangan</motion.button></motion.div></motion.section>;
}

function Hero({ invitation }: { invitation: InvitationData }) {
  const bride=invitation.bride.nickname||invitation.bride.name; const groom=invitation.groom.nickname||invitation.groom.name;
  return <section id="home" className={styles.hero}><Scene dense staged/><motion.div className={styles.heroTitle} initial={{opacity:0,y:-36}} animate={{opacity:1,y:0}} transition={{delay:.75,duration:.9,ease}}><p>The Wedding of</p><h2>{bride} <span>&amp;</span> {groom}</h2></motion.div><motion.div className={styles.heroPortrait} initial={{opacity:0,scale:.7,y:70}} animate={{opacity:1,scale:1,y:0}} transition={{delay:1.2,duration:1.2,ease}}><OvalPortrait src={invitation.coverImage} alt={`${bride} dan ${groom}`} priority/></motion.div></section>;
}

function Quote() { return <section className={styles.quoteSection}><div className={styles.quoteTreeLeft}/><div className={styles.quoteTreeRight}/><motion.blockquote initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.8}}><span>“</span><p>Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.</p><cite>— QS. Ar-Rum 21 —</cite></motion.blockquote></section>; }

function Person({person,role,index}:{person:InvitationData["bride"]|InvitationData["groom"];role:"Putri"|"Putra";index:number}) { return <motion.article className={styles.person} initial={{opacity:0,y:55}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.14,duration:.8,ease}}><div className={styles.personPhoto}>{person.photo&&<Image src={person.photo} alt={person.name} fill sizes="(max-width:600px) 68vw, 340px"/>}</div><div className={styles.personCopy}><p>{role} dari</p><h3>{person.name}</h3><p>{person.parents}</p>{person.instagram&&<a href={`https://instagram.com/${person.instagram.replace("@","")}`} target="_blank" rel="noreferrer">@{person.instagram.replace("@","")}</a>}</div></motion.article>; }

function Couple({invitation}:{invitation:InvitationData}) { return <section id="couple" className={styles.couple}><div className={styles.coupleOpening}><p>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p><h2>Assalamu’alaikum Wr. Wb.</h2><span>Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaa Allah kami akan menyelenggarakan acara pernikahan.</span></div><Person person={invitation.bride} role="Putri" index={0}/><div className={styles.ampersand}>&amp;</div><Person person={invitation.groom} role="Putra" index={1}/></section>; }

function Countdown({date}:{date:string}) { const target=useMemo(()=>new Date(date).getTime(),[date]); const [now,setNow]=useState(()=>Date.now()); useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),1000);return()=>window.clearInterval(timer);},[]); const distance=Math.max(0,target-now); const values=[[Math.floor(distance/86400000),"Hari"],[Math.floor(distance/3600000)%24,"Jam"],[Math.floor(distance/60000)%60,"Menit"],[Math.floor(distance/1000)%60,"Detik"]]; return <section id="countdown" className={styles.countdown}><Scene/><h2>Kami akan menikah,<small>dan kami ingin Anda menjadi bagian dari hari istimewa kami!</small></h2><div>{values.map(([v,l])=><span key={l}><strong>{String(v).padStart(2,"0")}</strong><small>{l}</small></span>)}</div></section>; }

function Events({invitation}:{invitation:InvitationData}) { return <section id="event" className={styles.events}>{invitation.events.map((event,index)=><motion.article key={`${event.name}-${event.date}`} initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.15,duration:.8,ease}}><div className={styles.eventArch}><span>{index===0?"I":"II"}</span><h2>{event.name}</h2><p>{event.date}</p><strong>{event.time}</strong><i/><p>{event.location}</p>{invitation.mapsUrl&&<a href={invitation.mapsUrl} target="_blank" rel="noreferrer">Lihat Maps</a>}</div></motion.article>)}</section>; }

function Gallery({invitation}:{invitation:InvitationData}) { const [active,setActive]=useState<number|null>(null); return <section id="gallery" className={styles.gallery}><Scene/><h2>Our Gallery</h2><div className={styles.galleryGrid}>{invitation.gallery.slice(0,6).map((photo,index)=><motion.button key={photo} onClick={()=>setActive(index)} initial={{opacity:0,scale:.88}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:index*.07}}><Image src={photo} alt={`Galeri ${index+1}`} fill sizes="(max-width:600px) 44vw, 260px"/></motion.button>)}</div><AnimatePresence>{active!==null&&<motion.div className={styles.lightbox} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActive(null)}><button aria-label="Tutup">×</button><div><Image src={invitation.gallery[active]} alt="Foto galeri" fill sizes="90vw"/></div></motion.div>}</AnimatePresence></section>; }

function Story({invitation}:{invitation:InvitationData}) { return <section id="story" className={styles.story}><h2>Love Story</h2><div className={styles.storyPhoto}>{invitation.gallery[0]&&<Image src={invitation.gallery[0]} alt="Love story" fill sizes="(max-width:600px) 82vw, 500px"/>}</div><div className={styles.storyList}>{invitation.story.map((item,index)=><motion.article key={`${item.year}-${item.title}`} initial={{opacity:0,x:index%2?-30:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}><span>{item.year}</span><h3>{item.title}</h3><p>{item.description}</p></motion.article>)}</div></section>; }

function RSVP({invitation}:{invitation:InvitationData}) { const {submit,submitting,submitted}=useRsvpWishes(invitation.id); const [name,setName]=useState(""); const [attendance,setAttendance]=useState<Attendance>("Hadir"); const [message,setMessage]=useState(""); const [error,setError]=useState(""); async function send(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError("");if(!name.trim()||!message.trim()){setError("Nama dan ucapan wajib diisi.");return;}const result=await submit({name,whatsapp:"",attendance,message});if(result.error){setError(result.error);return;}setName("");setMessage("");} return <section id="rsvp" className={styles.rsvp}><h2>Ucapan &amp; RSVP</h2><p>Berikan ucapan terbaik untuk Kedua Mempelai &amp; Konfirmasi Kehadiran</p>{submitted?<div className={styles.thanks}>Terima kasih, konfirmasi Anda telah terkirim.</div>:<form onSubmit={send}><input placeholder="Nama Kamu" value={name} onChange={e=>setName(e.target.value)}/><select value={attendance} onChange={e=>setAttendance(e.target.value as Attendance)}><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select><textarea placeholder="Ucapan dan doa" value={message} onChange={e=>setMessage(e.target.value)} rows={4}/><button disabled={submitting}>{submitting?"Mengirim...":"Send"}</button>{error&&<small>{error}</small>}</form>}</section>; }

function Gifts({invitation}:{invitation:InvitationData}) { const [copied,setCopied]=useState<number|null>(null); async function copy(account:GiftAccount,index:number){if(!account.accountNumber)return;await navigator.clipboard.writeText(account.accountNumber);setCopied(index);window.setTimeout(()=>setCopied(null),1600);} return <section id="gift" className={styles.gifts}><Scene/><h2>Wedding Gift</h2><p>Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</p><div>{invitation.gifts.map((account,index)=><article key={`${account.owner}-${index}`}><span>WEDDING GIFT</span><h3>{account.bankName}</h3><strong>{account.accountNumber}</strong><p>{account.accountName}</p><button onClick={()=>copy(account,index)}>{copied===index?"Tersalin":"Copy"}</button></article>)}</div></section>; }

function Footer({invitation}:{invitation:InvitationData}) { return <footer className={styles.footer}><Scene dense/><div><p>Atas kehadiran dan do’a restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan Terima Kasih.</p><h3>Wassalamu’alaikum Wr. Wb.</h3><small>Kami yang berbahagia</small><h2>{invitation.bride.nickname||invitation.bride.name} <span>&amp;</span> {invitation.groom.nickname||invitation.groom.name}</h2></div></footer>; }

function Music({url}:{url:string|null}) { const {audioRef,isPlaying,toggle}=useMusicPlayer(url); if(!url)return null; return <><audio ref={audioRef} src={url} loop/><button className={styles.music} onClick={toggle} aria-label={isPlaying?"Jeda musik":"Putar musik"}>{isPlaying?"Ⅱ":"♫"}</button></>; }
const nav=[["home","⌂"],["couple","♧"],["event","▣"],["gallery","▦"],["story","♡"],["rsvp","◌"],["gift","♢"]];
function FloatingNav(){return <nav className={styles.nav}>{nav.map(([id,icon])=><button key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"})} aria-label={id}>{icon}</button>)}</nav>;}

export default function LuxuryArtGarden({invitation}:{invitation:InvitationData}) { const {opened}=useInvitation(); const [ready,setReady]=useState(false); useEffect(()=>{const t=window.setTimeout(()=>setReady(true),650);return()=>window.clearTimeout(t);},[]); const date=invitation.events[0]?.rawDate; return <main className={styles.root}><AnimatePresence>{!ready&&<Loading/>}</AnimatePresence><AnimatePresence mode="wait">{ready&&!opened?<Cover key="cover" invitation={invitation}/>:ready&&opened?<motion.div key="invitation" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.8}}><Hero invitation={invitation}/><Quote/><Couple invitation={invitation}/>{date&&<Countdown date={date}/>}<Events invitation={invitation}/>{invitation.gallery.length>0&&<Gallery invitation={invitation}/>} {invitation.story.length>0&&<Story invitation={invitation}/>}<RSVP invitation={invitation}/>{invitation.gifts.length>0&&<Gifts invitation={invitation}/>}<Footer invitation={invitation}/><Music url={invitation.musicUrl}/><FloatingNav/></motion.div>:null}</AnimatePresence></main>; }
