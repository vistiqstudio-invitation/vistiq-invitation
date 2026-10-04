import { requireRole } from "@/lib/supabase/dal";
import R2StorageMonitor from "@/components/admin/R2StorageMonitor";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["owner"]);
  return (
    <>
      {children}
      <R2StorageMonitor />
    </>
  );
}
