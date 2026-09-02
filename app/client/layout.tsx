import { requireActiveClient } from "@/lib/supabase/dal";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireActiveClient();
  return children;
}
