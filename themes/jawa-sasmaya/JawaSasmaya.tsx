"use client";
import { useCallback, useEffect, useRef } from "react";
import { useInvitation } from "@/components/InvitationProvider";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const asset = "/themes/jawa-sasmaya/reference/index.html";
const first = (name: string) => name.trim().split(/\s+/)[0] || "";
const dateParts = (date?: string | null) => {
  const match = String(date || "").match(/(\d{1,2})\s+(\S+)\s+(\d{4})/);
  return match && [match[1],match[2],match[3]];
};

export default function JawaSasmaya({invitation}:{invitation:InvitationData}) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const {opened,setOpened} = useInvitation();
  const rsvp = useRsvpWishes(invitation.id);
  const rsvpRef = useRef(rsvp);
  useEffect(()=>{rsvpRef.current=rsvp;},[rsvp]);

  const populate = useCallback(() => {
    const doc = iframe.current?.contentDocument;
    if (!doc) return;
    if (!doc.body.dataset.vistiqRevealBound) {
      doc.body.dataset.vistiqRevealBound = "1";
      const observer = new IntersectionObserver(entries => {
        entries.forEach(({target,isIntersecting}) => {
          if (!isIntersecting) return;
          const element = target as HTMLElement;
          let animation = "fadeInUp";
          try { animation = JSON.parse(element.dataset.settings || "{}")._animation || animation; } catch {}
          element.classList.remove("elementor-invisible");
          element.classList.add("animated", animation);
          if (element.hasAttribute("data-aos")) element.classList.add("aos-animate");
          observer.unobserve(element);
        });
      },{rootMargin:"80px 0px",threshold:0.01});
      doc.querySelectorAll<HTMLElement>(".elementor-invisible,[data-aos]").forEach(el => observer.observe(el));
    }
    const cover = invitation.coverImage || invitation.gallery[0] || invitation.groom.photo || "/photos/jawa-cover.webp";
    const photos = invitation.gallery.length ? invitation.gallery : [cover];
    const names:Record<string,string> = {
      "Rizky & Nabila": first(invitation.groom.name)+" & "+first(invitation.bride.name),
      "Rizky Pratama": invitation.groom.name,
      "Nabila Putri": invitation.bride.name,
      "Bapak Rahmat & Ibu Dewi": invitation.groom.parents || "",
      "Bapak Hadi & Ibu Sari": invitation.bride.parents || "",
      "Vistiq Invitation": invitation.brand?.name || "Vistiq Invitation",
    };
    doc.querySelectorAll("h1,h2,h3,p,span,strong,small").forEach(el => {
      for (const child of Array.from(el.childNodes)) if (child.nodeType === 3) {
        let value = child.textContent || "";
        for (const [from,to] of Object.entries(names)) value = value.replaceAll(from,to);
        child.textContent = value;
      }
    });
    const images:Record<string,string> = {
      "/photos/jawa-cover.webp": cover,
      "/photos/jawa-bride.webp": invitation.bride.photo || photos[1] || cover,
      "/photos/jawa-groom.webp": invitation.groom.photo || photos[2] || cover,
    };
    doc.querySelectorAll<HTMLImageElement>("img").forEach(img => {
      const original = img.getAttribute("src") || "";
      if (images[original]) img.src = images[original];
    });
    doc.querySelectorAll<HTMLElement>(".e-gallery-image").forEach((el,i) => {
      const src = photos[i % photos.length];
      el.style.backgroundImage = "url("+JSON.stringify(src)+")";
      el.closest("a")?.setAttribute("href",src);
    });
    const opening = doc.querySelector<HTMLElement>(".elementor-element-662bb3ba");
    if (opening) opening.style.display = opened ? "none" : "";
    const open = doc.querySelector<HTMLAnchorElement>("#tombol-buka a");
    if (open) open.onclick = e => {
      e.preventDefault(); setOpened(true);
      if (opening) opening.style.display = "none";
      doc.querySelector("#cover")?.scrollIntoView({behavior:"smooth"});
      audio.current?.play().catch(()=>{});
    };
    const date = dateParts((invitation.coverEvent || invitation.events[1] || invitation.events[0])?.date);
    if (date) {
      const headings = Array.from(doc.querySelectorAll<HTMLElement>("h2.elementor-heading-title"));
      const i = headings.findIndex(h => h.textContent?.trim() === "21");
      if (i >= 0) [date[0],date[1],date[2].slice(-2)].forEach((x,n)=> {headings[i+n].textContent=x;});
    }
    const eventSections = ["37eae226","47e22cc"];
    invitation.events.slice(0,2).forEach((event,i) => {
      const section = doc.querySelector<HTMLElement>(".elementor-element-"+eventSections[i]);
      if (!section) return;
      const headings = Array.from(section.querySelectorAll<HTMLElement>("h2.elementor-heading-title"));
      const d = dateParts(event.date);
      const weekday = event.date?.split(",")[0];
      const values = [event.name,weekday,d?.[0],d?.[1],d?.[2],"Waktu: "+event.time,event.location];
      values.forEach((value,j)=>{if(value && headings[j]) headings[j].textContent=value;});
    });
    const anchors = Array.from(doc.querySelectorAll<HTMLAnchorElement>("a"));
    anchors.filter(a=>a.textContent?.includes("Google Maps")).forEach(a=>{
      a.href=invitation.mapsUrl || invitation.mapsEmbedUrl || "#";
      a.target="_blank";a.rel="noopener noreferrer";
    });
    anchors.filter(a=>a.getAttribute("href")==="https://instagram.com/").slice(0,2).forEach((a,i)=>{
      const handle=[invitation.bride.instagram,invitation.groom.instagram][i];
      if (!handle) a.style.display="none";
      else a.href=/^https?:\/\//.test(handle)?handle:"https://instagram.com/"+handle.replace(/^@/,"");
    });
    const live=anchors.find(a=>a.textContent?.includes("Join Live"));
    if(live){if(invitation.liveStreamingUrl)live.href=invitation.liveStreamingUrl;else live.style.display="none";}
    const storyHeading=Array.from(doc.querySelectorAll<HTMLElement>("h2")).find(h=>h.textContent?.trim()==="Love Story");
    const storyContainer=storyHeading?.closest(".e-con-inner");
    if(storyContainer && invitation.story.length){
      const descriptions=Array.from(storyContainer.querySelectorAll<HTMLElement>("h2.elementor-heading-title"))
        .filter(h=>h!==storyHeading);
      const titles=Array.from(storyContainer.querySelectorAll<HTMLElement>("h3.elementor-heading-title"));
      invitation.story.slice(0,descriptions.length).forEach((item,i)=>{
        if(descriptions[i]) descriptions[i].textContent=item.description;
        if(titles[i]) titles[i].textContent=item.title;
      });
    }
    const giftNumbers=Array.from(doc.querySelectorAll<HTMLElement>("h2.elementor-heading-title"))
      .filter(h=>/^\d{10,16}$/.test(h.textContent?.trim()||""));
    giftNumbers.forEach((h,i)=>{
      const item=invitation.gifts[i];
      const card=h.closest<HTMLElement>(".e-con-full");
      if(!item){card?.classList.add("vistiq-hidden");return;}
      h.textContent=item.accountNumber;
      const owner=Array.from(card?.querySelectorAll<HTMLElement>("h2.elementor-heading-title")||[])
        .find(el=>el!==h && /^(Nabila|Rizky)$/.test(el.textContent?.trim()||""));
      if(owner)owner.textContent=item.accountName||item.owner||"";
    });
    const gift=anchors.find(a=>a.textContent?.includes("Konfirmasi Hadiah"));
    if(gift){const phone=String(invitation.contactWhatsapp||"").replace(/\D/g,"").replace(/^0/,"62");gift.href=phone?"https://wa.me/"+phone:"#";}
    const form=doc.querySelector<HTMLFormElement>("form[data-vistiq-rsvp]");
    if(form) form.onsubmit=async e=>{
      e.preventDefault();
      const data=new FormData(form), name=String(data.get("author")||"").trim(), message=String(data.get("comment")||"").trim();
      if(!name||!message)return;
      const attendance=({present:"Hadir",notpresent:"Tidak Hadir",notsure:"Masih Ragu"} as Record<string,Attendance>)[String(data.get("attendance"))]||"Hadir";
      const result=await rsvpRef.current.submit({name,message,attendance,whatsapp:""});
      if(!result.error)form.reset();
    };
  },[invitation,opened,setOpened]);
  useEffect(()=>{populate();},[populate]);
  useEffect(()=>{
    const doc=iframe.current?.contentDocument;
    const list=doc?.querySelector<HTMLElement>("#saic-container-comment-4017");
    if(!doc||!list)return;
    list.replaceChildren(...rsvp.entries.map(entry=>{
      const li=doc.createElement("li");li.className="saic-item-comment";
      const name=doc.createElement("strong");name.textContent=entry.name;
      const message=doc.createElement("p");message.textContent=entry.message;
      li.append(name,message);return li;
    }));
  },[rsvp.entries]);
  return <div className={styles.shell}>
    <iframe title={"Undangan "+invitation.groom.name+" dan "+invitation.bride.name} ref={iframe} src={asset} onLoad={populate} className={styles.frame}/>
    {invitation.musicUrl&&<audio ref={audio} src={invitation.musicUrl} loop/>}
  </div>;
}
