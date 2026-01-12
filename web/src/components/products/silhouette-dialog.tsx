"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

type SilhouetteProduct = {
  id: string;
  slug: string;
  name: string;
  heroImage?: string | null;
  priceCents?: number | null;
};

type SilhouetteData = {
  title: string;
  heroImage?: string | null;
  products: SilhouetteProduct[];
};

export function SilhouetteDialog({
  locale,
  collection,
}: {
  locale: Locale;
  collection: SilhouetteData;
}) {
  const [open, setOpen] = useState(false);

  if (!collection.products.length) {
    return null;
  }

  const formatter = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-ink px-6 py-3 text-xs uppercase tracking-[0.5em] text-ink transition hover:bg-ink hover:text-white"
      >
        {locale === "fr" ? "Silhouette complète" : "Complete silhouette"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10 backdrop-blur">
          <div className="relative max-w-5xl rounded-[2.5rem] border border-white/10 bg-[#0b0b0f] text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white/70 hover:text-white"
            >
              {locale === "fr" ? "Fermer" : "Close"}
            </button>
            <div className="grid gap-0 overflow-hidden rounded-[2.5rem] md:grid-cols-[1.1fr_1fr]">
              <div className="relative min-h-[360px] overflow-hidden bg-black/20">
                {collection.heroImage ? (
                  <Image
                    src={collection.heroImage}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/40">
                    {collection.title}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/60">
                    {locale === "fr" ? "Chapitre" : "Chapter"}
                  </p>
                  <h3 className="mt-2 font-display text-3xl">{collection.title}</h3>
                </div>
              </div>
              <div className="space-y-4 bg-[#0e0e15] px-6 py-8">
                {collection.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${locale}/products/${product.slug}`}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 px-3 py-3 transition hover:border-white/40"
                    onClick={() => setOpen(false)}
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white/5">
                      {product.heroImage && (
                        <Image
                          src={product.heroImage}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-base">{product.name}</p>
                      {typeof product.priceCents === "number" && (
                        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                          {formatter.format(product.priceCents / 100)}
                        </p>
                      )}
                    </div>
                    <span className="text-lg text-white/60">&rsaquo;</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
