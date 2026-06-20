import LuxuryGold from "../themes/luxury-gold/LuxuryGold";

type PageProps = {
  params: {
    slug: string;
  };
};

type Invitation = {
  id: string;
  slug: string;
  theme?: string;
  groom_name?: string;
  bride_name?: string;
  event_date?: string;
  akad_location?: string;
  reception_location?: string;
  maps_url?: string;
  bank_name?: string;
  bank_account?: string;
  bank_holder?: string;
  music_url?: string;
  cover_photo?: string;
  bride_photo?: string;
  groom_photo?: string;
  gallery_photos?: string[];
  status?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function getInvitation(slug: string): Promise<Invitation | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/invitations?slug=eq.${slug}&select=*&limit=1`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return data[0];
}

export default async function PublicInvitationPage({ params }: PageProps) {
  const invitation = await getInvitation(params.slug);

  if (!invitation || invitation.status === "inactive") {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#050505",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div>
          <h1>Undangan tidak ditemukan</h1>
          <p>Link undangan tidak aktif atau belum tersedia.</p>
        </div>
      </main>
    );
  }

  return <LuxuryGold invitation={invitation} />;
}