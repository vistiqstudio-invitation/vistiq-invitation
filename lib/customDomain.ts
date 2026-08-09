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
