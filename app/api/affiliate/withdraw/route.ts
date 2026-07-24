import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";
export async function POST(request:Request){
 const profile=await getSessionProfile();if(!profile||profile.role!=="affiliate")return NextResponse.json({error:"Tidak diizinkan."},{status:403});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return NextResponse.json({error:"Konfigurasi belum lengkap."},{status:503});
 const body=await request.json(),bank=String(body.bank_name||"").trim(),number=String(body.account_number||"").trim(),name=String(body.account_name||"").trim();if(!bank||!number||!name)return NextResponse.json({error:"Lengkapi data rekening."},{status:400});
 const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});await supabase.rpc("refresh_affiliate_commissions");
 const {data:a}=await supabase.from("affiliates").select("id").eq("user_id",profile.id).single();if(!a)return NextResponse.json({error:"Data affiliate tidak ditemukan."},{status:404});
 const {data:c}=await supabase.from("affiliate_commissions").select("id,commission_amount").eq("affiliate_id",a.id).eq("status","available");const amount=(c??[]).reduce((n,x)=>n+Number(x.commission_amount),0);if(amount<100000)return NextResponse.json({error:"Saldo tersedia belum mencapai Rp100.000."},{status:400});
 const {error}=await supabase.from("affiliate_withdrawals").insert({affiliate_id:a.id,amount,bank_name:bank,account_number:number,account_name:name});if(error)return NextResponse.json({error:"Permintaan belum dapat disimpan."},{status:500});
 await supabase.from("affiliate_commissions").update({status:"requested"}).in("id",(c??[]).map(x=>x.id));return NextResponse.json({success:true});
}
