import type { Locale as AppLocale } from "@/lib/i18n/config";
import { toDbLocale } from "@/lib/i18n/db-locale";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { ProductStatus } from "@prisma/client";

export type ProductListCard = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  heroImage?: string | null;
  images: string[];
  priceCents?: number | null;
  defaultVariantId?: string | null;
  limitedEdition: boolean;
  heritageTag?: string | null;
  colors: string[];
  sizes: string[];
  materials: string[];
  collections: Array<{
    slug: string;
    title: string;
  }>;
  category?: {
    slug: string;
    title: string;
  } | null;
  categoryGroup?: {
    slug: string;
    title: string;
  } | null;
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  craftStory?: string | null;
  materialsText?: string | null;
  careInstructions?: unknown;
  heroImage?: string | null;
  gallery: string[];
  limitedEdition: boolean;
  heritageTag?: string | null;
  originCountry?: string | null;
  atelierNotes?: string | null;
  variants: Array<{
    id: string;
    sku: string;
    size?: string | null;
    color?: string | null;
    priceCents: number;
    personalizationAllowed: boolean;
    availability: number | null;
  }>;
  collection?: {
    slug: string;
    title: string;
    heroImage?: string | null;
    products: Array<{
      id: string;
      slug: string;
      name: string;
      heroImage?: string | null;
      images: string[];
      priceCents?: number | null;
    }>;
  } | null;
};

const loadProductsOverview = async (
  locale: AppLocale,
): Promise<ProductListCard[]> => {
  // Log when actually hitting database
  console.log(`[CACHE MISS] Products overview for ${locale} - fetching from DB`);
  
  const dbLocale = toDbLocale(locale);

  const products = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE },
    orderBy: { createdAt: "desc" },
    include: {
      translations: { where: { locale: dbLocale } },
      media: {
        include: { asset: true },
        orderBy: { sortOrder: "asc" },
      },
      materials: {
        include: { material: true },
      },
      collections: {
        include: {
          collection: {
            include: {
              translations: { where: { locale: dbLocale } },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
      category: {
        include: {
          translations: { where: { locale: dbLocale } },
          parent: {
            include: {
              translations: { where: { locale: dbLocale } },
            },
          },
        },
      },
      variants: {
        orderBy: { priceCents: "asc" },
      },
    },
  });

  return products.map((product) => {
    const translation = product.translations[0];
    const heroMedia =
      product.media.find((media) => media.placement === "hero") ??
      product.media[0];
    const variant = product.variants[0];
    const imageSet = product.media
      .map((media) => media.asset?.url)
      .filter((url): url is string => Boolean(url));
    const colors = Array.from(
      new Set(
        product.variants
          .map((variant) => variant.color)
          .filter((color): color is string => Boolean(color)),
      ),
    );
    const sizes = Array.from(
      new Set(
        product.variants
          .map((variant) => variant.size)
          .filter((size): size is string => Boolean(size)),
      ),
    );
    const materialsList = product.materials.map(
      (item) => item.material.name,
    );
    const collections = product.collections.map((entry) => {
      const translation = entry.collection.translations[0];
      return {
        slug: entry.collection.slug,
        title: translation?.title ?? entry.collection.slug,
      };
    });
    const categoryTranslation = product.category?.translations[0];
    const categoryData = product.category
      ? {
          slug: product.category.slug,
          title: categoryTranslation?.title ?? product.category.slug,
        }
      : null;
    const parentTranslation = product.category?.parent?.translations?.[0];
    const categoryGroup = product.category?.parent
      ? {
          slug: product.category.parent.slug,
          title: parentTranslation?.title ?? product.category.parent.slug,
        }
      : null;

    return {
      id: product.id,
      slug: product.slug,
      name: translation?.name ?? product.slug,
      description: translation?.description,
      heroImage: heroMedia?.asset?.url,
      images: imageSet,
      priceCents: variant?.priceCents ?? null,
      defaultVariantId: variant?.id ?? null,
      limitedEdition: product.limitedEdition,
      heritageTag: product.heritageTag,
      colors,
      sizes,
      materials: materialsList,
      collections,
      category: categoryData,
      categoryGroup,
    };
  });
};

const loadProductDetail = async (
  locale: AppLocale,
  slug: string,
): Promise<ProductDetail | null> => {
  const dbLocale = toDbLocale(locale);

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale: dbLocale } },
      media: {
        include: { asset: true },
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        include: {
          inventory: true,
        },
        orderBy: { priceCents: "asc" },
      },
      collections: {
        include: {
          collection: {
            include: {
              translations: { where: { locale: dbLocale } },
              heroAsset: true,
              items: {
                include: {
                  product: {
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
                    },
                  },
                },
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!product) return null;

  const translation = product.translations[0];
  const heroMedia =
    product.media.find((media) => media.placement === "hero") ??
    product.media[0];
  const gallery = product.media.map((media) => media.asset?.url).filter(Boolean) as string[];
  const primaryCollection = product.collections[0]?.collection;
  const collectionData = primaryCollection
    ? {
        slug: primaryCollection.slug,
        title:
          primaryCollection.translations[0]?.title ??
          primaryCollection.slug,
        heroImage: primaryCollection.heroAsset?.url ?? heroMedia?.asset?.url ?? null,
        products: primaryCollection.items
          .map((item) => item.product)
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
          .map((p) => {
            const pTranslation = p.translations[0];
            const pHero =
              p.media.find((media) => media.placement === "hero") ??
              p.media[0];
            const pImages = p.media
              .map((media) => media.asset?.url)
              .filter((url): url is string => Boolean(url));
            const variant = p.variants[0];
            return {
              id: p.id,
              slug: p.slug,
              name: pTranslation?.name ?? p.slug,
              heroImage: pHero?.asset?.url ?? null,
              images: pImages,
              priceCents: variant?.priceCents ?? null,
            };
          }),
      }
    : null;

  return {
    id: product.id,
    slug: product.slug,
    name: translation?.name ?? product.slug,
    description: translation?.description,
    craftStory: translation?.craftStory,
    materialsText: translation?.materialsText,
    careInstructions: product.careInstructions,
    heroImage: heroMedia?.asset?.url,
    gallery,
    limitedEdition: product.limitedEdition,
    heritageTag: product.heritageTag,
    originCountry: product.originCountry,
    atelierNotes: product.atelierNotes,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      priceCents: variant.priceCents,
      personalizationAllowed: variant.personalizationAllowed,
      availability: variant.inventory?.quantity ?? null,
    })),
    collection: collectionData,
  };
};

// Cache product listing for 30 minutes
const productsOverviewCached = unstable_cache(
  loadProductsOverview,
  ["products", "overview"],
  { revalidate: 1800, tags: ["products"] },
);

// Cache individual product details for 30 minutes
const productDetailCached = unstable_cache(
  loadProductDetail,
  ["products", "detail"],
  { revalidate: 1800, tags: ["products"] },
);

export function getProductsOverview(locale: AppLocale) {
  return productsOverviewCached(locale);
}

export function getProductDetail(locale: AppLocale, slug: string) {
  return productDetailCached(locale, slug);
}
