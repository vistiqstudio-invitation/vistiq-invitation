import "server-only";

import { createHmac, createHash } from "node:crypto";

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

function encodePath(value: string) {
  return value.split("/").map(encodeURIComponent).join("/");
}

export function r2PublicUrl(key: string) {
  return `${env("R2_PUBLIC_URL").replace(/\/$/, "")}/${encodePath(key)}`;
}

export function createR2PresignedPutUrl(key: string, contentType: string, expiresSeconds = 900) {
  const accountId = env("R2_ACCOUNT_ID");
  const accessKeyId = env("R2_ACCESS_KEY_ID");
  const secretAccessKey = env("R2_SECRET_ACCESS_KEY");
  const bucket = env("R2_BUCKET_NAME");

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const date = amzDate.slice(0, 8);
  const region = "auto";
  const service = "s3";
  const credentialScope = `${date}/${region}/${service}/aws4_request`;
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${encodeURIComponent(bucket)}/${encodePath(key)}`;

  const params = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresSeconds),
    "X-Amz-SignedHeaders": "host",
  });
  params.sort();

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    params.toString(),
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${secretAccessKey}`, date);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  params.set("X-Amz-Signature", signature);
  return {
    uploadUrl: `https://${host}${canonicalUri}?${params.toString()}`,
    publicUrl: r2PublicUrl(key),
    contentType,
  };
}
