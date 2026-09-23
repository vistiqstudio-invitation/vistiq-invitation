import { requireRole } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import {
  themeList, khitanThemeList, aqiqahThemeList, birthdayThemeList,
} from "@/lib/theme";
import {
  getThemeCardPreviewImage, getThemeCoverImage,
} from "@/lib/themeCoverImages";
import MarketingKit from "./MarketingKit";

export const dynamic = "force-dynamic";

export default async function ResellerMarketingKitPage() {
  const profile = await requireRole(["reseller"]);
  const supabase = await createClient();
  const { data: reseller } = await supabase
    .from("resellers")
    .select("id, name, package, brand_name, brand_color, logo_url, landing_whatsapp, brand_active, brand_expires_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  const catalogs = [
    { category: "wedding", title: "Wedding", path: "/demo", themes: themeList },
    { category: "khitan", title: "Khitan", path: "/demo-khitan", themes: khitanThemeList },
    { category: "aqiqah", title: "Akikah", path: "/demo-akikah", themes: aqiqahThemeList },
    { category: "birthday", title: "Ulang Tahun", path: "/demo-ulang-tahun", themes: birthdayThemeList },
  ].map(group => ({
    category: group.category,
    title: group.title,
    path: group.path,
    themes: group.themes.map(theme => ({
      key: theme.key,
      label: theme.label,
      image: getThemeCardPreviewImage(theme.key, group.path)
        || getThemeCoverImage(theme.key, group.path),
    })),
  }));

  return (
    <MarketingKit
      reseller={reseller}
      profileWhatsapp={profile.whatsapp}
      catalogs={catalogs}
    />
  );
}
