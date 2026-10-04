import "server-only";

import { createHash, createHmac } from "node:crypto";

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing R2 configuration: ${name}`);
  return value;
}

function hmac(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function listPage(continuationToken?: string) {
  const accountId = env("R2_ACCOUNT_ID");
  const accessKeyId = env("R2_ACCESS_KEY_ID");
  const secretAccessKey = env("R2_SECRET_ACCESS_KEY");
  const bucket = env("R2_BUCKET_NAME");
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${encodeURIComponent(bucket)}`;
  const params = new URLSearchParams({ "list-type": "2", "max-keys": "1000" });
  if (continuationToken) params.set("continuation-token", continuationToken);
  params.sort();

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const date = amzDate.slice(0, 8);
  const scope = `${date}/auto/s3/aws4_request`;
  const payloadHash = sha256("");
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = ["GET", canonicalUri, params.toString(), canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");
  const kDate = hmac(`AWS4${secretAccessKey}`, date);
  const kRegion = hmac(kDate, "auto");
  const kService = hmac(kRegion, "s3");
  const kSigning = hmac(kService, "aws4_request");
  const signature = createHmac("sha256", kSigning).update(stringToSign).digest("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(`https://${host}${canonicalUri}?${params.toString()}`, {
    headers: {
      Authorization: authorization,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`R2 LIST failed: ${response.status} ${await response.text()}`);
  return response.text();
}

export async function getR2StorageUsage() {
  let token: string | undefined;
  let objects = 0;
  let bytes = 0;
  let pages = 0;

  do {
    const xml = await listPage(token);
    pages += 1;
    const sizes = [...xml.matchAll(/<Size>(\d+)<\/Size>/g)];
    objects += sizes.length;
    for (const match of sizes) bytes += Number(match[1] || 0);

    const truncated = /<IsTruncated>true<\/IsTruncated>/.test(xml);
    const next = xml.match(/<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/)?.[1];
    token = truncated && next ? decodeXml(next) : undefined;
    if (pages >= 100) throw new Error("R2 object listing exceeded 100 pages.");
  } while (token);

  return { objects, bytes, checkedAt: new Date().toISOString() };
}
