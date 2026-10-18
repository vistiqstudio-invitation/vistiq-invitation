import { RESELLER_JOIN_PRICE_LABEL, RESELLER_PROMO_ACTIVE, RESELLER_REGULAR_JOIN_FEE } from "@/lib/resellerBilling";
import styles from "./ResellerPrice.module.css";

export default function ResellerPrice() {
  return <span className={styles.price}>
    {RESELLER_PROMO_ACTIVE && <del className={styles.regular} aria-label="Harga normal">Rp{RESELLER_REGULAR_JOIN_FEE.toLocaleString("id-ID")}</del>}
    <b className={styles.current}>{RESELLER_JOIN_PRICE_LABEL}</b>
  </span>;
}
