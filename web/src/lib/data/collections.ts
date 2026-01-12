import type { Locale as AppLocale } from "@/lib/i18n/config";
import { toDbLocale } from "@/lib/i18n/db-locale";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type CollectionOverviewCard = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  heroImage?: string | null;
  releaseDate?: Date | null;
  productCount?: number;
  dropWindow?: { title: string; startsAt: Date; endsAt: Date | null } | null;
};

export type CollectionDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  manifesto?: string | null;
  description?: string | null;
  heroImage?: string | null;
  releaseDate?: Date | null;
  sections: Array<{
    id: string;
    heading: string;
    body?: string | null;
    caption?: string | null;
    layout?: string | null;
    image?: string | null;
  }>;
  lookbook: Array<{
    id: string;
    title: string;
    body?: string | null;
    image?: string | null;
  }>;
  products: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    heroImage?: string | null;
    priceCents?: number | null;
    limitedEdition: boolean;
  }>;
  dropWindow?: { title: string; startsAt: Date; endsAt?: Date | null } | null;
};

const getCollectionsOverviewUncached = async (
  locale: AppLocale,
): Promise<CollectionOverviewCard[]> => {
  const dbLocale = toDbLocale(locale);

  const collections = await prisma.collection.findMany({
    orderBy: [{ releaseDate: "desc" }],
    include: {
      translations: {
        where: { locale: dbLocale },
      },
      heroAsset: true,
      drops: {
        orderBy: { startsAt: "desc" },
      },
      _count: {
        select: { items: true },
      },
    },
  });

  return collections.map((collection) => {
    const translation = collection.translations[0];
    const drop = collection.drops[0];

    return {
      id: collection.id,
      slug: collection.slug,
      title: translation?.title ?? collection.slug,
      subtitle: translation?.subtitle,
      description: translation?.description,
      heroImage: collection.heroAsset?.url,
      releaseDate: collection.releaseDate,
      productCount: collection._count.items,
      dropWindow: drop
        ? {
          title: drop.title,
          startsAt: drop.startsAt,
          endsAt: drop.endsAt ?? null,
        }
        : null,
    };
  });
};

// Cache collections for 1 hour
const collectionsOverviewCached = unstable_cache(
  getCollectionsOverviewUncached,
  ["collections", "overview"],
  { revalidate: 3600, tags: ["collections"] },
);

export function getCollectionsOverview(locale: AppLocale) {
  return collectionsOverviewCached(locale);
}

const getCollectionDetailUncached = async (
  locale: AppLocale,
  slug: string,
): Promise<CollectionDetail | null> => {
  const dbLocale = toDbLocale(locale);

  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale: dbLocale } },
      heroAsset: true,
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: { where: { locale: dbLocale } },
          asset: true,
        },
      },
      lookbookSlides: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: { where: { locale: dbLocale } },
          asset: true,
        },
      },
      drops: {
        orderBy: { startsAt: "desc" },
      },
      items: {
        orderBy: { sortOrder: "asc" },
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
              },
            },
          },
        },
      },
    },
  });

  if (!collection) {
    return null;
  }

  const translation = collection.translations[0];
  const drop = collection.drops[0];

  const sections = collection.sections.map((section) => {
    const sectionTranslation = section.translations[0];
    return {
      id: section.id,
      heading: sectionTranslation?.heading ?? "",
      body: sectionTranslation?.body,
      caption: sectionTranslation?.caption,
      layout: section.layout,
      image: section.asset?.url,
    };
  });

  const lookbook = collection.lookbookSlides.map((slide) => {
    const slideTranslation = slide.translations[0];
    return {
      id: slide.id,
      title: slideTranslation?.title ?? "",
      body: slideTranslation?.body,
      image: slide.asset?.url,
    };
  });

  const products = collection.items.map((item) => {
    const product = item.product;
    const productTranslation = product.translations[0];
    const featuredMedia =
      product.media.find((media) => media.placement === "hero") ??
      product.media[0];
    const price = product.variants[0]?.priceCents ?? null;

    return {
      id: product.id,
      slug: product.slug,
      name: productTranslation?.name ?? product.slug,
      description: productTranslation?.description,
      heroImage: featuredMedia?.asset?.url,
      priceCents: price,
      limitedEdition: product.limitedEdition,
    };
  });

  return {
    id: collection.id,
    slug: collection.slug,
    title: translation?.title ?? collection.slug,
    subtitle: translation?.subtitle,
    manifesto: translation?.manifesto,
    description: translation?.description,
    heroImage: collection.heroAsset?.url,
    releaseDate: collection.releaseDate,
    sections,
    lookbook,
    products,
    dropWindow: drop
      ? {
        title: drop.title,
        startsAt: drop.startsAt,
        endsAt: drop.endsAt,
      }
      : null,
  };
};

// Cache individual collection details for 1 hour
const collectionDetailCached = unstable_cache(
  getCollectionDetailUncached,
  ["collections", "detail"],
  { revalidate: 3600, tags: ["collections"] },
);

export function getCollectionDetail(locale: AppLocale, slug: string) {
  return collectionDetailCached(locale, slug);
}
