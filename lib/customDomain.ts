export function normalizeCustomDomain(value: string) {
  let domain = value.trim().toLowerCase();

  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.split("/")[0].replace(/\.$/, "");
  if (domain.startsWith("www.")) domain = domain.slice(4);

  return domain;
}

export function isValidCustomDomain(domain: string) {
  if (!domain || domain.length > 253 || domain.includes("..")) return false;
  if (domain === "vistiqinvitation.com" || domain.endsWith(".vistiqinvitation.com")) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;

  return labels.every(
    (label) =>
      label.length > 0 &&
      label.length <= 63 &&
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
  );
}

export function getHostname(value: string | null) {
  return normalizeCustomDomain((value || "").split(":")[0]);
}

export const FREE_SUBDOMAIN_ROOT = "vistiqinvitation.com";

const RESERVED_SUBDOMAINS = new Set([
  "www", "admin", "api", "app", "dashboard", "login", "client", "reseller",
  "affiliate", "owner", "mail", "email", "smtp", "ftp", "support", "help",
  "status", "billing", "checkout", "payment", "payments", "static", "assets",
]);

export function normalizeSubdomain(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/^-+|-+$/g, "");
}

export function validateSubdomain(value: string) {
  const subdomain = normalizeSubdomain(value);
  if (subdomain.length < 3) return "Nama subdomain minimal 3 karakter.";
  if (subdomain.length > 40) return "Nama subdomain maksimal 40 karakter.";
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(subdomain)) {
    return "Gunakan huruf kecil, angka, atau tanda hubung tanpa spasi.";
  }
  if (RESERVED_SUBDOMAINS.has(subdomain)) return "Nama subdomain ini tidak dapat digunakan.";
  return null;
}

export function freeSubdomainHostname(value: string) {
  return `${normalizeSubdomain(value)}.${FREE_SUBDOMAIN_ROOT}`;
}
