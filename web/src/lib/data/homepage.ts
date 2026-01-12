import type { HomepageContent, LookbookCarouselContent, StoryPanelsContent } from "@/lib/data/homepage-types";
import type { Locale as AppLocale } from "@/lib/i18n/config";
import { toDbLocale } from "@/lib/i18n/db-locale";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import type { HomepageModule, Locale as DbLocale } from "@prisma/client";
import type {
  AtelierDiptychContent,
  EditorialTeaserContent,
  GalleryScrollSceneContent,
  HeroContent,
  LimitedDropBannerContent,
  MaisonTimelineContent,
  MarqueeContent,
  SculptedQuotesContent,
} from "./homepage-types";

type HomepageModuleType =
  | "hero_scene"
  | "artisan_marquee"
  | "gallery_scroll_scene"
  | "story_panels"
  | "atelier_diptych"
  | "lookbook_carousel"
  | "sculpted_quotes"
  | "editorial_teaser"
  | "maison_timeline"
  | "limited_drop_banner";

type StoryPanelsModuleConfig = {
  collectionSlug?: string | null;
  kicker: string;
  heading: string;
  description: string;
  limit?: number;
};

type LookbookModuleConfig = {
  collectionSlug?: string | null;
  kicker: string;
  title: string;
  description: string;
};

type EditorialModuleConfig = {
  postSlug?: string | null;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
  badgeLabel?: string;
};

type LimitedDropModuleConfig = {
  dropId?: string | null;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

const moduleTypes: HomepageModuleType[] = [
  "hero_scene",
  "artisan_marquee",
  "gallery_scroll_scene",
  "story_panels",
  "atelier_diptych",
  "lookbook_carousel",
  "sculpted_quotes",
  "editorial_teaser",
  "maison_timeline",
  "limited_drop_banner",
];

function readModule<T>(
  modules: Map<string, HomepageModule>,
  type: HomepageModuleType,
): T {
  const entry = modules.get(type);
  if (!entry) {
    throw new Error(`Homepage module "${type}" is missing for the requested locale.`);
  }
  return entry.config as T;
}

const getHomepageContentUncached = async (
  locale: AppLocale,
): Promise<HomepageContent> => {
  // Log when actually hitting database
  console.log(`[CACHE MISS] Homepage content for ${locale} - fetching from DB`);
  
  const dbLocale = toDbLocale(locale);

  const modules = await prisma.homepageModule.findMany({
    where: { locale: dbLocale },
    orderBy: { sortOrder: "asc" },
  });

  const moduleMap = new Map(modules.map((module) => [module.type, module]));
  const missingTypes = moduleTypes.filter((type) => !moduleMap.has(type));
  if (missingTypes.length > 0) {
    throw new Error(`Missing homepage modules: ${missingTypes.join(", ")}`);
  }

  const hero = readModule<HeroContent>(moduleMap, "hero_scene");
  const marquee = readModule<MarqueeContent>(moduleMap, "artisan_marquee");
  const gallery = readModule<GalleryScrollSceneContent>(moduleMap, "gallery_scroll_scene");
  const diptych = readModule<AtelierDiptychContent>(moduleMap, "atelier_diptych");
  const quotes = readModule<SculptedQuotesContent>(moduleMap, "sculpted_quotes");
  const timeline = readModule<MaisonTimelineContent>(moduleMap, "maison_timeline");
  const limitedDropConfig = readModule<LimitedDropModuleConfig>(moduleMap, "limited_drop_banner");
  const editorialConfig = readModule<EditorialModuleConfig>(moduleMap, "editorial_teaser");
  const storyConfig = readModule<StoryPanelsModuleConfig>(moduleMap, "story_panels");
  const lookbookConfig = readModule<LookbookModuleConfig>(moduleMap, "lookbook_carousel");

  const collectionLoaders = new Map<string, Promise<CollectionNarrative | null>>();
  const getCollection = (slug?: string | null) => {
    if (!slug) return null;
    if (!collectionLoaders.has(slug)) {
      collectionLoaders.set(slug, loadCollectionNarrative(slug, dbLocale));
    }
    return collectionLoaders.get(slug)!;
  };

  const [
    storyCollection,
    lookbookCollection,
    editorial,
    limitedDrop,
  ] = await Promise.all([
    getCollection(storyConfig.collectionSlug),
    getCollection(lookbookConfig.collectionSlug),
    buildEditorial(editorialConfig, dbLocale),
    buildLimitedDrop(limitedDropConfig),
  ]);

  return {
    hero,
    marquee,
    gallery,
    storyPanels: mapStoryPanels(storyConfig, storyCollection),
    diptych,
    lookbook: mapLookbook(lookbookConfig, lookbookCollection),
    quotes,
    editorial,
    timeline,
    limitedDrop,
  };
};

// Cache homepage for 1 hour - it rarely changes
const getHomepageContentCached = unstable_cache(
  getHomepageContentUncached,
  ["homepage-content"],
  { revalidate: 3600, tags: ["homepage"] },
);

export function getHomepageContent(locale: AppLocale) {
  return getHomepageContentCached(locale);
}

type CollectionNarrative = Awaited<ReturnType<typeof loadCollectionNarrative>>;

async function loadCollectionNarrative(slug: string, locale: DbLocale) {
  return prisma.collection.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: { where: { locale } },
          asset: true,
        },
      },
      lookbookSlides: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: { where: { locale } },
          asset: true,
        },
      },
    },
  });
}

