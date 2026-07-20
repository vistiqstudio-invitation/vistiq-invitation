export const PAYMENT_PACKAGES = {
  client: {
    code: "CL",
    name: "Paket Client",
    description: "1 undangan digital premium",
    amount: 149000,
  },
  reseller: {
    code: "RS",
    name: "Paket Reseller",
    description: "Akses dashboard reseller selamanya",
    amount: 149000,
  },
  "reseller-brand": {
    code: "RB",
    name: "Paket Reseller Brand",
    description: "Dashboard reseller white label selamanya",
    // Launch promo: normal price is Rp299.000, discounted to Rp149.000 for
    // the first 10 buyers. Revert to 299000 once the promo ends.
    amount: 149000,
  },
} as const;

export type PaymentPackageId = keyof typeof PAYMENT_PACKAGES;

export function isPaymentPackage(value: unknown): value is PaymentPackageId {
  return typeof value === "string" && value in PAYMENT_PACKAGES;
}

export function packageFromOrderId(orderId: string) {
  const code = orderId.split("-")[1];
  return Object.entries(PAYMENT_PACKAGES).find(([, item]) => item.code === code) ?? null;
}
