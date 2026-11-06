import "server-only";

const API = "https://api.cloudflare.com/client/v4";
const FALLBACK = "customers.vistiqinvitation.com";

type RecordInstruction = { type: "TXT" | "CNAME"; name: string; value: string };
type CloudflareHostname = {
  id: string;
  hostname: string;
  status?: string;
  ownership_verification?: { type?: string; name?: string; value?: string };
  ssl?: {
    status?: string;
    txt_name?: string;
    txt_value?: string;
    validation_records?: Array<{ txt_name?: string; txt_value?: string; cname?: string; cname_target?: string }>;
  };
};

export type DomainStatus = {
  domain: string;
  status: "pending_dns" | "active";
  verified: boolean;
  configured: boolean;
  hostnameStatus: string;
  certificateStatus: string;
  dns: { type: "CNAME"; name: string; value: string };
  verification: RecordInstruction[];
  routingReady: boolean;
};

function settings() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zone = process.env.CLOUDFLARE_ZONE_ID;
  if (!token || !zone) {
    throw new Error("CLOUDFLARE_API_TOKEN dan CLOUDFLARE_ZONE_ID belum dikonfigurasi di server.");
  }
  return { token, zone };
}

async function cfRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const { token, zone } = settings();
  const response = await fetch(`${API}/zones/${encodeURIComponent(zone)}/custom_hostnames${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.success) {
    const error = json?.errors?.map((entry: { message?: string }) => entry.message).filter(Boolean).join("; ");
    throw new Error(error || "Layanan Cloudflare tidak dapat memproses domain.");
  }
  return json.result as T;
}

async function findHostname(domain: string): Promise<CloudflareHostname | null> {
  const matches = await cfRequest<CloudflareHostname[]>(`?hostname=${encodeURIComponent(domain)}&per_page=50`);
  return matches.find((item) => item.hostname.toLowerCase() === domain.toLowerCase()) || null;
}

function statusFor(item: CloudflareHostname): DomainStatus {
  const sslActive = item.ssl?.status === "active";
  const hostnameActive = item.status === "active";
  // Cloudflare's active status does not by itself prove that the SaaS fallback
  // is connected to the Vistiq Worker. Enable this flag only after end-to-end checks.
  const routingReady = process.env.CLOUDFLARE_CUSTOM_DOMAIN_ROUTING_READY === "true";
  const verified = hostnameActive && sslActive;
  const instructions: RecordInstruction[] = [];
  const add = (type: RecordInstruction["type"], name?: string, value?: string) => {
    if (name && value && !instructions.some((entry) => entry.type === type && entry.name === name && entry.value === value)) {
      instructions.push({ type, name, value });
    }
  };
  add("TXT", item.ownership_verification?.name, item.ownership_verification?.value);
  add("TXT", item.ssl?.txt_name, item.ssl?.txt_value);
  item.ssl?.validation_records?.forEach((record) => {
    add("TXT", record.txt_name, record.txt_value);
    add("CNAME", record.cname, record.cname_target);
  });
  return {
    domain: item.hostname,
    status: verified && routingReady ? "active" : "pending_dns",
    verified,
    configured: hostnameActive,
    hostnameStatus: item.status || "pending",
    certificateStatus: item.ssl?.status || "pending",
    dns: { type: "CNAME", name: item.hostname.split(".").length === 2 ? "@" : item.hostname, value: FALLBACK },
    verification: instructions,
    routingReady,
  };
}

export async function getCloudflareDomainStatus(domain: string): Promise<DomainStatus> {
  const hostname = await findHostname(domain);
  if (!hostname) throw new Error("Domain belum terdaftar di Cloudflare Custom Hostnames.");
  return statusFor(await cfRequest<CloudflareHostname>(`/${encodeURIComponent(hostname.id)}`));
}

export async function registerCloudflareDomain(domain: string): Promise<DomainStatus> {
  const existing = await findHostname(domain);
  if (existing) return statusFor(await cfRequest<CloudflareHostname>(`/${encodeURIComponent(existing.id)}`));
  const created = await cfRequest<CloudflareHostname>("", {
    method: "POST",
    body: JSON.stringify({ hostname: domain, ssl: { method: "txt", type: "dv" } }),
  });
  return statusFor(created);
}

export async function removeCloudflareDomain(domain: string) {
  const hostname = await findHostname(domain);
  if (hostname) await cfRequest(`/${encodeURIComponent(hostname.id)}`, { method: "DELETE" });
}
