import "server-only";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const orderId = new URL(request.url).searchParams.get("order_id") ?? "";

  if (!/^VSTQ-(CL|RS|RB)-[A-Za-z0-9-]{8,45}$/.test(orderId)) {
    return NextResponse.json({ error: "Nomor pesanan tidak valid." }, { status: 400 });
  }
  if (!serverKey) {
    return NextResponse.json({ error: "Konfigurasi pembayaran belum tersedia." }, { status: 503 });
  }

  const base = production ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";
  const response = await fetch(`${base}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    },
    cache: "no-store",
  });
  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: response.status === 404 ? "Pembayaran belum dipilih atau belum tercatat." : "Status belum dapat diperiksa." },
      { status: response.status === 404 ? 404 : 502 },
    );
  }

  return NextResponse.json({
    orderId: data.order_id,
    status: data.transaction_status,
    paymentType: data.payment_type ?? null,
    grossAmount: data.gross_amount,
    transactionTime: data.transaction_time ?? null,
    settlementTime: data.settlement_time ?? null,
  });
}
