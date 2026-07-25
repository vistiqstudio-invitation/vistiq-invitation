import { notFound } from "next/navigation";
import { requireRole } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { getInvitationBySlug } from "@/lib/invitation";
import { themeRegistry, aqiqahThemeRegistry, khitanThemeRegistry } from "@/lib/theme";
import SmartCoverRuntime from "@/components/SmartCoverRuntime";

type Props = {
  params: Promise<{ slug: string }>;
};

// Same rendering as app/[slug]/page.tsx, but for logged-in reseller/owner
// dashboards only, and it ignores is_active entirely - a reseller needs to
// see their draft before payment is confirmed, while the public /[slug]
// route stays gated to active invitations only.
export default async function PreviewPage({ params }: Props) {
  const { slug } = await params;
  const profile = await requireRole(["owner", "reseller"]);

  const supabase = await createClient();
  const { data: invitationRow } = await supabase
    .from("invitations")
    .select("client_id")
    .eq("slug", slug)
    .single();

  if (!invitationRow) notFound();

  if (invitationRow.client_id) {
    // clients_select RLS already scopes this to "owner sees everything" or
    // "reseller sees only their own clients" - an empty result here means
    // this reseller doesn't own the client behind this invitation.
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("id", invitationRow.client_id)
      .single();

    if (!client) notFound();
  } else if (profile.role !== "owner") {
    // No client attached (legacy/owner-created invitation) - only the
    // owner can preview those.
    notFound();
  }

  const invitation = await getInvitationBySlug(slug);
  if (!invitation) notFound();

  if (invitation.category === "aqiqah") {
    const Theme = aqiqahThemeRegistry[invitation.theme] || aqiqahThemeRegistry["akikah-nur"];
    return (
      <SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.baby.name}>
        <Theme invitation={invitation} />
      </SmartCoverRuntime>
    );
  }

  if (invitation.category === "khitan") {
    const Theme = khitanThemeRegistry[invitation.theme] || khitanThemeRegistry["khitan-warna"];
    return (
      <SmartCoverRuntime coverImage={invitation.coverImage} title={invitation.child.name}>
        <Theme invitation={invitation} />
      </SmartCoverRuntime>
    );
  }

  const Theme = themeRegistry[invitation.theme] || themeRegistry["luxury-gold"];

  return (
    <SmartCoverRuntime
      coverImage={invitation.coverImage}
      title={`${invitation.groom.name} & ${invitation.bride.name}`}
    >
      <Theme invitation={invitation} />
    </SmartCoverRuntime>
  );
}
