import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getProductsOverview } from "@/lib/data/products";

type ParamsInput = { locale: Locale } | Promise<{ locale: Locale }>;
type SearchInput = { q?: string } | Promise<{ q?: string }>;

// Search results cache for 5 minutes
export const revalidate = 300;

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: ParamsInput;
  searchParams: SearchInput;
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  if (!resolvedParams?.locale) {
    notFound();
  }

  const locale = resolvedParams.locale;
  const query = (resolvedSearch?.q ?? "").toString().trim().toLowerCase();
  const products = await getProductsOverview(locale);
  const results = query
    ? products.filter((product) => {
        const target = `${product.name} ${product.description ?? ""} ${product.category?.title ?? ""}`.toLowerCase();
        return target.includes(query);
      })
    : products;

  const copy =
    locale === "fr"
      ? {
          title: "Recherche Maison Aurele",
          empty: "Aucun résultat – ajustez votre requête.",
          placeholder: "Robe en taffetas, veste, cuir...",
          label: "Rechercher",
        }
      : {
          title: "Maison Aurele Search",
          empty: "No results — refine your request.",
          placeholder: "Taffeta gown, jacket, leather...",
          label: "Search",
        };

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-screen-2xl space-y-10">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-ink/50">Maison Aurele</p>
          <h1 className="mt-4 font-display text-4xl text-ink">{copy.title}</h1>
          <form method="get" className="mx-auto mt-6 flex max-w-xl items-center gap-3 rounded-full border border-ink/15 px-4 py-2">
            <input
              name="q"
              defaultValue={resolvedSearch?.q ?? ""}
              placeholder={copy.placeholder}
              className="flex-1 bg-transparent text-sm tracking-[0.2em] text-ink outline-none placeholder:text-ink/40"
            />
            <button type="submit" className="rounded-full bg-ink px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-white">
              {copy.label}
            </button>
          </form>
        </header>

        {results.length === 0 ? (
          <p className="text-center text-sm text-ink/60">{copy.empty}</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_30px_90px_rgba(17,11,9,0.08)]">
                <Link href={`/${locale}/products/${product.slug}`} className="relative block aspect-[4/5]">
                  {product.heroImage && (
                    <Image
                      src={product.heroImage}
                      alt={product.name}
                      fill
                      sizes="(min-width:1024px) 30vw, (min-width:768px) 45vw, 90vw"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="space-y-3 px-6 py-5">
                  <p className="text-[0.6rem] uppercase tracking-[0.35em] text-ink/50">
                    {product.category?.title ?? product.categoryGroup?.title ?? "Maison Aurele"}
                  </p>
                  <h2 className="font-display text-2xl text-ink">{product.name}</h2>
                  <p className="text-sm text-ink/70 line-clamp-2">{product.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
