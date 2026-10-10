import { redirect } from "next/navigation";
import InvitationPage, { generateMetadata } from "../[slug]/page";

export { generateMetadata };

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NoviaMuliaPage({ searchParams }: Props) {
  const query = await searchParams;
  const rawTo = query.to;
  const guest = Array.isArray(rawTo) ? rawTo[0]?.trim() : rawTo?.trim();

  if (!guest) {
    redirect("/novia-mulia?to=Tamu%20Undangan");
  }

  return InvitationPage({
    params: Promise.resolve({ slug: "novia-mulia" }),
  });
}
