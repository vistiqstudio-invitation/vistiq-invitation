import { RESELLER_JOIN_FEE } from "./resellerBilling";

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
    amount: RESELLER_JOIN_FEE,
  },
} as const;

export type PaymentPackageId = keyof typeof PAYMENT_PACKAGES;

export function isPaymentPackage(value: unknown): value is PaymentPackageId {
  return typeof value === "string" && value in PAYMENT_PACKAGES;
}

export function packageFromOrderId(orderId: string) {
  const code = orderId.split("-")[1];
  // Keep recognizing old paid RB orders using their immutable database quote.
  if (code === "RB") return ["reseller-brand", { code: "RB", name: "Mitra Brand (akun lama)" }] as const;
  return Object.entries(PAYMENT_PACKAGES).find(([, item]) => item.code === code) ?? null;
}
