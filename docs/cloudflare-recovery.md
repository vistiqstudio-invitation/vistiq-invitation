# Cloudflare recovery operations

The application is deployed as `vistiq-recovery-preview`. Production custom domains are `vistiqinvitation.com` and `www.vistiqinvitation.com`. Media stays on the R2 custom domain `media.vistiqinvitation.com`.

## Credentials after moving hosting

Configure the following in **Workers & Pages → vistiq-recovery-preview → Settings → Runtime variables and secrets → Production**. Build variables do not replace runtime secrets.

| Name | Type | Source |
| --- | --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Supabase project API keys; server key with service-role privileges |
| `MIDTRANS_SERVER_KEY` | Secret | Midtrans dashboard, matching the intended environment |
| `MIDTRANS_IS_PRODUCTION` | Variable | Exactly `true` for Production or `false` for Sandbox |
| `R2_ACCESS_KEY_ID` | Secret | Existing R2 object credentials |
| `R2_SECRET_ACCESS_KEY` | Secret | Existing R2 object credentials |

R2 account ID, bucket name and public URL are in `wrangler.jsonc`. Keep the existing R2 secrets when redeploying. Supabase URL and public anon key must remain configured in the Cloudflare build environment. Do not put service-role or Midtrans server keys in `NEXT_PUBLIC_*`, git, chat, logs or screenshots.

The owner dashboard's **Status Konfigurasi Sistem** card reports configuration presence only. A configured key has not necessarily been validated with its provider. Checkout, activation, account provisioning, notification callback and the real editor upload still need authenticated acceptance testing. Never create a real paid test transaction without explicit authorization.

Payment notification URL: `https://vistiqinvitation.com/api/payments/notification`. Restore the original matching Midtrans environment before accepting live payments. Existing orders must keep their original immutable amounts. Do not alter historical prices or statuses during recovery.

## Media and cleanup

New client/reseller media uses `uploadMediaToR2`. Direct browser uploads fall back to the authenticated same-origin endpoint when bucket CORS is unavailable. Both upload handlers verify the account and Origin. Cleanup only covers the fixed verified allowlist, requires owner access and explicit confirmation, rechecks database references and byte counts, and removes files through the Supabase Storage API. Missing originals are reported as already cleaned using trusted database metadata, not ambiguous public HEAD errors.

The two historical tables `invitation_media_r2_backup_20261016` and `theme_asset_chunks` are protected from direct anon/authenticated table access. The existing public theme asset RPC remains available.

## Domains

The 14 existing platform subdomains have individual Worker routes. Do not replace these with a wildcard route that intercepts the R2 media hostname. `media`, `cdn`, and other infrastructure names are reserved.

External reseller domains and automatic new-domain provisioning remain separate work. Existing provisioning endpoints still target Vercel, so do not label a newly created domain active on Cloudflare without verifying its Worker mapping, TLS and tenant lookup. A CNAME alone does not provision a Cloudflare Worker custom hostname or certificate. Domain-provider access and a supported Cloudflare custom-hostname strategy are required before changing those records.

## Verification

Run `npm run test:recovery`, `npx tsc --noEmit`, targeted ESLint, `npm run build:cloudflare`, and `npx wrangler deploy --dry-run`. Do not deploy missing build environment variables.

Worker logs sample 10% of invocations and tracing is disabled. Logs must be inspected in the Cloudflare account to explain the historical error rate; successful HTTP spot checks do not prove all requests succeed. Do not enable a paid plan as a recovery workaround.
