import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getCollectionDetail } from "@/lib/data/collections";
import { CollectionVideoHero } from "@/components/collections/collection-video-hero";

// Revalidate every hour (data is cached)
export const revalidate = 3600;

type PageParams =
  | { locale: Locale; slug: string }
  | Promise<{ locale: Locale; slug: string }>;

export default async function CollectionDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;
  const data = await getCollectionDetail(locale, resolved.slug);

  if (!data) {
    notFound();
  }

  const featuredProductSlug = data.products[0]?.slug;

  return (
    <div className="space-y-20">
      <CollectionVideoHero
        title={data.title}
        description={data.description}
        manifesto={data.manifesto}
        slug={resolved.slug}
        locale={locale}
        heroImage={data.heroImage}
        featuredProductSlug={featuredProductSlug}
        dropWindow={data.dropWindow}
      />

      <section className="px-6 md:px-12">
        <div className="mx-auto grid max-w-screen-2xl gap-10 lg:grid-cols-3">
          {data.sections.map((section) => (
            <article
              key={section.id}
              className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_30px_90px_rgba(16,10,8,0.08)]"
            >
              {section.image && (
                <div className="relative h-64">
                  <Image
                    src={section.image}
                    alt={section.heading}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-3 px-6 py-6">
                <p className="text-xs uppercase tracking-[0.5em] lux-text-muted">
                  {section.caption}
                </p>
                <h2 className="font-display text-2xl">{section.heading}</h2>
                <p className="text-sm text-ink/70">{section.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.6em] lux-text-muted">
            {locale === "fr"
              ? "Boutique en ligne du chapitre"
              : "Shop the chapter"}
          </p>
          <h2 className="mt-3 font-display text-4xl">
            {locale === "fr"
              ? "Pièces maîtresses du chapitre"
              : "Key looks from this chapter"}
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {data.products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-[2rem] border border-ink/10 bg-white/70 backdrop-blur"
              >
                {product.heroImage && (
                  <div className="relative h-72">
                    <Image
                      src={product.heroImage}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 px-5 py-6">
                  <h3 className="font-display text-2xl">{product.name}</h3>
                  <p className="text-sm text-ink/70">{product.description}</p>
                  <div className="mt-auto text-xs uppercase tracking-[0.5em] text-ink/60">
                    {formatPrice(product.priceCents, locale)}
                  </div>
                  <Link
                    href={`/${locale}/products/${product.slug}`}
                    className="text-xs uppercase tracking-[0.5em] lux-link"
                  >
                    {locale === "fr" ? "Voir la pièce" : "View look"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {data.lookbook.length > 0 && (
        <section className="px-6 pb-24 md:px-12">
          <div className="mx-auto flex max-w-screen-2xl flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.6em] lux-text-muted">
                {locale === "fr" ? "Frise" : "Frieze"}
              </p>
              <h2 className="font-display text-4xl">
                {locale === "fr"
                  ? "Lookbook cinématique"
                  : "Cinematic lookbook"}
              </h2>
            </div>
            <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6">
              {data.lookbook.map((slide) => (
                <div
                  key={slide.id}
                  className="w-[280px] flex-none snap-center overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_30px_70px_rgba(9,9,12,0.08)]"
                >
                  {slide.image && (
                    <div className="relative h-64">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        sizes="280px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2 px-5 py-5">
                    <h3 className="font-display text-xl">{slide.title}</h3>
                    <p className="text-sm text-ink/70">{slide.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto max-w-screen-lg rounded-[2.5rem] border border-ink/10 bg-white px-8 py-10 text-center shadow-[0_40px_100px_rgba(14,10,8,0.08)]">
          <p className="text-xs uppercase tracking-[0.5em] text-ink/50">
            {locale === "fr" ? "Rendez-vous privé" : "Private appointment"}
          </p>
          <h3 className="mt-4 font-display text-3xl text-ink">
            {locale === "fr"
              ? "Découvrir Nuit 07 en salon"
              : "Discover Nuit 07 inside the salon"}
          </h3>
          <p className="mt-3 text-sm text-ink/70">
            {locale === "fr"
              ? "Réservez une présentation privée au Faubourg ou en rendez-vous virtuel avec notre concierge."
              : "Book a private presentation at the Faubourg salon or a virtual appointment with our concierge."}
          </p>
          <Link
            href={`/${locale}/appointments`}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-ink/20 px-8 py-3 text-xs uppercase tracking-[0.5em] text-ink transition hover:bg-ink hover:text-white"
          >
            {locale === "fr" ? "Planifier" : "Schedule"}
          </Link>
        </div>
      </section>
    </div>
  );
}

function formatPrice(priceCents: number | null | undefined, locale: Locale) {
  if (!priceCents) return locale === "fr" ? "Sur demande" : "Upon request";
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}
