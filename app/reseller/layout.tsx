import { requireRole } from "@/lib/supabase/dal";
import InvitationEventsShortcut from "@/components/InvitationEventsShortcut";

export default async function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["reseller"]);
  return (
    <>
      {children}
      <InvitationEventsShortcut mode="reseller" />
    </>
  );
}
