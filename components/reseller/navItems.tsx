import type { SidebarItem } from "@/components/admin/DashboardSidebar";
import { IconDashboard, IconInvitation, IconUsers, IconWallet, IconPalette } from "@/components/admin/icons";

// Reseller Brand keeps 100% of what they charge their own client and can
// never earn commission from Vistiq (only Vistiq's admin creates reseller
// accounts - there's no sub-reseller recruiting), so the "Komisi" nav item
// is meaningless noise for that tier and is left out entirely.
//
// "Demo Tema" also has to point somewhere different per tier: a plain
// reseller SHOULD send prospects to Vistiq's own /demo (its "Order" button
// goes to Vistiq's WhatsApp, which is correct - that's how their commission
// gets credited). A Reseller Brand prospect who orders needs to land on
// THEIR OWN storefront (/promo/<id>), or every lead they generate would be
// routed straight to Vistiq's WhatsApp instead of theirs.
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
    items.push({ key: "transactions", label: "Komisi", href: "/reseller/transactions", icon: <IconWallet /> });
  }

  const demoHref = pkg === "reseller_brand" && resellerId ? `/promo/${resellerId}` : "/demo";
  items.push({ key: "demo", label: "Demo Tema", href: demoHref, external: true, icon: <IconPalette /> });

  return items;
}
