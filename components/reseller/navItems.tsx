import type { SidebarItem } from "@/components/admin/DashboardSidebar";
import { IconDashboard, IconInvitation, IconUsers, IconWallet, IconPalette, IconGlobe, IconMusic } from "@/components/admin/icons";

export function getResellerNavItems(
  pkg?: "reseller" | "reseller_brand" | null,
  resellerId?: string | null
): SidebarItem[] {
  const items: SidebarItem[] = [
    { key: "dashboard", label: "Dashboard", href: "/reseller", icon: <IconDashboard /> },
    { key: "invitations", label: "Buat Undangan", href: "/reseller/invitations", icon: <IconInvitation /> },
    { key: "clients", label: "Daftar Client", href: "/reseller/clients", icon: <IconUsers /> },
  ];

  if (pkg !== "reseller_brand") {
    items.push({ key: "transactions", label: "Transaksi", href: "/reseller/transactions", icon: <IconWallet /> });
    items.push({ key: "saldo", label: "Saldo & Penarikan", href: "/reseller/saldo", icon: <IconWallet /> });
  }

  if (pkg === "reseller_brand") {
    items.push({ key: "musik", label: "Musik", href: "/reseller/musik", icon: <IconMusic /> });
  }

  if (pkg === "reseller_brand" && resellerId) {
    items.push({ key: "landing", label: "Landing Page", href: `/promo/${resellerId}`, external: true, icon: <IconGlobe /> });
  } else {
    items.push({ key: "demo", label: "Demo Tema", href: "/demo", external: true, icon: <IconPalette /> });
  }

  return items;
}
