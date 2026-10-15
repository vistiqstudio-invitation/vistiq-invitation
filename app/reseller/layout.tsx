import { requireRole } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import InvitationEventsShortcut from "@/components/InvitationEventsShortcut";
import ResellerBillingNotice from "@/components/reseller/ResellerBillingNotice";
import QuickClientCreator from "@/components/reseller/QuickClientCreator";
import ExpiredBrandGate from "@/components/reseller/ExpiredBrandGate";

export default async function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(["reseller"]);
  const supabase = await createClient();
  const { data: reseller } = await supabase
    .from("resellers")
    .select("package, brand_expires_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  const isExpiredBrand =
    reseller?.package === "reseller_brand" &&
    Boolean(reseller.brand_expires_at) &&
    new Date(reseller.brand_expires_at as string).getTime() <= Date.now();

  if (isExpiredBrand) {
    return <ExpiredBrandGate />;
  }

  return (
    <>
      {children}
      <QuickClientCreator />
      <InvitationEventsShortcut mode="reseller" />
      <ResellerBillingNotice packageName={reseller?.package ?? null} />
    </>
  );
}
