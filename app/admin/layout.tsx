import { requireRole } from "@/lib/supabase/dal";
import R2StorageMonitor from "@/components/admin/R2StorageMonitor";
import LegacyMitraBrandAdminGuard from "@/components/admin/LegacyMitraBrandAdminGuard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["owner"]);
  return (
    <>
      {children}
      <LegacyMitraBrandAdminGuard />
      <R2StorageMonitor />
    </>
  );
}
