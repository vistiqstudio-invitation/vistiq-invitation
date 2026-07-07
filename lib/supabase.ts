import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Jangan langsung throw di top-level file kalau env var belum ada.
// Kalau kosong (misalnya belum di-set di Vercel), komponen yang mengimpor
// file ini akan gagal "undefined" dan React menampilkan error
// "Element type is invalid". Dengan guard ini, aplikasi tetap jalan dan
// hanya fitur yang butuh Supabase yang dinonaktifkan.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase && typeof window !== "undefined") {
  console.warn(
    "[Vistiq] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum di-set. " +
      "Fitur RSVP & Wishes tidak akan menyimpan data sampai env var ini di-set di Vercel Project Settings."
  );
}