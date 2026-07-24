import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";

export async function POST(request:Request){
  const profile=await getSessionProfile();
  if(!profile||profile.role!=="owner")return NextResponse.json({error:"Tidak diizinkan."},{status:403});
  const {id,status}=await request.json();
  if(!["paid","rejected"].includes(status))return NextResponse.json({error:"Status tidak valid."},{status:400});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return NextResponse.json({error:"Konfigurasi belum lengkap."},{status:503});
  const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:withdrawal}=await supabase.from("affiliate_withdrawals").select("*").eq("id",id).eq("status","pending").single();
  if(!withdrawal)return NextResponse.json({error:"Permintaan tidak ditemukan."},{status:404});
  await supabase.from("affiliate_withdrawals").update({status,processed_at:new Date().toISOString()}).eq("id",id);
  await supabase.from("affiliate_commissions").update({status:status==="paid"?"paid":"available",paid_at:status==="paid"?new Date().toISOString():null}).eq("affiliate_id",withdrawal.affiliate_id).eq("status","requested");
  return NextResponse.json({success:true});
}
