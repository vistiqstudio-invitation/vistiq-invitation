"use client";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

const NAV=[{key:"dashboard",label:"Dashboard",href:"/affiliate"}];
type Affiliate={id:string;name:string;referral_code:string;bank_name?:string;account_number?:string;account_name?:string};
type Commission={id:string;order_id:string;package_id:string;sale_amount:number;commission_amount:number;status:string;available_at:string;created_at:string};
export default function AffiliatePage(){
 const router=useRouter(),supabase=createClient();const [affiliate,setAffiliate]=useState<Affiliate|null>(null);const [commissions,setCommissions]=useState<Commission[]>([]);const [form,setForm]=useState({bank_name:"",account_number:"",account_name:""});const [copied,setCopied]=useState(false);
 const load=async()=>{await supabase.rpc("refresh_affiliate_commissions");const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data:a}=await supabase.from("affiliates").select("*").eq("user_id",user.id).single();if(!a)return;setAffiliate(a);setForm({bank_name:a.bank_name||"",account_number:a.account_number||"",account_name:a.account_name||""});const {data:c}=await supabase.from("affiliate_commissions").select("*").eq("affiliate_id",a.id).order("created_at",{ascending:false});setCommissions(c??[]);};
 useEffect(()=>{load();},[]); // eslint-disable-line react-hooks/exhaustive-deps
 const available=commissions.filter(x=>x.status==="available").reduce((n,x)=>n+Number(x.commission_amount),0);const held=commissions.filter(x=>x.status==="held").reduce((n,x)=>n+Number(x.commission_amount),0);const paid=commissions.filter(x=>x.status==="paid").reduce((n,x)=>n+Number(x.commission_amount),0);
 const link=affiliate?`https://www.vistiqinvitation.com/?ref=${affiliate.referral_code}`:"";
 const saveBank=async()=>{if(!affiliate)return;const {error}=await supabase.from("affiliates").update(form).eq("id",affiliate.id);if(error)return alert(error.message);alert("Data rekening tersimpan.");};
 const withdraw=async()=>{if(available<100000)return alert("Saldo tersedia belum mencapai Rp100.000.");if(!form.bank_name||!form.account_number||!form.account_name)return alert("Lengkapi data rekening dahulu.");const response=await fetch("/api/affiliate/withdraw",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const result=await response.json();if(!response.ok)return alert(result.error||"Permintaan gagal.");alert("Permintaan pencairan berhasil dikirim.");load();};
 const logout=async()=>{await supabase.auth.signOut();router.push("/login");};
 return <main className={styles.page}><DashboardSidebar brandTop="VISTIQ" brandBottom="Affiliate" items={NAV} activeKey="dashboard" onLogout={logout}/><section className={styles.content}>
  <header className={styles.header}><div><p className={styles.label}>AFFILIATE DASHBOARD</p><h1 className={styles.title}>Halo, {affiliate?.name||"Affiliate"}</h1><p className={styles.subtitle}>Bagikan link Anda dan pantau komisi 30%.</p></div><button className={styles.button} onClick={load}>Refresh</button></header>
  <section className={styles.formCard}><h2 className={styles.sectionTitle}>Link Referral Anda</h2><div className={styles.linkBox}>{link}</div><button className={styles.button} onClick={async()=>{await navigator.clipboard.writeText(link);setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?"Berhasil Disalin":"Salin Link"}</button></section>
  <section className={styles.stats}><Card t="Komisi Ditahan" v={held}/><Card t="Saldo Tersedia" v={available}/><Card t="Sudah Dicairkan" v={paid}/><Card t="Total Transaksi" v={commissions.length}/></section>
  <section className={styles.formCard}><h2 className={styles.sectionTitle}>Rekening Pencairan</h2><div className={styles.form}><input className={styles.input} placeholder="Nama bank / e-wallet" value={form.bank_name} onChange={e=>setForm({...form,bank_name:e.target.value})}/><input className={styles.input} placeholder="Nomor rekening" value={form.account_number} onChange={e=>setForm({...form,account_number:e.target.value})}/><input className={styles.input} placeholder="Nama pemilik rekening" value={form.account_name} onChange={e=>setForm({...form,account_name:e.target.value})}/><div className={styles.actions}><button className={styles.exportButton} onClick={saveBank}>Simpan Rekening</button><button className={styles.button} onClick={withdraw}>Ajukan Pencairan</button></div></div><p className={styles.subtitle}>Minimal pencairan Rp100.000. Komisi tersedia 7 hari setelah pembayaran berhasil.</p></section>
  <section className={styles.formCard}><h2 className={styles.sectionTitle}>Riwayat Komisi</h2>{commissions.length===0?<p>Belum ada transaksi dari link Anda.</p>:commissions.map(c=><div key={c.id} style={{padding:"14px 0",borderBottom:"1px solid #e2e8f0"}}><b>{c.order_id}</b><p style={{margin:"5px 0",color:"#64748b"}}>{c.package_id} · Penjualan Rp {Number(c.sale_amount).toLocaleString("id-ID")} · Komisi Rp {Number(c.commission_amount).toLocaleString("id-ID")} · {c.status}</p></div>)}</section>
 </section></main>;
}
function Card({t,v}:{t:string;v:number}){return <div className={styles.statCard}><p>{t}</p><h2>{t==="Total Transaksi"?v:`Rp ${v.toLocaleString("id-ID")}`}</h2></div>}
