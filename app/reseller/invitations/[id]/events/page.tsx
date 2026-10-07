"use client";

import { useParams } from "next/navigation";
import InvitationEventsEditor from "@/components/InvitationEventsEditor";

export default function ResellerInvitationEventsPage() {
  const params = useParams<{ id: string }>();
  return <InvitationEventsEditor mode="reseller" invitationId={params.id} />;
}
