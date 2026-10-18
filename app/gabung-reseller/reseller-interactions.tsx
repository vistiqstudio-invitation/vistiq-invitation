"use client";
import { useEffect, useState } from "react";
import CheckoutButton from "@/components/CheckoutButton";
import { RESELLER_JOIN_PRICE_LABEL, RESELLER_PROMO_ACTIVE } from "@/lib/resellerBilling";
import { secondsUntilNextWibMidnight } from "@/lib/resellerPromo";
import s from "./reseller-landing.module.css";
const rupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;
export function ResellerCalculator({ joinFee, activationFee }: {
    joinFee: number;
    activationFee: number;
}) {
    const [sellingPrice, setSellingPrice] = useState("99000");
    const [orders, setOrders] = useState(5);
    const price = Math.max(0, Math.min(10000000, Number(sellingPrice) || 0));
    const subtotal = (price - activationFee) * orders;
    return <div className={s.calculator}><span className={s.calculatorLabel}>SIMULASI PENJUALAN</span><label htmlFor="reseller-price">Contoh harga jual per undangan</label><div className={s.priceInput}><span>Rp</span><input id="reseller-price" type="number" min="0" max="10000000" step="1000" inputMode="numeric" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)}/></div><label htmlFor="reseller-orders">Jumlah undangan terjual <strong>{orders} undangan</strong></label><input id="reseller-orders" aria-valuetext={`${orders} undangan`} type="range" min="1" max="30" value={orders} onChange={e => setOrders(Number(e.target.value))}/><div className={s.rangeEnds}><span>1 undangan</span><span>30 undangan</span></div><dl className={s.calculation}><div><dt>Total penjualan</dt><dd>{rupiah(price * orders)}</dd></div><div><dt>Aktivasi {orders} undangan</dt><dd>− {rupiah(activationFee * orders)}</dd></div><div className={s.calculationTotal}><dt>Selisih setelah aktivasi</dt><dd>{rupiah(subtotal)}</dd></div><div><dt>Setelah biaya daftar sekali bayar</dt><dd>{rupiah(subtotal - joinFee)}</dd></div></dl><p>Belum dikurangi biaya iklan, operasional, pajak, dan biaya lain. Harga jual serta jumlah order di atas adalah contoh yang bisa kamu ubah.</p></div>;
}
export function ResellerCheckout({ production, amount }: {
    production: boolean;
    amount: number;
}) {
    return <div className={s.checkout} onClickCapture={event => {
            if ((event.target as HTMLElement).closest("button.priceButton")) {
                // Opening checkout is not a completed purchase. The existing payment
                // status page tracks Purchase only after server verification.
                window.fbq?.("track", "InitiateCheckout", { content_ids: ["reseller"], content_name: "Paket Reseller", content_type: "product", value: amount, currency: "IDR", num_items: 1 });
            }
        }}><CheckoutButton packageId="reseller" production={production} label={`Daftar Reseller — ${RESELLER_JOIN_PRICE_LABEL} →`} featured/></div>;
}

export function ResellerDailyTimer() {
    const [seconds, setSeconds] = useState<number | null>(null);
    useEffect(() => {
        const interval = window.setInterval(() => setSeconds(secondsUntilNextWibMidnight()), 1000);
        return () => window.clearInterval(interval);
    }, []);
    if (!RESELLER_PROMO_ACTIVE) return null;
    const values = seconds === null ? ["--", "--", "--"] : [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(value => String(value).padStart(2, "0"));
    return <div className={s.dailyTimer}>
        <strong>Promo Reseller</strong>
        <div className={s.timerDigits} aria-label="Waktu menuju reset timer harian">{values.map((value, index) => <span key={index}><b>{value}</b><small>{["Jam", "Menit", "Detik"][index]}</small></span>)}</div>
        <p>Reset 00.00 WIB</p>
    </div>;
}
