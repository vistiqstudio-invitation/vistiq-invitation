"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/admin" },
  { key: "clients", label: "Client", href: "/admin/clients" },
  { key: "resellers", label: "Reseller", href: "/admin/resellers" },
  { key: "affiliates", label: "Affiliate", href: "/admin/affiliates" },
  { key: "invitations", label: "Undangan", href: "/admin/invitations" },
  { key: "rsvp", label: "RSVP", href: "/admin/rsvp" },
  { key: "transactions", label: "Transaksi", href: "/admin/transactions" },
];

type Application = { id:string; name:string; email:string; whatsapp:string; promotion_channel?:string; status:string; created_at:string };
type Affiliate = { id:string; name:string; email:string; whatsapp:string; referral_code:string; status:string; commission_percent:number; created_at:string };
type Withdrawal = { id:string; amount:number; status:string; requested_at:string; bank_name:string; account_number:string; account_name:string; affiliates?:{name:string} };

export default function AdminAffiliatesPage() {
  const router = useRouter(); const supabase = createClient();
  const [applications,setApplications]=useState<Application[]>([]);
  const [affiliates,setAffiliates]=useState<Affiliate[]>([]);
  const [withdrawals,setWithdrawals]=useState<Withdrawal[]>([]);
  const [processing,setProcessing]=useState<string|null>(null);
  const [credentials,setCredentials]=useState<{name:string;email:string;password:string;referralCode:string;whatsapp:string}|null>(null);

  const load = async () => {
    const [a,b,c]=await Promise.all([
      supabase.from("affiliate_applications").select("*").order("created_at",{ascending:false}),
      supabase.from("affiliates").select("*").order("created_at",{ascending:false}),
      supabase.from("affiliate_withdrawals").select("*, affiliates(name)").order("requested_at",{ascending:false}),
    ]);
    setApplications(a.data??[]); setAffiliates(b.data??[]); setWithdrawals((c.data??[]) as Withdrawal[]);
  };
  useEffect(()=>{load();},[]); // eslint-disable-line react-hooks/exhaustive-deps
  const logout=async()=>{await supabase.auth.signOut();router.push("/login");};
  const review=async(item:Application,action:"approve"|"reject")=>{
    setProcessing(item.id);
    const response=await fetch("/api/admin/affiliates",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({applicationId:item.id,action})});
    const result=await response.json(); setProcessing(null);
    if(!response.ok)return alert(result.error||"Gagal memproses.");
    if(action==="approve")setCredentials({name:item.name,email:result.email,password:result.password,referralCode:result.referralCode,whatsapp:item.whatsapp});
    load();
  };
  const payout=async(id:string,status:"paid"|"rejected")=>{
    const response=await fetch("/api/admin/affiliate-withdrawals",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});
    const result=await response.json(); if(!response.ok)return alert(result.error||"Gagal memproses pencairan."); load();
  };
  const message=credentials?`Halo Kak *${credentials.name}* 👋

Selamat! Pendaftaran Affiliate Vistiq Invitation Kakak sudah disetujui. 🎉

🌐 Login: https://www.vistiqinvitation.com/login
📧 Email: *${credentials.email}*
🔐 Password sementara: *${credentials.password}*
🔗 Kode referral: *${credentials.referralCode}*

Silakan login, ganti password, lalu salin link referral dari dashboard Affiliate. Komisi 30% berlaku untuk semua paket, tersedia setelah 7 hari, dan dapat dicairkan mulai Rp100.000.`:"";
  const sendWa=()=>credentials&&window.open(`https://wa.me/${credentials.whatsapp.replace(/\D/g,"").replace(/^0/,"62")}?text=${encodeURIComponent(message)}`,"_blank");

  return <main className={styles.page}>
    <DashboardSidebar brandTop="VISTIQ" brandBottom="Invitation" items={NAV_ITEMS} activeKey="affiliates" notificationRole="owner" onLogout={logout}/>
    <section className={styles.content}>
      <header className={styles.header}><div><p className={styles.label}>OWNER MENU</p><h1 className={styles.title}>Program Affiliate</h1><p className={styles.subtitle}>Setujui pendaftaran, pantau affiliate, dan proses pencairan.</p></div><button className={styles.button} onClick={load}>Refresh</button></header>
      {credentials&&<section className={styles.formCard}><h2 className={styles.sectionTitle}>Akun Affiliate Berhasil Dibuat</h2><div className={styles.linkBox} style={{whiteSpace:"pre-wrap"}}>{message}</div><div className={styles.actions}><button className={styles.button} onClick={()=>navigator.clipboard.writeText(message)}>Salin Pesan</button><button className={styles.exportButton} onClick={sendWa}>Kirim ke WhatsApp</button><button className={styles.exportButton} onClick={()=>setCredentials(null)}>Tutup</button></div></section>}
      <section className={styles.formCard}><h2 className={styles.sectionTitle}>Pendaftaran Menunggu Persetujuan</h2>
        {applications.filter(x=>x.status==="pending").length===0?<p>Belum ada pendaftaran baru.</p>:applications.filter(x=>x.status==="pending").map(item=><div key={item.id} style={row}><div><b>{item.name}</b><p style={meta}>{item.email} · {item.whatsapp}<br/>{item.promotion_channel||"Media promosi belum diisi"}</p></div><div className={styles.actions}><button disabled={processing===item.id} className={styles.button} onClick={()=>review(item,"approve")}>Setujui</button><button disabled={processing===item.id} className={styles.deleteButton} onClick={()=>review(item,"reject")}>Tolak</button></div></div>)}
      </section>
      <section className={styles.formCard}><h2 className={styles.sectionTitle}>Affiliate Aktif ({affiliates.length})</h2>
        {affiliates.map(item=><div key={item.id} style={row}><div><b>{item.name}</b><p style={meta}>{item.email} · {item.whatsapp}</p></div><div><code>{item.referral_code}</code><p style={meta}>Komisi {item.commission_percent}% · {item.status}</p></div></div>)}
      </section>
      <section className={styles.formCard}><h2 className={styles.sectionTitle}>Permintaan Pencairan</h2>
        {withdrawals.filter(x=>x.status==="pending").length===0?<p>Belum ada permintaan pencairan.</p>:withdrawals.filter(x=>x.status==="pending").map(item=><div key={item.id} style={row}><div><b>{item.affiliates?.name||"Affiliate"} · Rp {Number(item.amount).toLocaleString("id-ID")}</b><p style={meta}>{item.bank_name} · {item.account_number} · {item.account_name}</p></div><div className={styles.actions}><button className={styles.button} onClick={()=>payout(item.id,"paid")}>Tandai Dibayar</button><button className={styles.deleteButton} onClick={()=>payout(item.id,"rejected")}>Tolak</button></div></div>)}
      </section>
    </section>
  </main>;
}
const row:React.CSSProperties={display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,padding:"16px 0",borderBottom:"1px solid #e2e8f0",flexWrap:"wrap"};
const meta:React.CSSProperties={margin:"6px 0 0",color:"#64748b",fontSize:13,lineHeight:1.6};
