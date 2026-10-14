export const PAYMENT_PACKAGES = {
  client: {
    code: "CL",
    name: "Paket Client",
    description: "1 undangan digital premium",
    amount: 99000,
  },
  reseller: {
    code: "RS",
    name: "Paket Reseller",
    description: "Akses dashboard reseller selamanya, aktivasi undangan Rp20.000",
    amount: 149000,
  },
  "reseller-brand": {
    code: "RB",
    name: "Paket Mitra Brand",
    description: "Dashboard white label bulanan dengan sistem Mitra Brand",
    // Rp59.000/bulan. Alur aktivasi Mitra Brand tetap memakai sistem
    // sebelumnya dan tidak mengikuti biaya aktivasi Rp20.000 milik Reseller biasa.
    amount: 59000,
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
