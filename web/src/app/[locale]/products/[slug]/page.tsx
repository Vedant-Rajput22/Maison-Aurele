import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getProductDetail, getProductsOverview, type ProductDetail } from "@/lib/data/products";
import { SilhouetteDialog } from "@/components/products/silhouette-dialog";
import { ProductDetailRail } from "@/components/products/product-detail-rail";
import { HoverSwapImage } from "@/components/products/hover-swap-image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ShopNavbar } from "@/components/shop/shop-navbar";

type PageParams =
  | { locale: Locale; slug: string }
  | Promise<{ locale: Locale; slug: string }>;

// Revalidate every 30 minutes
export const revalidate = 1800;

export default async function ProductDetailPage({ params }: { params: PageParams }) {
  const resolved = await params;
  const locale = resolved.locale;
  const [product, overview] = await Promise.all([
    getProductDetail(locale, resolved.slug),
    getProductsOverview(locale),
  ]);

  if (!product) {
    notFound();
  }

  const copy =
    locale === "fr"
      ? {
          atelier: "Atelier maison",
          personalization: "Personnalisation",
          care: "Soin & matiere",
          origin: "Origine",
          silhouette: "Silhouette",
          book: "Reserver un essayage",
          boutique: "Trouver une boutique",
          contact: "Nous contacter",
          description: "Description",
          size: "Tailles & nuances",
          availability: "Contact & disponibilites",
          silhouetteTitle: "Completer la silhouette",
          similar: "Pieces similaires",
        }
      : {
          atelier: "Maison atelier",
          personalization: "Personalization",
          care: "Care & material",
          origin: "Origin",
          silhouette: "Silhouette",
          book: "Book a fitting",
          boutique: "Find your closest boutique",
          contact: "Contact us",
          description: "Description",
          size: "Size & Shades",
          availability: "Contact & availability",
          silhouetteTitle: "To complete the silhouette",
          similar: "Similar pieces",
        };

  const variantDisplay = product.variants.map((variant) => ({
    id: variant.id,
    label: [variant.size, variant.color].filter(Boolean).join(" / ") || variant.sku,
    priceCents: variant.priceCents,
    availability: variant.availability,
  }));

  const gallery = product.gallery.length > 0 ? product.gallery : [product.heroImage].filter(Boolean) as string[];
  const priceRange = derivePriceRange(product.variants, locale);
  const referenceCode = product.variants[0]?.sku ?? product.slug;
  const overviewEntry = overview.find((entry) => entry.slug === product.slug);
  const categoryHandle = overviewEntry?.category?.slug ?? overviewEntry?.categoryGroup?.slug ?? null;
  const similarProducts = pickSimilarProducts(overview, product.slug, categoryHandle).slice(0, 4);
  const silhouetteProducts =
    product.collection?.products.filter((look) => look.id !== product.id) ?? [];
  const silhouetteHero = product.collection?.heroImage ?? gallery[0] ?? product.heroImage ?? null;
  const descriptionCopy =
    product.description ??
    (locale === "fr"
      ? "Découvrez cette silhouette en détail auprès de nos conseillers ou via un rendez-vous privé."
      : "Explore detailed storytelling with our advisors or during a private appointment.");
  const sizeFitCopy =
    product.craftStory ??
    product.materialsText ??
    (locale === "fr"
      ? "Silhouette taillee dans nos ateliers parisiens. Selectionnez votre taille habituelle ou contactez notre concierge pour des ajustements sur mesure."
      : "Tailored in our Parisian atelier. Select your usual size or contact our concierge for bespoke adjustments.");
  const contactCopy =
    locale === "fr"
      ? "Nos conseillers repondent sous 24h pour confirmer disponibilites, livraison experte et rendez-vous prives."
      : "Our advisors reply within 24 hours to confirm availability, white-glove delivery and private appointments.";
  const atelierNotes = [product.atelierNotes, product.craftStory, product.materialsText].filter(
    (note): note is string => Boolean(note),
  );

  return (
    <article className="bg-[var(--parchment)] text-ink">
      <ShopNavbar locale={locale} isAuthenticated={false} forceDark />
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(218,200,182,0.35),transparent_65%)]" />
        <div className="mx-auto grid max-w-screen-2xl items-start gap-12 px-4 pb-24 pt-28 lg:grid-cols-2 lg:px-12">
        <div className="space-y-16 lg:pr-10">
          {gallery.map((image, idx) => (
            <div
              key={`${image}-${idx}`}
              className="relative h-[90vh] overflow-hidden rounded-[3rem] border border-ink/5 bg-white shadow-[0_40px_140px_rgba(16,12,9,0.18)]"
            >
              <Image
                src={image}
                alt={product.name}
                fill
                priority={idx === 0}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProductDetailRail
            locale={locale}
            copy={{
              boutique: copy.boutique,
              contact: copy.contact,
              description: copy.description,
              size: copy.size,
              availability: copy.availability,
              book: copy.book,
            }}
            referenceCode={referenceCode}
            productName={product.name}
            productDescription={product.description}
            descriptionCopy={descriptionCopy}
            sizeFitCopy={sizeFitCopy}
            contactCopy={contactCopy}
            priceRange={priceRange}
            variantDisplay={variantDisplay}
            limitedEdition={product.limitedEdition}
            heritageTag={product.heritageTag}
            originCountry={product.originCountry}
          />
        </aside>
      </div>
      </div>

      <ScrollReveal className="border-y border-ink/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.9),rgba(245,238,230,0.95))] px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-6 text-center">
          <p className="text-[0.6rem] uppercase tracking-[0.8em] text-ink/40">
            {locale === "fr" ? "Ecriture de la maison" : "Maison signature"}
          </p>
          <h2 className="max-w-3xl font-display text-3xl leading-tight md:text-4xl">
            {locale === "fr"
              ? "Des lignes sculptees par la lumiere de Paris, accompagnees de finitions invisibles."
              : "Lines sculpted by Paris light, finished with invisible precision."}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.4em] text-ink/50">
            {product.heritageTag && <span className="rounded-full border border-ink/15 px-4 py-2">{product.heritageTag}</span>}
            <span className="rounded-full border border-ink/15 px-4 py-2">{priceRange}</span>
            {product.originCountry && <span className="rounded-full border border-ink/15 px-4 py-2">{product.originCountry}</span>}
          </div>
        </div>
      </ScrollReveal>

        <ScrollReveal className="border-t border-ink/10 bg-[linear-gradient(120deg,#ffffff,rgba(247,242,234,0.9))] px-6 py-20 md:px-12">
          <div className="mx-auto grid max-w-screen-2xl gap-10 lg:grid-cols-[0.6fr_0.4fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.6em] text-ink/50">{copy.atelier}</p>
            <h2 className="font-display text-3xl leading-tight md:text-4xl">
              {locale === "fr"
                ? "Chaque geste est precis, chaque couture est une promesse."
                : "Every gesture is precise, every stitch is a promise."}
            </h2>
            <div className="space-y-3 text-sm text-ink/70">
              {atelierNotes.length > 0
                ? atelierNotes.map((note) => <p key={note}>{note}</p>)
                : null}
            </div>
          </div>
          <div className="rounded-[2.5rem] border border-ink/10 bg-[var(--onyx)] p-8 text-white shadow-[0_30px_80px_rgba(15,11,8,0.28)]">
            <p className="text-xs uppercase tracking-[0.6em] text-white/60">{copy.personalization}</p>
            <p className="mt-4 text-sm text-white/80">
              {locale === "fr"
                ? "Monogrammes, doublures et proportions sont ajustes via notre conciergerie."
                : "Monograms, linings, and proportions can be refined via our concierge."}
            </p>
            <Link
              href={`/${locale}/appointments`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/25 px-6 py-3 text-xs uppercase tracking-[0.5em] text-white transition hover:bg-white/15"
            >
              {copy.book}
            </Link>
            </div>
          </div>
        </ScrollReveal>

      <ScrollReveal className="border-t border-ink/10 bg-[var(--parchment)] px-6 pb-20 pt-14 md:px-12">
        <div className="mx-auto grid max-w-screen-2xl gap-10 rounded-[2.5rem] border border-ink/10 bg-white/90 px-8 py-10 shadow-[0_40px_120px_rgba(16,10,8,0.12)] md:grid-cols-[0.55fr_0.45fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.6em] text-ink/50">{copy.care}</p>
            <div className="text-sm text-ink/75">{renderCare(product.careInstructions)}</div>
          </div>
          <div className="space-y-4 border-t border-ink/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="text-xs uppercase tracking-[0.6em] text-ink/50">{copy.origin}</p>
            <p className="text-sm text-ink/75">
              {product.originCountry ?? (locale === "fr" ? "Atelier parisien" : "Parisian atelier")}
            </p>
            <div className="rounded-[1.5rem] border border-ink/10 bg-[var(--parchment)] px-5 py-4 text-xs uppercase tracking-[0.4em] text-ink/50">
              {locale === "fr" ? "Certificat d'authenticite" : "Certificate of authenticity"}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {product.collection && silhouetteProducts.length > 0 && silhouetteHero && (
        <ScrollReveal className="border-t border-ink/10 bg-white px-4 py-20 md:px-12">
          <div className="mx-auto grid max-w-screen-2xl gap-12 lg:grid-cols-[0.55fr_0.45fr]">
            <div className="relative h-[90vh] overflow-hidden rounded-[3rem] border border-ink/5 bg-white shadow-[0_40px_120px_rgba(12,9,6,0.12)]">
              <HoverSwapImage
                primary={silhouetteHero}
                secondary={product.collection.products[0]?.images?.[1] ?? null}
                alt={product.collection.title}
                sizes="(max-width:1024px)100vw,55vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent px-6 pb-6 pt-16 text-white">
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/60">{copy.silhouetteTitle}</p>
                <h2 className="mt-2 font-display text-3xl">{product.collection.title}</h2>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-ink/10 bg-[var(--parchment)] px-6 py-6 text-sm text-ink/70">
                {locale === "fr"
                  ? "Composez le look complet avec des pieces choisies pour leurs lignes harmonieuses."
                  : "Compose the complete silhouette with pieces chosen for their harmonious lines."}
              </div>
              <div className="space-y-4">
                {silhouetteProducts.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/products/${item.slug}`}
                    className="flex items-center gap-6 rounded-2xl border border-ink/10 bg-white px-4 py-4 transition hover:-translate-y-1 hover:border-ink/30"
                  >
                    <div className="relative h-28 w-24 overflow-hidden rounded-2xl bg-white">
                      {item.heroImage && (
                        <HoverSwapImage
                          primary={item.heroImage}
                          secondary={item.images?.[1] ?? null}
                          alt={item.name}
                          sizes="120px"
                        />
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="font-display text-lg">{item.name}</p>
                      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-ink/50">{formatListPrice(item.priceCents, locale)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <SilhouetteDialog
                locale={locale}
                collection={{
                  title: product.collection.title,
                  heroImage: silhouetteHero,
                  products: product.collection.products,
                }}
              />
            </div>
          </div>
        </ScrollReveal>
      )}

      {similarProducts.length > 0 && (
        <ScrollReveal className="border-t border-ink/10 bg-[var(--parchment)] px-4 py-20 md:px-12">
          <div className="mx-auto max-w-screen-2xl">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.6em] text-ink/50">{copy.similar}</p>
                <h2 className="mt-2 font-display text-3xl">{locale === "fr" ? "D'autres regards" : "Other looks"}</h2>
              </div>
              <Link
                href={`/${locale}/shop`}
                className="text-[0.6rem] uppercase tracking-[0.45em] text-ink/60 underline-offset-4 hover:text-ink"
              >
                {locale === "fr" ? "Voir tout" : "View all"}
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/products/${item.slug}`}
                  className="group rounded-[2rem] border border-ink/10 bg-white p-4 shadow-[0_25px_70px_rgba(12,9,6,0.08)] transition hover:-translate-y-1 hover:border-ink/30"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-[var(--parchment)]">
                    {item.heroImage && (
                      <HoverSwapImage
                        primary={item.heroImage}
                        secondary={item.images?.[1] ?? null}
                        alt={item.name}
                        sizes="(min-width:1024px) 20vw, 40vw"
                      />
                    )}
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-ink/50">
                      {item.category?.title ?? item.categoryGroup?.title ?? "Maison Aurele"}
                    </p>
                    <p className="font-display text-xl">{item.name}</p>
                    <p className="text-sm text-ink/60">{formatListPrice(item.priceCents, locale)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </article>
  );
}

function derivePriceRange(variants: ProductDetail["variants"], locale: Locale) {
  if (variants.length === 0) return locale === "fr" ? "Sur demande" : "Upon request";
  const prices = variants.map((variant) => variant.priceCents).sort((a, b) => a - b);
  const formatter = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  if (prices[0] === prices[prices.length - 1]) {
    return formatter.format(prices[0] / 100);
  }
  return `${formatter.format(prices[0] / 100)} - ${formatter.format(prices[prices.length - 1] / 100)}`;
}

function renderCare(careInstructions: ProductDetail["careInstructions"]) {
  if (
    careInstructions &&
    typeof careInstructions === "object" &&
    "steps" in careInstructions &&
    Array.isArray((careInstructions as { steps: unknown }).steps)
  ) {
    return (
      <ul className="list-disc space-y-1 pl-4">
        {(careInstructions as { steps: string[] }).steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
    );
  }
  if (typeof careInstructions === "string") {
    return careInstructions;
  }
  return (
    <p>
      {Array.isArray(careInstructions)
        ? careInstructions.join(", ")
        : typeof careInstructions === "object"
          ? JSON.stringify(careInstructions)
          : ""}
    </p>
  );
}

function formatListPrice(priceCents: number | null | undefined, locale: Locale) {
  if (!priceCents) {
    return locale === "fr" ? "Sur demande" : "Upon request";
  }
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

function pickSimilarProducts(overview: Awaited<ReturnType<typeof getProductsOverview>>, slug: string, handle: string | null) {
  return overview.filter((item) => {
    if (item.slug === slug) return false;
    if (!handle) return true;
    return item.category?.slug === handle || item.categoryGroup?.slug === handle;
  });
}
