import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", "andi-siti")
    .single();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7f4ef",
        color: "#8b6b3d",
      }}
    >
      <h1>
        {data?.groom_name} & {data?.bride_name}
      </h1>

      <p>{data?.event_date}</p>

      <p>{data?.location}</p>
    </main>
  );
}