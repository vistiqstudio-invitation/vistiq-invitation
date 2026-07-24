"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
export default function AffiliateReferralTracker(){
  const params=useSearchParams();
  useEffect(()=>{
    const ref=(params.get("ref")||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,32);
    if(ref)document.cookie=`vistiq_ref=${encodeURIComponent(ref)};path=/;max-age=2592000;samesite=lax`;
  },[params]);
  return null;
}
