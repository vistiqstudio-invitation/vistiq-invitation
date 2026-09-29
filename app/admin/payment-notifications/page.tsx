import Link from "next/link";
import { requireRole } from "@/lib/supabase/dal";
import PaymentNotificationSettings from "./PaymentNotificationSettings";
import styles from "./paymentNotifications.module.css";

export default async function PaymentNotificationsPage() {
  await requireRole(["owner"]);
  return <main className={styles.page}>
    <Link href="/admin/transactions">← Kembali ke transaksi</Link>
    <header><p className={styles.eyebrow}>VISTIQ INVITATION</p><h1>Notifikasi Pembayaran</h1><p>Pemberitahuan WhatsApp untuk pembayaran Midtrans yang berhasil.</p></header>
    <PaymentNotificationSettings />
  </main>;
}
