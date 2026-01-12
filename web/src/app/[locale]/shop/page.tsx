import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getProductsOverview } from "@/lib/data/products";
import { getShopData } from "@/lib/data/shop";
import { ShopExperience } from "@/components/shop/shop-experience";
import { getCurrentUser } from "@/lib/auth/session";

type LocaleParams = { locale: Locale } | Promise<{ locale: Locale }>;

// Revalidate every 30 minutes (products may update more often)
export const revalidate = 1800;

export default async function ShopPage({
  params,
}: {
  params: LocaleParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;
  const [products, shopData, currentUser] = await Promise.all([
    getProductsOverview(locale),
    getShopData(locale),
    getCurrentUser(),
  ]);

  if (products.length === 0) {
    notFound();
  }

  return (
    <ShopExperience
      locale={locale}
      products={products}
      groups={shopData.groups}
      quickCategories={shopData.quickCategories}
      isAuthenticated={Boolean(currentUser)}
    />
  );
}
