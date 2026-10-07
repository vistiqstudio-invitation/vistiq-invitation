import { requireActiveClient } from "@/lib/supabase/dal";
import InvitationEventsShortcut from "@/components/InvitationEventsShortcut";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireActiveClient();
  return (
    <>
      {children}
      <InvitationEventsShortcut mode="client" />
    </>
  );
}
