import { ProductStatus } from "@prisma/client";
import type { Locale as AppLocale } from "@/lib/i18n/config";
import { toDbLocale } from "@/lib/i18n/db-locale";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { CACHE_DURATIONS, CACHE_TAGS } from "@/lib/cache";

export type SearchResult = {
  id: string;
  slug: string;
  name: string;
  heroImage?: string | null;
  priceCents?: number | null;
  category?: string | null;
};

async function searchProductsUncached(
  query: string,
  locale: AppLocale,
  limit = 8,
): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const dbLocale = toDbLocale(locale);

  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      OR: [
        {
          translations: {
            some: {
              locale: dbLocale,
              name: { contains: trimmed, mode: "insensitive" },
            },
          },
        },
        {
          translations: {
            some: {
              locale: dbLocale,
              description: { contains: trimmed, mode: "insensitive" },
            },
          },
        },
        {
          category: {
            translations: {
              some: {
                locale: dbLocale,
                title: { contains: trimmed, mode: "insensitive" },
              },
            },
          },
        },
      ],
    },
    take: limit,
    include: {
      translations: { where: { locale: dbLocale } },
      media: {
        include: { asset: true },
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        orderBy: { priceCents: "asc" },
        take: 1,
      },
      category: {
        include: {
          translations: { where: { locale: dbLocale } },
        },
      },
    },
  });

  return products.map((product) => {
    const translation = product.translations[0];
    const hero =
      product.media.find((media) => media.placement === "hero") ??
      product.media[0];
    const variant = product.variants[0];
    const categoryTranslation = product.category?.translations[0];

    return {
      id: product.id,
      slug: product.slug,
      name: translation?.name ?? product.slug,
      heroImage: hero?.asset?.url ?? null,
      priceCents: variant?.priceCents ?? null,
      category: categoryTranslation?.title ?? product.category?.slug ?? null,
    };
  });
}

// Cache search results for 5 minutes (searches are repeated often)
const searchProductsCached = unstable_cache(
  searchProductsUncached,
  ["search", "products"],
  { revalidate: CACHE_DURATIONS.short, tags: [CACHE_TAGS.search, CACHE_TAGS.products] }
);

export function searchProducts(
  query: string,
  locale: AppLocale,
  limit = 8
): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return Promise.resolve([]);
  return searchProductsCached(trimmed, locale, limit);
}
