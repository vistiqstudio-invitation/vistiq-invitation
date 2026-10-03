const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
let checks = 0;

function expect(file, pattern, message) {
  checks += 1;
  if (!pattern.test(read(file))) throw new Error(`${message} (${file})`);
}

function reject(file, pattern, message) {
  checks += 1;
  if (pattern.test(read(file))) throw new Error(`${message} (${file})`);
}

expect("lib/provisionPaidOrder.ts", /billing_model:\s*"per_invitation"/, "New Midtrans accounts must use the new billing model");
expect("app/api/admin/create-reseller/route.ts", /billing_model:\s*"per_invitation"/, "Admin-created accounts must use the new billing model");
expect("app/api/create-client/route.ts", /resellerBillingModel === "legacy_commission"/, "Legacy client sales must stay grandfathered");
expect("app/api/reseller/invitation-activation/route.ts", /INVITATION_ACTIVATION_FEE/, "Activation endpoint must use the shared fixed fee");
expect("app/api/reseller/invitation-activation/route.ts", /VSTQ-IA-/, "Activation orders need their own Midtrans prefix");
expect("app/api/payments/notification/route.ts", /startsWith\("VSTQ-IA-"\)/, "Webhook must recognize activation payments");
expect("app/api/payments/status/route.ts", /VSTQ-\(RC\|IA\)/, "Status sync must recognize activation payments");
expect("app/api/reseller/activate/route.ts", /billing_model === "legacy_commission"/, "Manual self-activation must be legacy-only");
expect("components/reseller/navItems.tsx", /billingModel !== "per_invitation"/, "New accounts must not see commission and withdrawal navigation");
expect("supabase/migrations/20261003023000_new_partner_per_invitation_billing.sql", /set billing_model = 'legacy_commission'/, "Existing accounts must be grandfathered");
expect("supabase/migrations/20261003023000_new_partner_per_invitation_billing.sql", /default 'per_invitation'/, "Future accounts must default to the new model");
expect("supabase/migrations/20261003023000_new_partner_per_invitation_billing.sql", /new\.amount <> 20000/, "Database activation must enforce Rp20.000");
expect("supabase/migrations/20261003023000_new_partner_per_invitation_billing.sql", /set is_active = true/, "Paid activation must publish the invitation");
reject("app/gabung-reseller/page.tsx", /80%|fee platform 20%/i, "Public Reseller copy must not advertise percentages");
reject("app/gabung-resellerbrand/page.tsx", /80%|fee platform 20%|100% harga jual/i, "Public Mitra copy must not advertise the old model");
reject("app/pilih-paket/page.tsx", /80% bagian|fee platform 20%/i, "Package selector must use the new model");

console.log(`${checks} new partner billing checks passed.`);
