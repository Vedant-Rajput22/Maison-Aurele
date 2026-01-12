import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getProductsOverview } from "@/lib/data/products";

type LocaleParams = { locale: Locale } | Promise<{ locale: Locale }>;

// Revalidate every 30 minutes
export const revalidate = 1800;

export default async function ProductsIndexPage({
  params,
}: {
  params: LocaleParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;
  const products = await getProductsOverview(locale);

  if (products.length === 0) {
    notFound();
  }

  const heroCopy =
    locale === "fr"
      ? {
          kicker: "Boutique couture",
          title: "Silhouettes signatures",
          body: "Velours fumés, dentelles d’archives, satins miroirs : les pièces numérotées de Nuit 07 prêtes à être personnalisées.",
        }
      : {
          kicker: "Couture boutique",
          title: "Signature silhouettes",
          body: "Smoked velvets, archive lace, mirror satins: Nuit 07 numbered looks ready for personalization.",
        };

  return (
    <div className="space-y-16">
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-screen-2xl space-y-6">
          <p className="text-xs uppercase tracking-[0.6em] lux-text-muted">
            {heroCopy.kicker}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl">{heroCopy.title}</h1>
          <p className="max-w-3xl text-sm text-ink/70">{heroCopy.body}</p>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto grid max-w-screen-2xl gap-10 lg:grid-cols-2">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white shadow-[0_40px_100px_rgba(16,10,8,0.08)]"
            >
              <div className="relative h-96 overflow-hidden">
                {product.heroImage && (
                  <Image
                    src={product.heroImage}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent" />
                {product.limitedEdition && (
                  <span className="absolute left-6 top-6 rounded-full border border-white/30 px-4 py-1 text-[0.55rem] uppercase tracking-[0.5em] text-white/80">
                    {locale === "fr" ? "Édition limitée" : "Limited edition"}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-4 px-6 py-7">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.4em] text-ink/50">
                  {product.heritageTag}
                  <span>{formatPrice(product.priceCents, locale)}</span>
                </div>
                <div className="space-y-2">
                  <h2 className="font-display text-3xl text-ink">
                    {product.name}
                  </h2>
                  <p className="text-sm text-ink/70">{product.description}</p>
                </div>
                <Link
                  href={`/${locale}/products/${product.slug}`}
                  className="text-xs uppercase tracking-[0.5em] lux-link"
                >
                  {locale === "fr" ? "Découvrir la pièce" : "View look"}
                </Link>
              </div>
            </article>
          ))}
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

