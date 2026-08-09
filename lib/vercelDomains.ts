import "server-only";

const API = "https://api.vercel.com";

type VercelVerification = {
  type?: string;
  domain?: string;
  value?: string;
  reason?: string;
};

export type DomainStatus = {
  domain: string;
  verified: boolean;
  configured: boolean;
  verification: VercelVerification[];
  dns: {
    type: "A" | "CNAME";
    name: string;
    value: string;
  };
};

function config() {
  const token = process.env.VERCEL_API_TOKEN;
  const project = process.env.VERCEL_PROJECT_ID || process.env.VERCEL_PROJECT_NAME;
  const team = process.env.VERCEL_TEAM_ID;

  if (!token || !project) {
    throw new Error("VERCEL_API_TOKEN dan VERCEL_PROJECT_ID belum dikonfigurasi.");
  }

  return { token, project, team };
}

async function vercelFetch(path: string, init?: RequestInit) {
  const { token, team } = config();
  const separator = path.includes("?") ? "&" : "?";
  const url = `${API}${path}${team ? `${separator}teamId=${encodeURIComponent(team)}` : ""}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.error?.message || data?.message || "Permintaan ke Vercel gagal.");
    (error as Error & { code?: string }).code = data?.error?.code;
    throw error;
  }

  return data;
}

export async function addDomainToVercel(domain: string) {
  const { project } = config();
  await vercelFetch(`/v10/projects/${encodeURIComponent(project)}/domains`, {
    method: "POST",
    body: JSON.stringify({ name: domain }),
  });
  return getDomainStatus(domain);
}

export async function getDomainStatus(domain: string): Promise<DomainStatus> {
  const { project } = config();
  const [projectDomain, domainConfig] = await Promise.all([
    vercelFetch(`/v9/projects/${encodeURIComponent(project)}/domains/${encodeURIComponent(domain)}`),
    vercelFetch(`/v6/domains/${encodeURIComponent(domain)}/config?projectId=${encodeURIComponent(project)}`),
  ]);

  const isSubdomain = domain.split(".").length > 2;
  return {
    domain,
    verified: Boolean(projectDomain.verified),
    configured: Boolean(domainConfig.configuredBy) || Boolean(domainConfig.misconfigured === false),
    verification: Array.isArray(projectDomain.verification) ? projectDomain.verification : [],
    dns: isSubdomain
      ? { type: "CNAME", name: domain.split(".")[0], value: "cname.vercel-dns.com" }
      : { type: "A", name: "@", value: "76.76.21.21" },
  };
}

export async function verifyDomainOnVercel(domain: string) {
  const { project } = config();
  await vercelFetch(
    `/v9/projects/${encodeURIComponent(project)}/domains/${encodeURIComponent(domain)}/verify`,
    { method: "POST" }
  );
  return getDomainStatus(domain);
}

export async function removeDomainFromVercel(domain: string) {
  const { project } = config();
  await vercelFetch(`/v9/projects/${encodeURIComponent(project)}/domains/${encodeURIComponent(domain)}`, {
    method: "DELETE",
  });
}
