import type { SidebarItem } from "@/components/admin/DashboardSidebar";
import { IconDashboard, IconInvitation, IconUsers, IconWallet, IconPalette, IconGlobe, IconMusic } from "@/components/admin/icons";

// Reseller Brand keeps 100% of what they charge their own client and can
// never earn commission from Vistiq (only Vistiq's admin creates reseller
// accounts - there's no sub-reseller recruiting), so the "Komisi" nav item
// is meaningless noise for that tier and is left out entirely.
//
// The last nav item also has to point somewhere different per tier: a
// plain reseller SHOULD send prospects to Vistiq's own /demo (its "Order"
// button goes to Vistiq's WhatsApp, which is correct - that's how their
// commission gets credited). A Reseller Brand has their own branded
// landing page instead (/promo/<id> - hero, tagline, and catalog under
// their own name/logo), so the item becomes "Landing Page" and points
// there - showing both would just be two links to overlapping content.
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
