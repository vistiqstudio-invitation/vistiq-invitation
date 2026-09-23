import { requireRole } from "@/lib/supabase/dal";
import {
  themeList, khitanThemeList, aqiqahThemeList, birthdayThemeList,
} from "@/lib/theme";
import {
  getThemeCardPreviewImage, getThemeCoverImage,
} from "@/lib/themeCoverImages";
import MarketingKit from "@/app/reseller/marketing-kit/MarketingKit";

export const dynamic = "force-dynamic";

export default async function AdminMarketingKitPage() {
  const profile = await requireRole(["owner"]);
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
      reseller={null}
      isOwner
      profileWhatsapp={profile.whatsapp}
      catalogs={catalogs}
    />
  );
}
