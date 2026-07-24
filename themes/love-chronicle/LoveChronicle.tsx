/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Reveal from "@/components/Reveal";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { GiftAccount, InvitationData } from "@/types/invitation";
import { ChronicleRule, PostalStamp, WaxSeal } from "./ChronicleAccents";
import styles from "./style.module.css";

function Heading({ kicker, title, inverse = false }: { kicker: string; title: string; inverse?: boolean }) {
  return (
    <Reveal>
      <header className={`${styles.sectionHead} ${inverse ? styles.inverse : ""}`}>
        <p>{kicker}</p><h2>{title}</h2><ChronicleRule className={styles.chronicleRule} />
      </header>
    </Reveal>
  );
}

function Loading() {
  return <motion.div className={styles.loading} exit={{ opacity: 0 }} transition={{ duration: .5 }}><div><b>THE</b><strong>Love Chronicle</strong><span>Wedding Edition · 2026</span></div></motion.div>;
}

function Cover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const guest = useSearchParams().get("to") || "Bapak/Ibu/Saudara/i";
  return (
    <motion.section className={styles.cover} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {invitation.coverImage && <motion.img className={styles.coverPhoto} src={invitation.coverImage} alt={`Foto ${invitation.groom.name} dan ${invitation.bride.name}`} initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.5 }} />}
      <div className={styles.coverShade} /><div className={styles.paperGrain} />
      <PostalStamp className={`${styles.postalStamp} ${styles.coverStamp}`} text="SAVE THE DATE" />
      <div className={styles.postmark} aria-hidden="true"><span>VISTIQ POST</span><i>20 · 09 · 26</i></div>
      <motion.div className={styles.coverPaper} initial={{ y: 35, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .3, duration: .9 }}>
        <div className={styles.editionRow}><span>VOL. 01</span><b>THE WEDDING NEWSPAPER</b><span>EST. 2026</span></div>
        <h1 className={styles.masthead}>Love Chronicle</h1>
        <div className={styles.doubleRule} />
        <p className={styles.coverLead}>Two hearts write the headline of a lifetime</p>
        <h2 className={styles.coverNames}>{invitation.groom.name}<span>&amp;</span>{invitation.bride.name}</h2>
        <div className={styles.coverInfo}><b>{invitation.events[0]?.date}</b><span>Special Wedding Edition</span></div>
        <div className={styles.guestBox}><small>EXCLUSIVELY DELIVERED TO</small><strong>{guest}</strong><button onClick={() => setOpened(true)}>Baca Undangan <span>→</span></button></div>
        <WaxSeal className={styles.coverSeal} initials={`${invitation.groom.name[0]}${invitation.bride.name[0]}`} />
      </motion.div>
    </motion.section>
  );
}

function Opening({ invitation }: { invitation: InvitationData }) {
  return <div className={`${styles.section} ${styles.opening}`}>
    <Reveal><p className={styles.dateline}>JAKARTA — MINGGU, 20 SEPTEMBER 2026</p><h2 className={styles.headline}>A Beautiful Beginning<br />Worth Writing About</h2><p className={styles.dropcap}>Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami, <b>{invitation.groom.name}</b> &amp; <b>{invitation.bride.name}</b>. Merupakan kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</p></Reveal>
    <Reveal delay={.15}><blockquote className={styles.pullQuote}><span>“</span><p>Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup supaya kamu mendapat ketenangan hati padanya.</p><cite>QS. Ar-Rum : 21</cite></blockquote></Reveal>
  </div>;
}

