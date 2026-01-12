"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { HoverSwapImage } from "@/components/products/hover-swap-image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type SimilarProduct = {
  id: string;
  name: string;
  slug: string;
  heroImage?: string | null;
  images?: string[];
  priceCents?: number | null;
  category?: { title: string; slug: string } | null;
  categoryGroup?: { title: string; slug: string } | null;
};

type Props = {
  locale: Locale;
  products: SimilarProduct[];
};

const COPY = {
  en: {
    similar: "Similar pieces",
    subtitle: "You may also love",
    viewAll: "View all",
    upon: "Upon request",
    discover: "Discover",
  },
  fr: {
    similar: "Pièces similaires",
    subtitle: "Vous aimerez aussi",
    viewAll: "Voir tout",
    upon: "Sur demande",
    discover: "Découvrir",
  },
  ar: {
    similar: "قطع مشابهة",
    subtitle: "قد يعجبك أيضاً",
    viewAll: "عرض الكل",
    upon: "عند الطلب",
    discover: "اكتشف",
  },
} as const;

function formatPrice(priceCents: number | null | undefined, locale: Locale) {
  if (!priceCents) {
    return COPY[locale]?.upon ?? "Upon request";
  }
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function ProductSimilarSection({ locale, products }: Props) {
  const copy = COPY[locale] || COPY.en;

  if (products.length === 0) return null;

  return (
    <ScrollReveal>
      <section className="relative overflow-hidden border-t border-ink/10 bg-[var(--parchment)]">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.8),transparent_60%)]" />

        <div className="relative mx-auto max-w-screen-2xl px-4 py-24 md:px-12">
          {/* Header */}
          <div className="mb-16 flex flex-col items-center justify-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[0.6rem] uppercase tracking-[0.6em] text-ink/50">{copy.similar}</p>
              <h2 className="mt-2 font-display text-4xl">{copy.subtitle}</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href={`/${locale}/shop`}
                className="group inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.5em] text-ink/60 transition hover:text-ink"
              >
                {copy.viewAll}
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Products grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link
                  href={`/${locale}/products/${item.slug}`}
                  className="group block"
                >
                  {/* Card container */}
                  <div className="relative overflow-hidden rounded-[2rem] border border-ink/8 bg-white p-4 shadow-[0_25px_80px_rgba(12,9,6,0.08)] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-ink/20 group-hover:shadow-[0_40px_100px_rgba(12,9,6,0.15)]">
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-[var(--parchment)] to-white">
                      {item.heroImage && (
                        <HoverSwapImage
                          primary={item.heroImage}
                          secondary={item.images?.[1] ?? null}
                          alt={item.name}
                          sizes="(min-width:1024px) 20vw, 40vw"
                        />
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="rounded-full bg-white/90 px-6 py-2 text-xs uppercase tracking-[0.3em] text-ink opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                        >
                          {copy.discover}
                        </motion.div>
                      </div>

                      {/* Corner accent */}
                      <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60" />
                    </div>

                    {/* Content */}
                    <div className="mt-5 space-y-2">
                      <p className="text-[0.55rem] uppercase tracking-[0.5em] text-ink/45">
                        {item.category?.title ?? item.categoryGroup?.title ?? "Maison Aurèle"}
                      </p>
                      <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-ink">
                        {item.name}
                      </h3>
                      <p className="text-sm text-ink/60">{formatPrice(item.priceCents, locale)}</p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <ArrowRight size={14} className="text-ink/60" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
