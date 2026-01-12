"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
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
    featured: "Featured chapter",
    explore: "Explore chapter",
    shop: "Shop looks",
    viewAll: "View all chapters",
    pieces: "pieces",
    comingSoon: "Coming soon",
    dropWindow: "Limited window",
  },
  fr: {
    featured: "Chapitre vedette",
    explore: "Explorer le chapitre",
    shop: "Acheter les looks",
    viewAll: "Voir tous les chapitres",
    pieces: "pièces",
    comingSoon: "Prochainement",
    dropWindow: "Fenêtre limitée",
  },
} as const;

export function CollectionsFeatured({ locale, collections }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // First collection is featured
  const featured = collections[0];
  const others = collections.slice(1, 4);

  if (!featured) return null;

  return (
    <ScrollReveal>
      <section ref={containerRef} className="relative overflow-hidden bg-white py-32">
        {/* Decorative background */}
        <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(218,200,182,0.3),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(218,200,182,0.2),transparent_60%)]" />
        </motion.div>

        <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12">
          {/* Featured collection - Large card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Kicker */}
            <div className="mb-8 flex items-center gap-3">
              <Sparkles size={14} className="text-[var(--gilded-rose)]" />
              <span className="text-[0.6rem] uppercase tracking-[0.5em] text-ink/50">
                {copy.featured}
              </span>
            </div>

            <div className="group relative overflow-hidden rounded-[3rem] border border-ink/10 bg-white shadow-[0_60px_150px_rgba(16,10,8,0.1)]">
              <div className="grid lg:grid-cols-[1.3fr_1fr]">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[600px]">
                  {featured.heroImage && (
                    <Image
                      src={featured.heroImage}
                      alt={featured.title}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/20 lg:to-white" />

                  {/* Drop badge */}
                  {featured.dropWindow && (
                    <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <Calendar size={12} className="text-white" />
                      <span className="text-[0.6rem] uppercase tracking-[0.4em] text-white">
                        {copy.dropWindow}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-10 lg:p-14">
                  {/* Chapter number */}
                  <span className="font-display text-8xl text-ink/[0.06]">01</span>

                  <div className="-mt-8 space-y-6">
                    {/* Release date */}
                    <p className="text-[0.6rem] uppercase tracking-[0.5em] text-ink/40">
                      {formatRelease(featured.releaseDate, locale)}
                    </p>

                    <h2 className="font-display text-4xl leading-tight md:text-5xl">
                      {featured.title}
                    </h2>

                    {featured.subtitle && (
                      <p className="font-display text-xl text-ink/60">
                        {featured.subtitle}
                      </p>
                    )}

                    {featured.description && (
                      <p className="text-sm leading-relaxed text-ink/60">
                        {featured.description}
                      </p>
                    )}

                    {/* Product count */}
                    {featured.productCount && (
                      <p className="text-[0.6rem] uppercase tracking-[0.5em] text-ink/40">
                        {featured.productCount} {copy.pieces}
                      </p>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Link
                        href={`/${locale}/collections/${featured.slug}`}
                        className="group/btn inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs uppercase tracking-[0.3em] text-white transition-all hover:bg-ink/90"
                      >
                        {copy.explore}
                        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                      <Link
                        href={`/${locale}/shop`}
                        className="inline-flex items-center gap-3 rounded-full border border-ink/20 px-8 py-4 text-xs uppercase tracking-[0.3em] text-ink transition-all hover:bg-ink/5"
                      >
                        {copy.shop}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Other collections grid */}
          {others.length > 0 && (
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {others.map((collection, index) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  locale={locale}
                  index={index + 2}
                  copy={copy}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </ScrollReveal>
  );
}

function CollectionCard({
  collection,
  locale,
  index,
  copy,
}: {
  collection: Collection;
  locale: Locale;
  index: number;
  copy: (typeof COPY)[keyof typeof COPY];
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white shadow-[0_30px_80px_rgba(16,10,8,0.06)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {collection.heroImage && (
          <Image
            src={collection.heroImage}
            alt={collection.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Chapter number overlay */}
        <span className="absolute right-6 top-6 font-display text-6xl text-white/20">
          {String(index).padStart(2, "0")}
        </span>

        {/* Drop badge */}
        {collection.dropWindow && (
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[0.5rem] uppercase tracking-[0.3em] text-white">
              {collection.dropWindow.title}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3 p-6">
        <p className="text-[0.55rem] uppercase tracking-[0.5em] text-ink/40">
          {formatRelease(collection.releaseDate, locale)}
        </p>
        <h3 className="font-display text-2xl">{collection.title}</h3>
        {collection.subtitle && (
          <p className="text-sm text-ink/60">{collection.subtitle}</p>
        )}
        <Link
          href={`/${locale}/collections/${collection.slug}`}
          className="inline-flex items-center gap-2 pt-2 text-[0.6rem] uppercase tracking-[0.4em] text-ink transition-colors hover:text-[var(--gilded-rose)]"
        >
          {copy.explore}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}

function formatRelease(date: Date | string | null | undefined, locale: Locale): string {
  if (!date) return locale === "fr" ? "Prochainement" : "Coming soon";
  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) {
    return locale === "fr" ? "À venir" : "Upcoming";
  }
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(value);
}
