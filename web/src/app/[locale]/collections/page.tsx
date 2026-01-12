import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getCollectionsOverview } from "@/lib/data/collections";
import { CollectionsHero } from "@/components/collections/collections-hero";
import { CollectionsFeatured } from "@/components/collections/collections-featured";
import { CollectionsJourney } from "@/components/collections/collections-journey";
import { CollectionsGrid } from "@/components/collections/collections-grid";

// Revalidate every hour (data is cached)
export const revalidate = 3600;

type LocaleParams = { locale: Locale } | Promise<{ locale: Locale }>;

export default async function CollectionsIndexPage({
  params,
}: {
  params: LocaleParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;
  const collections = await getCollectionsOverview(locale);

  if (collections.length === 0) {
    notFound();
  }

  const collectionsData = collections.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle ?? null,
    description: c.description ?? null,
    heroImage: c.heroImage ?? null,
    releaseDate: c.releaseDate ?? null,
    productCount: c.productCount,
    dropWindow: c.dropWindow ?? null,
  }));

  return (
    <main className="overflow-x-hidden">
      <CollectionsHero locale={locale} collectionCount={collections.length} />
      <CollectionsFeatured locale={locale} collections={collectionsData} />
      <CollectionsJourney locale={locale} collectionCount={collections.length} />
      <CollectionsGrid locale={locale} collections={collectionsData} />
    </main>
  );
}
