"use client";
import { useState } from "react";
import CheckoutButton from "@/components/CheckoutButton";
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
        }}><CheckoutButton packageId="reseller" production={production} label="Daftar Reseller — Rp149.000 →" featured/></div>;
}
