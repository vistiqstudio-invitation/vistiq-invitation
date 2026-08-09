import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getHostname } from "@/lib/customDomain";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const protectedPrefixes = ["/admin", "/reseller", "/client", "/affiliate"];

const PLATFORM_HOSTS = new Set([
  "vistiqinvitation.com",
  "www.vistiqinvitation.com",
  "localhost",
  "127.0.0.1",
]);

async function resellerForDomain(domain: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const response = await fetch(`${url}/rest/v1/rpc/get_reseller_by_custom_domain`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_domain: domain }),
    next: { revalidate: 60 },
  });
  if (!response.ok) return null;
  const rows = await response.json();
  return Array.isArray(rows) ? rows[0] : rows;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getHostname(request.headers.get("x-forwarded-host") || request.headers.get("host"));
  const deploymentHost = getHostname(process.env.VERCEL_URL || null);
  const headers = new Headers(request.headers);
  let tenant: { reseller_id?: string } | null = null;

  const isPlatformHost = !hostname || PLATFORM_HOSTS.has(hostname) || hostname === deploymentHost || hostname.endsWith(".vercel.app");
  if (!isPlatformHost) {
    tenant = await resellerForDomain(hostname);
    if (tenant?.reseller_id) {
      headers.set("x-vistiq-reseller-id", tenant.reseller_id);
      headers.set("x-vistiq-custom-domain", hostname);
    }
  }

  if (tenant?.reseller_id && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/promo/${tenant.reseller_id}`;
    return NextResponse.rewrite(url, { request: { headers } });
  }

  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (!isProtected || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.next({ request: { headers } });
  }

  let response = NextResponse.next({ request: { headers } });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request: { headers } });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?)$).*)"],
};
