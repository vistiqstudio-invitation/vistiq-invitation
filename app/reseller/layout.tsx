import { requireRole } from "@/lib/supabase/dal";

export default async function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["reseller"]);
  return children;
}
