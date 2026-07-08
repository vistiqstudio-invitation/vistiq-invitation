import { requireRole } from "@/lib/supabase/dal";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["owner"]);
  return children;
}
