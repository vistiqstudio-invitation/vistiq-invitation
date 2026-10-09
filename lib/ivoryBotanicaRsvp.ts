import type { InvitationData } from "@/types/invitation";

type RsvpItem = { id:number; guest_name:string; attendance:string|null; total_guest:number|null; message:string|null; created_at:string|null };
const esc=(value:string)=>value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]||c));

export function installIvoryBotanicaRsvp(documentRoot:Document,invitation:InvitationData,guestName:string){
  const root=documentRoot.querySelector<HTMLElement>(".niku-rsvp");
  if(!root||root.dataset.vistiqRsvp==="1")return;
  root.dataset.vistiqRsvp="1";

  // The copied template may already have initialized its WordPress RSVP script before
  // the Vistiq iframe runtime runs. Neutralize all legacy restrictions/state here.
  root.setAttribute("data-post-id","0");
  root.setAttribute("data-post","0");
  root.setAttribute("data-comment-permission","public");
  root.setAttribute("data-allow-public","1");
  root.setAttribute("data-require-param","0");
  root.setAttribute("data-require-to","0");
  root.setAttribute("data-require-db","0");
  root.removeAttribute("data-static-error");
  const win=documentRoot.defaultView as (Window&{NIKU_RSVP?:unknown})|null;
  if(win)win.NIKU_RSVP=undefined;

  const name=root.querySelector<HTMLInputElement>('[data-rsvp="name"]');
  const message=root.querySelector<HTMLTextAreaElement>('[data-rsvp="message"]');
  const send=root.querySelector<HTMLButtonElement>('[data-rsvp="send"]');
  const pills=Array.from(root.querySelectorAll<HTMLElement>("[data-rsvp-pill]"));
  const total=root.querySelector<HTMLInputElement>('[data-rsvp="jumlah_tamu"]');
  const list=root.querySelector<HTMLElement>(".rsvp-list");
  const nameError=root.querySelector<HTMLElement>(".rsvp-error--name");
  const messageError=root.querySelector<HTMLElement>(".rsvp-error--message");
  const live=root.querySelector<HTMLElement>(".rsvp-live");
  if(!name||!message||!send)return;

  // Legacy runtime disables this button and displays "Khusus untuk tamu undangan"
  // when its WordPress guest parameter is absent. Vistiq uses its own invitation id.
  send.disabled=false;
  send.classList.remove("is-loading");
  if(nameError){nameError.textContent="";nameError.style.display="none"}
  if(messageError){messageError.textContent="";messageError.style.display="none"}
  if(live){live.textContent="";live.style.display="none"}
  if(guestName&&guestName!=="Bapak/Ibu/Saudara/i")name.value=guestName;

  let attendance="";
  pills.forEach(pill=>pill.addEventListener("click",event=>{
    event.preventDefault();event.stopImmediatePropagation();
    attendance=pill.getAttribute("data-rsvp-pill")||"";
    pills.forEach(item=>{item.dataset.active=item===pill?"1":"0"});
  },true));

  const render=(item:RsvpItem,prepend=false)=>{
    if(!list)return;
    const status=item.attendance==="hadir"?"Hadir":"Tidak Hadir";
    const html=`<li class="rsvp-item"><div class="rsvp-body"><div class="rsvp-headline"><span class="rsvp-name">${esc(item.guest_name)}</span> <span class="rsvp-status-label">${status}</span></div><div class="rsvp-msg">${esc(item.message||"").replace(/\n/g,"<br>")}</div></div></li>`;
    list.insertAdjacentHTML(prepend?"afterbegin":"beforeend",html);
  };

  fetch(`/api/rsvp?invitationId=${invitation.id}`,{credentials:"same-origin"})
    .then(r=>r.ok?r.json():Promise.reject())
    .then(payload=>{if(list)list.innerHTML="";(payload.items||[]).forEach((item:RsvpItem)=>render(item))})
    .catch(()=>{});

  send.addEventListener("click",async event=>{
    event.preventDefault();event.stopImmediatePropagation();
    if(nameError)nameError.style.display="none";
    if(messageError)messageError.style.display="none";
    if(!name.value.trim()){if(nameError){nameError.textContent="Nama wajib diisi.";nameError.style.display="block"}return}
    if(!message.value.trim()){if(messageError){messageError.textContent="Ucapan / doa wajib diisi.";messageError.style.display="block"}return}
    if(!["hadir","tidak"].includes(attendance)){if(nameError){nameError.textContent="Pilih konfirmasi kehadiran.";nameError.style.display="block"}return}
    send.disabled=true;send.classList.add("is-loading");
    try{
      const response=await fetch("/api/rsvp",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({invitationId:invitation.id,guestName:name.value,message:message.value,attendance,totalGuest:Number(total?.value||1)})});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||"RSVP gagal disimpan.");
      render(payload.item,true);message.value="";attendance="";pills.forEach(item=>{item.dataset.active="0"});
      if(live){live.textContent="Terima kasih, RSVP berhasil dikirim.";live.style.display="block"}
    }catch(error){if(messageError){messageError.textContent=error instanceof Error?error.message:"RSVP gagal disimpan.";messageError.style.display="block"}}
    finally{send.disabled=false;send.classList.remove("is-loading")}
  },true);
}
