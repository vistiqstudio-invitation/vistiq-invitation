import "server-only";

// Require an explicit mode: an omitted production flag must never silently
// send real customers to the sandbox after a hosting migration.
export function hasPaymentMode() {
  return process.env.MIDTRANS_IS_PRODUCTION === "true" || process.env.MIDTRANS_IS_PRODUCTION === "false";
}

export function paymentConfigurationStatus() {
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "MIDTRANS_SERVER_KEY", "MIDTRANS_SIGNATURE_SECRET_KEY"];
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (!hasPaymentMode()) missing.push("MIDTRANS_IS_PRODUCTION");
  return {
    ready: missing.length === 0,
    missing,
    mode: hasPaymentMode() ? (process.env.MIDTRANS_IS_PRODUCTION === "true" ? "production" : "sandbox") : "unconfigured",
  };
}
