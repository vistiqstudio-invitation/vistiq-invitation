"use client";

import { useState } from "react";
import styles from "./ResellerActivity.module.css";

export type DashboardClient = { id: string; name: string; reseller_id: string | null };
export type DashboardReseller = { id: string; name: string; brand_name: string | null; package: string | null };
export type DashboardInvitation = { id: string; client_id: string | null };

type Props = {
  clients: DashboardClient[];
  resellers: DashboardReseller[];
  invitations: DashboardInvitation[];
  unavailable: boolean;
};

export default function ResellerActivity({ clients, resellers, invitations, unavailable }: Props) {
  const [sortBy, setSortBy] = useState<"clients" | "invitations">("clients");
  const invitationsByClient = new Map<string, number>();
  for (const { client_id } of invitations) {
    if (client_id) {
      invitationsByClient.set(client_id, (invitationsByClient.get(client_id) ?? 0) + 1);
    }
  }

  const clientsByReseller = new Map<string, DashboardClient[]>();
  for (const client of clients) {
    if (!client.reseller_id) continue;
    const group = clientsByReseller.get(client.reseller_id);
    if (group) group.push(client);
    else clientsByReseller.set(client.reseller_id, [client]);
  }

  const rows = resellers.map((reseller) => {
    const accounts = clientsByReseller.get(reseller.id) ?? [];
    return {
      ...reseller,
      accounts: accounts.sort((a, b) => a.name.localeCompare(b.name, "id")),
      clientCount: accounts.length,
      invitationCount: accounts.reduce((total, account) => total + (invitationsByClient.get(account.id) ?? 0), 0),
    };
  }).sort((a, b) => {
    const clientsDifference = b.clientCount - a.clientCount;
    const invitationsDifference = b.invitationCount - a.invitationCount;
    return (sortBy === "clients" ? clientsDifference || invitationsDifference : invitationsDifference || clientsDifference)
      || a.name.localeCompare(b.name, "id");
  });

  return (
    <section className={styles.panel} aria-labelledby="reseller-activity-heading">
      <div className={styles.header}>
        <h2 id="reseller-activity-heading">Daftar Reseller &amp; Klien</h2>
        {!unavailable && rows.length > 0 && (
          <label className={styles.sort}>
            Urutkan
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value === "invitations" ? "invitations" : "clients")}>
              <option value="clients">Klien terbanyak</option>
              <option value="invitations">Undangan terbanyak</option>
            </select>
          </label>
        )}
      </div>
      {unavailable ? <p role="status">Data reseller belum lengkap. Klik Refresh untuk memuat ulang.</p>
        : rows.length === 0 ? <p>Belum ada reseller.</p>
        : rows.map((row) => (
          <details className={styles.row} key={row.id}>
            <summary>
              <span className={styles.identity}>
                <strong>{row.name}</strong>
                <span>{row.package === "reseller_brand" ? "Mitra Brand" : "Reseller"}{row.brand_name ? ` · ${row.brand_name}` : ""}</span>
              </span>
              <span className={styles.count}>{row.clientCount} klien</span>
              <span className={styles.count}>{row.invitationCount} undangan</span>
            </summary>
            {row.accounts.length === 0 ? <p className={styles.empty}>Belum ada akun klien.</p> : (
              <ul className={styles.clients} aria-label={`Akun klien ${row.name}`}>
                {row.accounts.map((account) => (
                  <li key={account.id}>
                    <span>{account.name}</span>
                    <span className={styles.count}>{invitationsByClient.get(account.id) ?? 0} undangan</span>
                  </li>
                ))}
              </ul>
            )}
          </details>
        ))}
    </section>
  );
}
