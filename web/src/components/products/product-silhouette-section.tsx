"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";
import { HoverSwapImage } from "@/components/products/hover-swap-image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ArrowRight, Sparkles } from "lucide-react";

type SilhouetteProduct = {
  id: string;
  name: string;
  slug: string;
  heroImage?: string | null;
  images?: string[];
  priceCents?: number | null;
};

type Collection = {
  title: string;
  heroImage?: string | null;
  products: SilhouetteProduct[];
};

type Props = {
  locale: Locale;
  collection: Collection;
  currentProductId: string;
};

const COPY = {
  en: {
    completeTheLook: "Complete the silhouette",
    curated: "Curated companions",
    description:
      "Pieces thoughtfully selected to harmonize with your choice, creating a cohesive expression of personal style.",
    viewAll: "View full collection",
    upon: "Upon request",
    discover: "Discover",
  },
  fr: {
    completeTheLook: "Compléter la silhouette",
    curated: "Pièces complémentaires",
    description:
      "Des pièces soigneusement sélectionnées pour s'harmoniser avec votre choix, créant une expression cohérente de votre style personnel.",
    viewAll: "Voir la collection",
    upon: "Sur demande",
    discover: "Découvrir",
  },
  ar: {
    completeTheLook: "أكمل الإطلالة",
    curated: "قطع مكملة",
    description:
      "قطع مختارة بعناية لتتناغم مع اختيارك، مما يخلق تعبيراً متناسقاً عن أسلوبك الشخصي.",
    viewAll: "عرض المجموعة الكاملة",
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

export function ProductSilhouetteSection({ locale, collection, currentProductId }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLElement>(null);
  const products = collection.products.filter((p) => p.id !== currentProductId).slice(0, 4);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  if (products.length === 0 || !collection.heroImage) return null;

  return (
    <ScrollReveal>
      <section
        ref={containerRef}
        className="relative overflow-hidden border-t border-ink/10 bg-gradient-to-b from-white via-[var(--parchment)]/30 to-white"
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(218,200,182,0.15),transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(218,200,182,0.15),transparent_70%)]" />

        <div className="mx-auto grid max-w-screen-2xl gap-12 px-4 py-24 md:px-12 lg:grid-cols-[0.55fr_0.45fr]">
          {/* Hero image with parallax */}
          <motion.div
            style={{ y: heroY, scale: heroScale }}
            className="relative h-[85vh] overflow-hidden rounded-[3rem] border border-ink/5 bg-white shadow-[0_50px_150px_rgba(12,9,6,0.15)]"
          >
            <HoverSwapImage
              primary={collection.heroImage}
              secondary={products[0]?.images?.[1] ?? null}
              alt={collection.title}
              sizes="(max-width:1024px)100vw,55vw"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-8 pb-10 pt-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.5em] text-white/70">
                  <Sparkles size={12} />
                  {copy.completeTheLook}
                </p>
                <h2 className="mt-3 font-display text-4xl text-white">{collection.title}</h2>
              </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute right-6 top-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[0.6rem] uppercase tracking-[0.4em] text-white backdrop-blur-sm"
            >
              {products.length} {locale === "fr" ? "pièces" : "pieces"}
            </motion.div>
          </motion.div>

          {/* Products grid */}
          <div className="flex flex-col gap-6">
            {/* Section header */}
            <div className="rounded-[2rem] border border-ink/8 bg-white/80 p-8 backdrop-blur-sm">
              <p className="text-[0.6rem] uppercase tracking-[0.5em] text-ink/50">{copy.curated}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">{copy.description}</p>
            </div>

            {/* Product cards */}
            <div className="grid gap-4">
              {products.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link
                    href={`/${locale}/products/${item.slug}`}
                    className="group flex items-center gap-5 rounded-2xl border border-ink/8 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-lg"
                  >
                    {/* Product image */}
                    <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--parchment)]">
                      {item.heroImage && (
                        <HoverSwapImage
                          primary={item.heroImage}
                          secondary={item.images?.[1] ?? null}
                          alt={item.name}
                          sizes="120px"
                        />
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="font-display text-lg leading-tight transition-colors group-hover:text-ink">
                        {item.name}
                      </p>
                      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-ink/50">
                        {formatPrice(item.priceCents, locale)}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-ink/10 transition-all duration-300 group-hover:border-ink/30 group-hover:bg-ink group-hover:text-white">
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* View all link */}
            {collection.products.length > 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex justify-center"
              >
                <Link
                  href={`/${locale}/collections`}
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/15 px-8 py-3 text-xs uppercase tracking-[0.4em] text-ink/70 transition hover:border-ink/30 hover:bg-ink hover:text-white"
                >
                  {copy.viewAll}
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
