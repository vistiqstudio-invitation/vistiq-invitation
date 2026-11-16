"use client";

import Link from "next/link";
import { invitationDisplayName } from "@/lib/invitationCopy";
import { useState } from "react";
import styles from "./ResellerActivity.module.css";

export type DashboardClient = {
  id: string;
  name: string;
  email: string | null;
  status: string | null;
  reseller_id: string | null;
};
export type DashboardReseller = { id: string; name: string; brand_name: string | null; package: string | null };
export type DashboardInvitation = Parameters<typeof invitationDisplayName>[0] & {
  id: string;
  client_id: string | null;
  slug: string | null;
  is_active: boolean | null;
};

type View = "clients" | "invitations";

type Props = {
  clients: DashboardClient[];
  resellers: DashboardReseller[];
  invitations: DashboardInvitation[];
  unavailable: boolean;
};

export default function ResellerActivity({ clients, resellers, invitations, unavailable }: Props) {
  const [sortBy, setSortBy] = useState<View>("clients");
  const [selection, setSelection] = useState<{ resellerId: string; view: View } | null>(null);
  const invitationsByClient = new Map<string, DashboardInvitation[]>();
  for (const invitation of invitations) {
    if (!invitation.client_id) continue;
    const group = invitationsByClient.get(invitation.client_id);
    if (group) group.push(invitation);
    else invitationsByClient.set(invitation.client_id, [invitation]);
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
      invitationCount: accounts.reduce((total, account) => total + (invitationsByClient.get(account.id)?.length ?? 0), 0),
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
        : rows.map((row) => {
          const view = selection?.resellerId === row.id ? selection.view : null;
          const panelId = `reseller-activity-${row.id}`;

          return (
            <article className={styles.row} key={row.id}>
              <div className={styles.summary}>
                <div className={styles.identity}>
                  <strong>{row.name}</strong>
                  <span>{row.package === "reseller_brand" ? "Mitra Brand" : "Reseller"}{row.brand_name ? ` · ${row.brand_name}` : ""}</span>
                </div>
                <div className={styles.actions} role="group" aria-label={`Data ${row.name}`}>
                  {([
                    { value: "clients", label: `Klien (${row.clientCount})` },
                    { value: "invitations", label: `Undangan (${row.invitationCount})` },
                  ] as const).map((option) => (
                    <button
                      className={styles.menuButton}
                      key={option.value}
                      type="button"
                      aria-expanded={view === option.value}
                      aria-controls={panelId}
                      onClick={() => setSelection(view === option.value ? null : { resellerId: row.id, view: option.value })}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div id={panelId} hidden={!view}>
                {view === "clients" && (row.clientCount === 0
                  ? <p className={styles.empty}>Belum ada akun klien.</p>
                  : <ul className={styles.entries} aria-label={`Akun klien ${row.name}`}>
                      {row.accounts.map((account) => (
                        <li key={account.id}>
                          <span className={styles.identity}>
                            <strong>{account.name}</strong>
                            <span>{[account.email, account.status === "active" ? "Aktif" : account.status === "pending" ? "Menunggu Aktivasi" : account.status].filter(Boolean).join(" · ")}</span>
                          </span>
                          <span className={styles.count}>{invitationsByClient.get(account.id)?.length ?? 0} undangan</span>
                        </li>
                      ))}
                    </ul>)}
                {view === "invitations" && (row.invitationCount === 0
                  ? <p className={styles.empty}>Belum ada undangan.</p>
                  : <ul className={styles.entries} aria-label={`Undangan ${row.name}`}>
                      {row.accounts.flatMap((account) => (invitationsByClient.get(account.id) ?? []).map((invitation) => (
                        <li key={invitation.id}>
                          <span className={styles.identity}>
                            <Link href={`/admin/invitations/${encodeURIComponent(invitation.id)}`}>{invitationDisplayName(invitation)}</Link>
                            <span>{account.name}{invitation.slug ? ` · /${invitation.slug}` : ""}</span>
                          </span>
                          <span className={styles.count}>{invitation.is_active === false ? "Draft" : "Aktif"}</span>
                        </li>
                      )))}
                    </ul>)}
              </div>
            </article>
          );
        })}
    </section>
  );
}
