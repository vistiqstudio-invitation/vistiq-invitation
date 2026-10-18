import { requireRole } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import InvitationEventsShortcut from "@/components/InvitationEventsShortcut";
import ResellerBillingNotice from "@/components/reseller/ResellerBillingNotice";
import QuickClientCreator from "@/components/reseller/QuickClientCreator";

export default async function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(["reseller"]);
  const supabase = await createClient();
  const { data: reseller } = await supabase
    .from("resellers")
    .select("package")
    .eq("user_id", profile.id)
    .maybeSingle();

  return (
    <>
      {children}
      <QuickClientCreator />
      <InvitationEventsShortcut mode="reseller" />
      <ResellerBillingNotice packageName={reseller?.package ?? null} />
    </>
  );
}
