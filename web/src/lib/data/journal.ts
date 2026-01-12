import type { Locale as AppLocale } from "@/lib/i18n/config";
import { toDbLocale } from "@/lib/i18n/db-locale";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";

type RichParagraph = {
  type: string;
  children?: Array<{ text: string }>;
};

export type JournalCard = {
  id: string;
  slug: string;
  title: string;
  standfirst?: string | null;
  heroImage?: string | null;
  publishedAt?: Date | null;
  category: string;
};

export type JournalFeature = {
  id: string;
  name: string;
  slug: string;
  heroImage?: string | null;
};

export type JournalBlock = {
  id: string;
  type: string;
  headline?: string | null;
  body?: string | null;
  caption?: string | null;
  image?: string | null;
  rawType?: string;
};

export type JournalEntry = {
  id: string;
  slug: string;
  title: string;
  standfirst?: string | null;
  heroImage?: string | null;
  publishedAt?: Date | null;
  category: string;
  bodyParagraphs: string[];
  blocks: JournalBlock[];
  features: JournalFeature[];
};

const getJournalEntriesUncached = async (
  locale: AppLocale,
): Promise<JournalCard[]> => {
  const dbLocale = toDbLocale(locale);

  const posts = await prisma.editorialPost.findMany({
    where: {
      status: ProductStatus.ACTIVE,
    },
    orderBy: [{ publishedAt: "desc" }],
    include: {
      translations: { where: { locale: dbLocale } },
      heroAsset: true,
    },
  });

  return posts.map((post) => {
    const translation = post.translations[0];
    return {
      id: post.id,
      slug: post.slug,
      title: translation?.title ?? post.slug,
      standfirst: translation?.standfirst,
      heroImage: post.heroAsset?.url,
      publishedAt: post.publishedAt,
      category: post.category,
    };
  });
};

// Cache journal list for 1 hour
const journalEntriesCached = unstable_cache(
  getJournalEntriesUncached,
  ["journal", "index"],
  { revalidate: 3600, tags: ["journal"] },
);

export function getJournalEntries(locale: AppLocale) {
  return journalEntriesCached(locale);
}

const getJournalEntryUncached = async (
  locale: AppLocale,
  slug: string,
): Promise<JournalEntry | null> => {
  const dbLocale = toDbLocale(locale);

  const post = await prisma.editorialPost.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale: dbLocale } },
      heroAsset: true,
      blocks: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: { where: { locale: dbLocale } },
          asset: true,
        },
      },
      featuredProducts: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: {
            include: {
              translations: { where: { locale: dbLocale } },
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

  if (!post) {
    return null;
  }

  const translation = post.translations[0];
  const bodyRichText = (translation?.bodyRichText as RichParagraph[]) ?? [];

  const bodyParagraphs = bodyRichText
    .map((paragraph) => {
      if (!paragraph?.children?.length) return "";
      return paragraph.children.map((child) => child.text).join("");
    })
    .filter(Boolean);

  const blocks: JournalBlock[] = post.blocks.map((block) => {
    const blockTranslation = block.translations[0];
    return {
      id: block.id,
      type: block.type,
      rawType: block.type,
      headline: blockTranslation?.headline,
      body: blockTranslation?.body,
      caption: blockTranslation?.caption,
      image: block.asset?.url,
    };
  });

  const features: JournalFeature[] = post.featuredProducts.map(
    (feature) => {
      const product = feature.product;
      const productTranslation = product.translations[0];
      const heroMedia =
        product.media.find((media) => media.placement === "hero") ??
        product.media[0];

      return {
        id: product.id,
        name: productTranslation?.name ?? product.slug,
        slug: product.slug,
        heroImage: heroMedia?.asset?.url,
      };
    },
  );

  return {
    id: post.id,
    slug: post.slug,
    title: translation?.title ?? post.slug,
    standfirst: translation?.standfirst,
    heroImage: post.heroAsset?.url,
    publishedAt: post.publishedAt,
    category: post.category,
    bodyParagraphs,
    blocks,
    features,
  };
};

// Cache journal entries for 1 hour
const journalEntryCached = unstable_cache(
  getJournalEntryUncached,
  ["journal", "detail"],
  { revalidate: 3600, tags: ["journal"] },
);

export function getJournalEntry(locale: AppLocale, slug: string) {
  return journalEntryCached(locale, slug);
}

/**
 * Get unique categories from all journal entries
 */
export async function getJournalCategories(
  locale: AppLocale,
): Promise<string[]> {
  const entries = await getJournalEntries(locale);
  const categories = [...new Set(entries.map((entry) => entry.category))];
  return categories.filter(Boolean);
}
