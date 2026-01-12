"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Clock, Calendar, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Collection = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  heroImage: string | null;
  releaseDate: Date | string | null;
  productCount?: number;
  dropWindow?: {
    title: string;
    startsAt: Date | string;
    endsAt: Date | string | null;
  } | null;
};

type Props = {
  locale: Locale;
  collections: Collection[];
};

const COPY = {
  en: {
    kicker: "All chapters",
    title: "The Complete Archive",
    subtitle: "Every collection, every story",
    viewCollection: "View collection",
    shopChapter: "Shop chapter",
    pieces: "pieces",
    comingSoon: "Coming soon",
    limitedDrop: "Limited drop",
    noDate: "Timeless",
  },
  fr: {
    kicker: "Tous les chapitres",
    title: "L'Archive Complète",
    subtitle: "Chaque collection, chaque histoire",
    viewCollection: "Voir la collection",
    shopChapter: "Acheter le chapitre",
    pieces: "pièces",
    comingSoon: "Prochainement",
    limitedDrop: "Drop limité",
    noDate: "Intemporel",
  },
} as const;

export function CollectionsGrid({ locale, collections }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <ScrollReveal>
      <section ref={containerRef} className="relative overflow-hidden bg-white py-32">
        {/* Background decoration */}
        <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,242,234,0.8),transparent_60%)]" />
        </motion.div>

        <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles size={14} className="text-[var(--gilded-rose)]" />
              <span className="text-[0.6rem] uppercase tracking-[0.5em] text-ink/40">
                {copy.kicker}
              </span>
            </div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl">
              {copy.title}
            </h2>
            <p className="mt-4 font-display text-xl text-ink/50">{copy.subtitle}</p>
          </motion.div>

          {/* Masonry-style grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {collections.map((collection, index) => (
              <CollectionGridCard
                key={collection.id}
                collection={collection}
                locale={locale}
                index={index}
                copy={copy}
                featured={index === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function CollectionGridCard({
  collection,
  locale,
  index,
  copy,
  featured,
}: {
  collection: Collection;
  locale: Locale;
  index: number;
  copy: (typeof COPY)[keyof typeof COPY];
  featured: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, featured ? -40 : -20]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white shadow-[0_40px_100px_rgba(16,10,8,0.08)] ${featured ? "md:col-span-2" : ""
        }`}
    >
      <div className={`grid ${featured ? "lg:grid-cols-2" : ""}`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? "aspect-[4/3] lg:aspect-auto lg:min-h-[500px]" : "aspect-[4/3]"}`}>
          {collection.heroImage && (
            <motion.div style={{ y: imageY }} className="absolute inset-0">
              <Image
                src={collection.heroImage}
                alt={collection.title}
                fill
                sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Chapter badge */}
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-[0.55rem] uppercase tracking-[0.4em] text-white">
              Chapter {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Drop window badge */}
          {collection.dropWindow && (
            <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-[var(--gilded-rose)] px-4 py-2">
              <Clock size={12} className="text-white" />
              <span className="text-[0.55rem] uppercase tracking-[0.3em] text-white">
                {copy.limitedDrop}
              </span>
            </div>
          )}

          {/* Floating content on image (for non-featured) */}
          {!featured && (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[0.55rem] uppercase tracking-[0.5em] text-white/60">
                {formatRelease(collection.releaseDate, locale, copy)}
              </p>
              <h3 className="mt-2 font-display text-3xl text-white">{collection.title}</h3>
            </div>
          )}
        </div>

        {/* Content (for featured) */}
        {featured && (
          <div className="flex flex-col justify-center p-10 lg:p-14">
            <span className="font-display text-8xl text-ink/[0.04]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="-mt-10 space-y-5">
              <p className="text-[0.55rem] uppercase tracking-[0.5em] text-ink/40">
                {formatRelease(collection.releaseDate, locale, copy)}
              </p>
              <h3 className="font-display text-4xl">{collection.title}</h3>
              {collection.subtitle && (
                <p className="font-display text-lg text-ink/50">{collection.subtitle}</p>
              )}
              {collection.description && (
                <p className="text-sm leading-relaxed text-ink/60">{collection.description}</p>
              )}
              {collection.productCount && (
                <p className="text-[0.55rem] uppercase tracking-[0.4em] text-ink/40">
                  {collection.productCount} {copy.pieces}
                </p>
              )}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href={`/${locale}/collections/${collection.slug}`}
                  className="group/btn inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-ink transition-colors hover:text-[var(--gilded-rose)]"
                >
                  {copy.viewCollection}
                  <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
                <Link
                  href={`/${locale}/shop`}
                  className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-ink/50 transition-colors hover:text-ink"
                >
                  {copy.shopChapter}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar (for non-featured) */}
      {!featured && (
        <div className="flex items-center justify-between border-t border-ink/10 px-6 py-5">
          <div className="flex items-center gap-4">
            {collection.productCount && (
              <span className="text-[0.55rem] uppercase tracking-[0.4em] text-ink/40">
                {collection.productCount} {copy.pieces}
              </span>
            )}
          </div>
          <Link
            href={`/${locale}/collections/${collection.slug}`}
            className="group/btn inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-ink transition-colors hover:text-[var(--gilded-rose)]"
          >
            {copy.viewCollection}
            <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      )}
    </motion.article>
  );
}

function formatRelease(
  date: Date | string | null | undefined,
  locale: Locale,
  copy: (typeof COPY)[keyof typeof COPY]
): string {
  if (!date) return copy.noDate;
  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) {
    return copy.comingSoon;
  }
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(value);
}
