import type { Locale } from "@/lib/i18n/config";
import { getHomepageContent } from "@/lib/data/homepage";
import { HeroScene } from "@/components/sections/home/hero-scene";
import { ArtisanMarquee } from "@/components/sections/home/artisan-marquee";
import { GalleryScrollScene } from "@/components/sections/home/gallery-scroll-scene";
import { StoryPanels } from "@/components/sections/home/story-panels";
import { AtelierDiptych } from "@/components/sections/home/atelier-diptych";
import { LookbookCarousel } from "@/components/sections/home/lookbook-carousel";
import { SculptedQuotes } from "@/components/sections/home/sculpted-quotes";
import { EditorialTeaser } from "@/components/sections/home/editorial-teaser";
import { MaisonTimeline } from "@/components/sections/home/maison-timeline";
import { LimitedDropBanner } from "@/components/sections/home/limited-drop-banner";

// Revalidate homepage every hour (data is cached)
export const revalidate = 3600;

type LocaleParams = { locale: Locale } | Promise<{ locale: Locale }>;

export default async function LocaleHome({
  params,
}: {
  params: LocaleParams;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const data = await getHomepageContent(locale);

  return (
    <>
      <HeroScene locale={locale} data={data.hero} />
      <ArtisanMarquee data={data.marquee} />
      <GalleryScrollScene data={data.gallery} />
      <StoryPanels locale={locale} data={data.storyPanels} />
      <AtelierDiptych data={data.diptych} />
      <LookbookCarousel locale={locale} data={data.lookbook} />
      <SculptedQuotes data={data.quotes} />
      <EditorialTeaser locale={locale} data={data.editorial} />
      <MaisonTimeline data={data.timeline} />
      <LimitedDropBanner locale={locale} data={data.limitedDrop} />
    </>
  );
}
