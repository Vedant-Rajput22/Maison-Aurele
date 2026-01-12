export type HeroStat = {
  label: string;
  value: string;
};

export type HeroContent = {
  pretitle: string;
  titleLines: string[];
  manifesto: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: HeroStat[];
  video: {
    src: string;
    poster?: string;
  };
};

export type MarqueeContent = {
  items: string[];
};

export type GalleryArtwork = {
  title: string;
  body: string;
  image: string;
};

export type GalleryScrollSceneContent = {
  kicker: string;
  heading: string;
  description: string;
  artworks: GalleryArtwork[];
};

export type StoryPanel = {
  title: string;
  body: string;
  tag: string;
  image: string;
};

export type StoryPanelsContent = {
  kicker: string;
  heading: string;
  description: string;
  panels: StoryPanel[];
  collectionSlug?: string;
};

export type AtelierDiptychContent = {
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
  images: { src: string; alt: string }[];
};

export type LookbookCarouselSlide = {
  title: string;
  body: string;
  image: string;
};

export type LookbookCarouselContent = {
  kicker: string;
  title: string;
  description: string;
  slides: LookbookCarouselSlide[];
  collectionSlug?: string;
};

export type SculptedQuotesContent = {
  quotes: string[];
};

export type EditorialTeaserContent = {
  title: string;
  body: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
  heroImage: string;
  badgeLabel?: string;
};

export type MaisonTimelineEntry = {
  year: string;
  title: string;
  body: string;
};

export type MaisonTimelineContent = {
  kicker: string;
  title: string;
  description: string;
  entries: MaisonTimelineEntry[];
};

export type LimitedDropBannerContent = {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export type HomepageContent = {
  hero: HeroContent;
  marquee: MarqueeContent;
  gallery: GalleryScrollSceneContent;
  storyPanels: StoryPanelsContent;
  diptych: AtelierDiptychContent;
  lookbook: LookbookCarouselContent;
  quotes: SculptedQuotesContent;
  editorial: EditorialTeaserContent;
  timeline: MaisonTimelineContent;
  limitedDrop: LimitedDropBannerContent;
};
