import { requireRole } from "@/lib/supabase/dal";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["client"]);
  return children;
}