function Person({ person, role, side }: { person: InvitationData["groom"] | InvitationData["bride"]; role: string; side: "left" | "right" }) {
  return <article className={`${styles.person} ${styles[side]}`}>
    <div className={styles.photoPaper}>{person.photo && <img src={person.photo} alt={person.name} />}<span>{role} of the day</span></div>
    <div className={styles.personCopy}><small>{role}</small><h3>{person.name}</h3>{person.parents && <p>{role === "The Bride" ? "Putri" : "Putra"} dari<br />{person.parents}</p>}{person.instagram && <a href={`https://instagram.com/${person.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">@{person.instagram.replace("@", "")}</a>}</div>
  </article>;
}

function Couple({ invitation }: { invitation: InvitationData }) {
  return <div className={`${styles.section} ${styles.couple}`}><Heading kicker="Meet The Couple" title="The People Behind The Story" />
    <Reveal><div className={styles.coupleLayout}><Person person={invitation.bride} role="The Bride" side="left" /><WaxSeal className={styles.coupleSeal} initials="&" /><Person person={invitation.groom} role="The Groom" side="right" /></div></Reveal>
  </div>;
}

function Story({ invitation }: { invitation: InvitationData }) {
  return <div className={styles.storyBand}><div className={styles.section}><Heading kicker="From The Archive" title="Our Love Timeline" inverse />
    <div className={styles.storyGrid}>{invitation.story.map((item, i) => <Reveal key={`${item.year}-${item.title}`} delay={i*.08}><article className={styles.storyCard}><span>0{i+1}</span><time>{item.year}</time><h3>{item.title}</h3><p>{item.description}</p><small>CONTINUED ON LOVE →</small></article></Reveal>)}</div>
  </div></div>;
}

function Countdown({ date }: { date: string }) {
  const target = useMemo(() => new Date(date).getTime(), [date]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  const d = Math.max(0, target-now); const parts = [[Math.floor(d/86400000),"Days"],[Math.floor(d/3600000)%24,"Hours"],[Math.floor(d/60000)%60,"Minutes"],[Math.floor(d/1000)%60,"Seconds"]];
  return <div className={styles.countdown}><div className={styles.countdownTitle}><span>BREAKING NEWS</span><h2>The Big Day Is Coming</h2></div><div className={styles.countdownGrid}>{parts.map(([v,l]) => <div key={l}><strong>{String(v).padStart(2,"0")}</strong><span>{l}</span></div>)}</div></div>;
}

function Events({ invitation }: { invitation: InvitationData }) {
  return <div className={styles.section}><Heading kicker="Official Announcement" title="Wedding Schedule" /><div className={styles.eventGrid}>{invitation.events.map((e,i)=><Reveal key={`${e.name}-${i}`} delay={i*.1}><article className={styles.eventCard}><div className={styles.eventNo}>SECTION 0{i+1}</div><h3>{e.name}</h3><div className={styles.eventRule} /><time>{e.date}</time><b>{e.time}</b><p>{e.location}</p>{invitation.mapsUrl && <a href={invitation.mapsUrl} target="_blank" rel="noreferrer">View Location →</a>}<PostalStamp className={styles.eventStamp} text="YOU'RE INVITED" /></article></Reveal>)}</div></div>;
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const photos=invitation.gallery.slice(0,8); const [active,setActive]=useState<number|null>(null);
  useEffect(()=>{if(active===null)return; const close=(e:KeyboardEvent)=>e.key==="Escape"&&setActive(null); window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[active]);
  return <div className={styles.galleryBand}><div className={styles.section}><Heading kicker="Photo Essay" title="Moments In Focus" inverse /><div className={styles.galleryGrid}>{photos.map((p,i)=><Reveal key={p} delay={Math.min(i*.04,.25)}><button className={i===0||i===4?styles.featurePhoto:""} onClick={()=>setActive(i)} aria-label={`Buka foto galeri ${i+1}`}><img src={p} alt="" loading="lazy"/><span>FRAME {String(i+1).padStart(2,"0")}</span></button></Reveal>)}</div></div>
    <AnimatePresence>{active!==null&&<motion.div className={styles.lightbox} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActive(null)}><button aria-label="Tutup galeri" onClick={()=>setActive(null)}>×</button><motion.img src={photos[active]} alt="" initial={{scale:.94}} animate={{scale:1}} onClick={e=>e.stopPropagation()}/></motion.div>}</AnimatePresence>
  </div>;
}

function Video({ invitation }: { invitation: InvitationData }) { if(!invitation.videoUrl)return null; return <div className={styles.section}><Heading kicker="Motion Picture" title="Our Wedding Film"/><Reveal><div className={styles.videoFrame}><iframe src={invitation.videoUrl} title="Video kedua mempelai" allowFullScreen /></div></Reveal></div> }

function Maps({ invitation }: { invitation: InvitationData }) { if(!invitation.mapsEmbedUrl&&!invitation.mapsUrl)return null; return <div className={`${styles.section} ${styles.maps}`}><Heading kicker="City Desk" title="Where It Happens"/><Reveal><div className={styles.mapPaper}>{invitation.mapsEmbedUrl&&<iframe src={invitation.mapsEmbedUrl} title="Peta lokasi acara" loading="lazy"/>}<div><b>THE VENUE</b><span>{invitation.events[0]?.location}</span>{invitation.mapsUrl&&<a href={invitation.mapsUrl} target="_blank" rel="noreferrer">Open Google Maps →</a>}</div></div></Reveal></div> }

function GiftCard({a,onCopy,copied}:{a:GiftAccount;onCopy:()=>void;copied:boolean}) { return <article className={styles.giftCard}><small>{a.owner}</small><h3>{a.bankName}</h3><strong>{a.accountNumber}</strong><p>a.n. {a.accountName}</p>{a.accountNumber&&<button onClick={onCopy}>{copied?"Copied ✓":"Copy Account"}</button>}<WaxSeal className={styles.giftSeal} initials="G"/></article> }
function Gift({ invitation }: { invitation: InvitationData }) { const[c,setC]=useState<number|null>(null); const copy=async(a:GiftAccount,i:number)=>{if(!a.accountNumber)return;await navigator.clipboard.writeText(a.accountNumber);setC(i);setTimeout(()=>setC(null),1600)}; return <div className={styles.section}><Heading kicker="Wedding Gift" title="A Token Of Love"/><p className={styles.intro}>Doa restu Anda adalah hadiah terindah. Bagi yang berkenan memberikan tanda kasih, dapat disampaikan melalui rekening berikut.</p><div className={styles.giftGrid}>{invitation.gifts.map((a,i)=><Reveal key={`${a.owner}-${i}`} delay={i*.1}><GiftCard a={a} copied={c===i} onCopy={()=>copy(a,i)}/></Reveal>)}</div></div> }

function RSVP({ invitation }: { invitation: InvitationData }) {
  const {counts,submit,submitting,submitted}=useRsvpWishes(invitation.id); const[n,setN]=useState("");const[w,setW]=useState("");const[a,setA]=useState<Attendance>("Hadir");const[m,setM]=useState("");const[err,setErr]=useState("");
  const send=async(e:React.FormEvent)=>{e.preventDefault();setErr("");if(!n.trim()||!m.trim()){setErr("Nama dan ucapan wajib diisi.");return}const r=await submit({name:n,whatsapp:w,attendance:a,message:m});if(r.error){setErr(r.error);return}setN("");setW("");setM("")};
  return <div className={styles.rsvpBand}><div className={styles.section}><Heading kicker="Response Requested" title="RSVP & Attendance" inverse/><div className={styles.rsvpLayout}><div className={styles.attendance}><p>Attendance Report</p>{[[counts.hadir,"Hadir"],[counts.tidakHadir,"Tidak Hadir"],[counts.raguRagu,"Masih Ragu"]].map(([v,l])=><div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>{submitted?<div className={styles.thanks}><WaxSeal className={styles.thanksSeal} initials="✓"/><h3>Thank You</h3><p>Konfirmasi Anda sudah tercatat.</p></div>:<form onSubmit={send} className={styles.form}><label>Full Name<input value={n} onChange={e=>setN(e.target.value)} required/></label><label>WhatsApp<input value={w} onChange={e=>setW(e.target.value)}/></label><label>Attendance<select value={a} onChange={e=>setA(e.target.value as Attendance)}><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select></label><label>Wedding Wish<textarea rows={4} value={m} onChange={e=>setM(e.target.value)} required/></label><button disabled={submitting}>{submitting?"Sending...":"Send RSVP →"}</button>{err&&<p>{err}</p>}</form>}</div></div></div>;
}

function Wishes({ invitation }: { invitation: InvitationData }) { const{entries,totalCount,hasMore,loadMore}=useRsvpWishes(invitation.id);return <div className={styles.section}><Heading kicker="Letters To The Couple" title="Wedding Wishes"/>{totalCount===0?<p className={styles.empty}>Jadilah yang pertama mengirimkan ucapan dan doa.</p>:<><div className={styles.wishes}>{entries.map((e,i)=><Reveal key={e.id} delay={Math.min(i*.05,.25)}><article><span>LETTER 0{i+1}</span><p>“{e.message}”</p><div><b>{e.name}</b><small>{e.attendance}</small></div></article></Reveal>)}</div>{hasMore&&<button className={styles.more} onClick={loadMore}>Load More Letters</button>}</>}</div> }

function Footer({ invitation }: { invitation: InvitationData }) { return <footer className={styles.footer}><PostalStamp className={styles.footerStamp}/><p>THE FINAL EDITION</p><h2>And so,<br/>the adventure begins.</h2><div className={styles.footerNames}>{invitation.groom.name}<span>&amp;</span>{invitation.bride.name}</div><ChronicleRule className={styles.footerRule}/><small>{invitation.brand?.logoUrl && <img src={invitation.brand.logoUrl} alt="" style={{height:16,verticalAlign:"middle",marginRight:6,display:"inline-block"}}/>}© {new Date().getFullYear()} {invitation.brand?.name??"Vistiq Invitation"}</small></footer> }
function Music({url}:{url:string|null}){const{audioRef,isPlaying,toggle}=useMusicPlayer(url);if(!url)return null;return <><audio ref={audioRef} src={url} loop/><button className={styles.music} onClick={toggle} aria-label={isPlaying?"Jeda musik":"Putar musik"}>{isPlaying?"Ⅱ":"♪"}</button></>}
const nav=[["home","Top"],["couple","Couple"],["story","Story"],["event","Event"],["gallery","Gallery"],["gift","Gift"],["rsvp","RSVP"]];
function Menu(){return <nav className={styles.menu} aria-label="Navigasi undangan">{nav.map(([id,l])=><button key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}><span>◆</span>{l}</button>)}</nav>}

export default function LoveChronicle({invitation}:{invitation:InvitationData}){
  const{opened}=useInvitation();const[ready,setReady]=useState(false);useEffect(()=>{const t=setTimeout(()=>setReady(true),800);return()=>clearTimeout(t)},[]);const date=invitation.events[0]?.rawDate;
  return <div className={styles.root}><AnimatePresence>{!ready&&<Loading key="load"/>}</AnimatePresence>{ready&&!opened&&<Cover invitation={invitation}/>} {ready&&opened&&<><section id="home"><Opening invitation={invitation}/></section><section id="couple"><Couple invitation={invitation}/></section>{invitation.story.length>0&&<section id="story"><Story invitation={invitation}/></section>}{date&&<Countdown date={date}/>}<section id="event"><Events invitation={invitation}/></section>{invitation.gallery.length>0&&<section id="gallery"><Gallery invitation={invitation}/></section>}<Video invitation={invitation}/><section id="maps"><Maps invitation={invitation}/></section>{invitation.gifts.length>0&&<section id="gift"><Gift invitation={invitation}/></section>}<section id="rsvp"><RSVP invitation={invitation}/></section><Wishes invitation={invitation}/><Footer invitation={invitation}/><Music url={invitation.musicUrl}/><Menu/></>}</div>;
}
