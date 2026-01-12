import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getProductDetail, getProductsOverview, type ProductDetail } from "@/lib/data/products";
import { ShopNavbar } from "@/components/shop/shop-navbar";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { ProductDetailRailLuxury } from "@/components/products/product-detail-rail-luxury";
import { ProductAtelierSection } from "@/components/products/product-atelier-section";
import { ProductSilhouetteSection } from "@/components/products/product-silhouette-section";
import { ProductSimilarSection } from "@/components/products/product-similar-section";
import { ProductCareSection } from "@/components/products/product-care-section";

type PageParams =
  | { locale: Locale; slug: string }
  | Promise<{ locale: Locale; slug: string }>;

export const revalidate = 600;

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
          boutique: "Trouver une boutique",
          contact: "Nous contacter",
          description: "Description",
          size: "Tailles & nuances",
          availability: "Contact & disponibilités",
          book: "Réserver un essayage",
        }
      : {
          boutique: "Find your closest boutique",
          contact: "Contact us",
          description: "Description",
          size: "Size & Shades",
          availability: "Contact & availability",
          book: "Book a fitting",
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

  const descriptionCopy =
    product.description ??
    (locale === "fr"
      ? "Découvrez cette silhouette en détail auprès de nos conseillers ou via un rendez-vous privé."
      : "Explore detailed storytelling with our advisors or during a private appointment.");

  const sizeFitCopy =
    product.craftStory ??
    product.materialsText ??
    (locale === "fr"
      ? "Silhouette taillée dans nos ateliers parisiens. Sélectionnez votre taille habituelle ou contactez notre concierge pour des ajustements sur mesure."
      : "Tailored in our Parisian atelier. Select your usual size or contact our concierge for bespoke adjustments.");

  const contactCopy =
    locale === "fr"
      ? "Nos conseillers répondent sous 24h pour confirmer disponibilités, livraison experte et rendez-vous privés."
      : "Our advisors reply within 24 hours to confirm availability, white-glove delivery and private appointments.";

  const atelierNotes = [product.atelierNotes, product.craftStory, product.materialsText].filter(
    (note): note is string => Boolean(note)
  );

  const silhouetteCollection = product.collection && product.collection.products.length > 1
    ? {
        title: product.collection.title,
        heroImage: product.collection.heroImage ?? gallery[0] ?? product.heroImage ?? null,
        products: product.collection.products,
      }
    : null;

  return (
    <article className="bg-[var(--parchment)] text-ink">
      <ShopNavbar locale={locale} isAuthenticated={false} forceDark />

      {/* Hero Section with Gallery + Sticky Rail */}
      <div className="relative">
        {/* Ambient gradient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[50rem] bg-[radial-gradient(ellipse_at_top,rgba(218,200,182,0.4),transparent_60%)]" />

        <div className="mx-auto grid max-w-screen-2xl items-start gap-12 px-4 pb-32 pt-28 lg:grid-cols-2 lg:px-12">
          {/* Left: Image Gallery with parallax effects */}
          <ProductImageGallery
            locale={locale}
            images={gallery}
            productName={product.name}
          />

          {/* Right: Sticky Product Info Rail */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ProductDetailRailLuxury
              locale={locale}
              copy={copy}
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

      {/* Atelier & Signature Section */}
      <ProductAtelierSection
        locale={locale}
        atelierNotes={atelierNotes}
        heritageTag={product.heritageTag}
        originCountry={product.originCountry}
        priceRange={priceRange}
      />

      {/* Care & Origin Section */}
      <ProductCareSection
        locale={locale}
        careInstructions={product.careInstructions}
        originCountry={product.originCountry}
      />

      {/* Complete the Silhouette Section */}
      {silhouetteCollection && (
        <ProductSilhouetteSection
          locale={locale}
          collection={silhouetteCollection}
          currentProductId={product.id}
        />
      )}

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <ProductSimilarSection
          locale={locale}
          products={similarProducts}
        />
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
  return `${formatter.format(prices[0] / 100)} – ${formatter.format(prices[prices.length - 1] / 100)}`;
}

function pickSimilarProducts(overview: Awaited<ReturnType<typeof getProductsOverview>>, slug: string, handle: string | null) {
  return overview.filter((item) => {
    if (item.slug === slug) return false;
    if (!handle) return true;
    return item.category?.slug === handle || item.categoryGroup?.slug === handle;
  });
}
