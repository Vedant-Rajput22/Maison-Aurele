"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { JournalFeature } from "@/lib/data/journal";
import { ArrowUpRight, ShoppingBag } from "lucide-react";

type JournalFeaturedProductsProps = {
  locale: Locale;
  features: JournalFeature[];
};

const COPY = {
  en: {
    section: "Cited Silhouettes",
    subtitle: "Shop the looks mentioned in this essay",
    discover: "Discover",
    addToBag: "Add to bag",
  },
  fr: {
    section: "Silhouettes citées",
    subtitle: "Commander les pièces mentionnées dans cet essai",
    discover: "Découvrir",
    addToBag: "Ajouter au panier",
  },
  ar: {
    section: "الصور الظلية المذكورة",
    subtitle: "تسوّق الإطلالات المذكورة في هذا المقال",
    discover: "اكتشف",
    addToBag: "أضف إلى الحقيبة",
  },
};

export function JournalFeaturedProducts({ locale, features }: JournalFeaturedProductsProps) {
  const copy = COPY[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  if (features.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[var(--parchment)] to-white px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-screen-xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12"
        >
          <span className="text-xs uppercase tracking-[0.5em] text-[var(--gilded-rose)]">
            {copy.section}
          </span>
          <h2 className="mt-3 font-display text-3xl text-[var(--espresso)] md:text-4xl">
            {copy.subtitle}
          </h2>
        </motion.div>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeaturedProductCard
              key={feature.id}
              feature={feature}
              locale={locale}
              index={index}
              isInView={isInView}
              copy={copy}
            />
          ))}
        </div>

        {/* Shop CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href={`/${locale}/shop`}
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--espresso)]/20 bg-[var(--onyx)] px-8 py-4 text-xs uppercase tracking-[0.4em] text-white transition-all duration-300 hover:bg-[var(--espresso)]"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{locale === "fr" ? "Explorer la boutique" : "Explore the shop"}</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedProductCard({
  feature,
  locale,
  index,
  isInView,
  copy,
}: {
  feature: JournalFeature;
  locale: Locale;
  index: number;
  isInView: boolean;
  copy: typeof COPY.en;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      className="group"
    >
      <Link
        href={`/${locale}/products/${feature.slug}`}
        className="block overflow-hidden rounded-[2rem] border border-[var(--espresso)]/8 bg-white shadow-[0_20px_60px_rgba(20,15,10,0.06)] transition-all duration-500 hover:border-[var(--espresso)]/15 hover:shadow-[0_30px_80px_rgba(20,15,10,0.1)]"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-[var(--parchment)]/50 to-white">
          {feature.heroImage ? (
            <Image
              src={feature.heroImage}
              alt={feature.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--espresso)]/20">
                {locale === "fr" ? "Image à venir" : "Image coming soon"}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-500 group-hover:bg-black/30">
            <motion.span
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.35em] text-[var(--onyx)] opacity-0 transition-all duration-300 group-hover:opacity-100"
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
            >
              {copy.discover}
              <ArrowUpRight className="h-4 w-4" />
            </motion.span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-xl text-[var(--espresso)]">
            {feature.name}
          </h3>
          <span className="mt-2 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--espresso)]/50 transition-all group-hover:text-[var(--espresso)]">
            {copy.discover}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

/**
 * Inline product mention for within article content
 */
export function JournalProductMention({
  locale,
  name,
  slug,
  image,
}: {
  locale: Locale;
  name: string;
  slug: string;
  image?: string;
}) {
  return (
    <Link
      href={`/${locale}/products/${slug}`}
      className="group my-8 flex items-center gap-4 rounded-xl border border-[var(--espresso)]/10 bg-white/80 p-4 transition-all hover:border-[var(--espresso)]/20 hover:shadow-[0_10px_30px_rgba(20,15,10,0.06)]"
    >
      {image && (
        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-[var(--parchment)]">
          <Image
            src={image}
            alt={name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <span className="text-[0.55rem] uppercase tracking-[0.3em] text-[var(--espresso)]/40">
          {locale === "fr" ? "Mentionné dans l'article" : "Mentioned in article"}
        </span>
        <h4 className="mt-1 text-sm font-medium text-[var(--espresso)]">{name}</h4>
      </div>
      <ArrowUpRight className="h-4 w-4 text-[var(--espresso)]/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--espresso)]" />
    </Link>
  );
}
