import { unstable_cache } from "next/cache";
import { ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Locale as AppLocale } from "@/lib/i18n/config";
import { toDbLocale } from "@/lib/i18n/db-locale";

export type ShopCategory = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  heroImage?: string | null;
  secondaryImage?: string | null;
};

export type ShopCategoryGroup = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  categories: ShopCategory[];
};

export type ShopData = {
  groups: ShopCategoryGroup[];
  quickCategories: ShopCategory[];
};

// Fallback images for categories without products
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "jewelry": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
  "leather-goods": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
  "bags": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
  "scarves": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=80",
};

const loadShopData = async (locale: AppLocale): Promise<ShopData> => {
  const dbLocale = toDbLocale(locale);

  const rawGroups = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { slug: "asc" },
    include: {
      translations: { where: { locale: dbLocale } },
      children: {
        orderBy: { slug: "asc" },
        include: {
          translations: { where: { locale: dbLocale } },
          products: {
            where: { status: ProductStatus.ACTIVE },
            take: 1,
            orderBy: { createdAt: "desc" },
            include: {
              media: {
                include: { asset: true },
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
      },
    },
  });

  const groups: ShopCategoryGroup[] = rawGroups
    .map((group) => {
      const groupTranslation = group.translations[0];
      const categories: ShopCategory[] = group.children.map((child) => {
        const childTranslation = child.translations[0];
        const product = child.products[0];
        const heroMedia =
          product?.media.find((media) => media.placement === "hero") ??
          product?.media[0];
        const secondaryMedia =
          product?.media.find((media) => media.id !== heroMedia?.id) ??
          product?.media[1];

        // Use fallback image if no product heroImage exists
        const fallbackImage = CATEGORY_FALLBACK_IMAGES[child.slug];
        const heroImageUrl = heroMedia?.asset?.url ?? fallbackImage ?? undefined;

        return {
          id: child.id,
          slug: child.slug,
          title: childTranslation?.title ?? child.slug,
          description: childTranslation?.description,
          heroImage: heroImageUrl,
          secondaryImage: secondaryMedia?.asset?.url ?? heroImageUrl ?? undefined,
        };
      });

      return {
        id: group.id,
        slug: group.slug,
        title: groupTranslation?.title ?? group.slug,
        description: groupTranslation?.description,
        categories,
      };
    })
    .filter((group) => group.categories.length > 0);

  const quickCategories = selectQuickCategories(groups);

  return { groups, quickCategories };
};

// Cache shop data for 1 hour - categories rarely change
const shopDataCached = unstable_cache(loadShopData, ["shop-data"], {
  revalidate: 3600,
  tags: ["categories", "products"],
});

export function getShopData(locale: AppLocale) {
  return shopDataCached(locale);
}

function selectQuickCategories(groups: ShopCategoryGroup[]): ShopCategory[] {
  const allCategories = groups.flatMap((group) => group.categories);
  if (allCategories.length === 0) {
    return [];
  }

  const preferredTokens = [
    ["women", "femme", "her"],
    ["men", "homme", "him"],
  ];

  const selected: ShopCategory[] = [];

  preferredTokens.forEach((tokenGroup) => {
    const match = allCategories.find((category) =>
      tokenGroup.some((token) =>
        category.slug.toLowerCase().includes(token),
      ),
    );
    if (match && !selected.some((item) => item.id === match.id)) {
      selected.push(match);
    }
  });

  for (const category of allCategories) {
    if (selected.length >= 4) break;
    if (!selected.some((item) => item.id === category.id)) {
      selected.push(category);
    }
  }

  return selected.slice(0, 4);
}