function mapStoryPanels(
  config: StoryPanelsModuleConfig,
  collection: CollectionNarrative | null,
): StoryPanelsContent {
  const panels = (collection?.sections ?? [])
    .slice(0, config.limit ?? 3)
    .map((section) => {
      const translation = section.translations[0];
      return {
        title: translation?.heading ?? "",
        body: translation?.body ?? "",
        tag: translation?.caption ?? "",
        image: section.asset?.url ?? "",
      };
    });

  return {
    kicker: config.kicker,
    heading: config.heading,
    description: config.description,
    panels,
    collectionSlug: config.collectionSlug ?? undefined,
  };
}

function mapLookbook(
  config: LookbookModuleConfig,
  collection: CollectionNarrative | null,
): LookbookCarouselContent {
  const slides = (collection?.lookbookSlides ?? []).map((slide) => {
    const translation = slide.translations[0];
    return {
      title: translation?.title ?? "",
      body: translation?.body ?? "",
      image: slide.asset?.url ?? "",
    };
  });

  return {
    kicker: config.kicker,
    title: config.title,
    description: config.description,
    slides,
    collectionSlug: config.collectionSlug ?? undefined,
  };
}

async function buildEditorial(
  config: EditorialModuleConfig,
  locale: DbLocale,
): Promise<EditorialTeaserContent> {
  const editorial = config.postSlug
    ? await prisma.editorialPost.findUnique({
        where: { slug: config.postSlug },
        include: {
          translations: { where: { locale } },
          heroAsset: true,
        },
      })
    : null;

  const translation = editorial?.translations[0];

  return {
    title: translation?.title ?? config.postSlug ?? "",
    body: translation?.standfirst ?? "",
    highlights: config.highlights,
    ctaLabel: config.ctaLabel,
    ctaHref: config.ctaHref,
    heroImage: editorial?.heroAsset?.url ?? "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80",
    badgeLabel: config.badgeLabel,
  };
}

async function buildLimitedDrop(
  config: LimitedDropModuleConfig,
): Promise<LimitedDropBannerContent> {
  const drop = config.dropId
    ? await prisma.limitedDrop.findUnique({
        where: { id: config.dropId },
      })
    : null;

  const title = drop ? `${config.title}` : config.title;
  const body = drop
    ? `${config.body} (${drop.title})`
    : config.body;

  return {
    title,
    body,
    ctaLabel: config.ctaLabel,
    ctaHref: config.ctaHref,
  };
}
