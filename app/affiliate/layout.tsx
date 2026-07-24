import { requireRole } from "@/lib/supabase/dal";
export default async function AffiliateLayout({children}:{children:React.ReactNode}){await requireRole(["affiliate"]);return children;}
