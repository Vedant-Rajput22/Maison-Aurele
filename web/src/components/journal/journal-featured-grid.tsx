"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { gsap, MOTION_DEFAULTS, prefersReducedMotion, cleanupScrollTriggers } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { JournalCard } from "@/lib/data/journal";
import { ArrowUpRight, Clock } from "lucide-react";

type JournalFeaturedGridProps = {
  locale: Locale;
  entries: JournalCard[];
};

const COPY = {
  en: {
    section: "Featured Stories",
    subtitle: "Curated editorials exploring the world of Maison Aurèle",
    readMore: "Read",
    readTime: "min",
  },
  fr: {
    section: "Histoires à la une",
    subtitle: "Éditoriaux choisis explorant l'univers de la Maison Aurèle",
    readMore: "Lire",
    readTime: "min",
  },
  ar: {
    section: "قصص مميزة",
    subtitle: "مقالات تحريرية منتقاة تستكشف عالم ميزون أوريل",
    readMore: "اقرأ",
    readTime: "دقيقة",
  },
};

export function JournalFeaturedGrid({ locale, entries }: JournalFeaturedGridProps) {
  const copy = COPY[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  if (entries.length === 0) return null;

  // Grid layout: first card spans 2 rows, others fill around
  const primaryEntry = entries[0];
  const secondaryEntries = entries.slice(1, 5);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--parchment)] px-6 py-24 md:px-12 md:py-32"
    >
      {/* Section Header */}
      <div className="mx-auto max-w-screen-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.5em] text-[var(--espresso)]/40">
              {copy.section}
            </span>
            <h2 className="mt-3 font-display text-4xl text-[var(--espresso)] md:text-5xl">
              {copy.subtitle}
            </h2>
          </div>
          <Link
            href={`/${locale}/journal`}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-[var(--espresso)]/60 transition-colors hover:text-[var(--espresso)]"
          >
            <span>{locale === "fr" ? "Voir tout" : "View all"}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {/* Primary Card - Spans 2 rows on large screens */}
          {primaryEntry && (
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="group lg:row-span-2"
            >
              <Link
                href={`/${locale}/journal/${primaryEntry.slug}`}
                className="relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[2rem] border border-[var(--espresso)]/5 bg-[var(--onyx)] shadow-[0_30px_100px_rgba(20,15,10,0.15)] transition-shadow duration-500 hover:shadow-[0_40px_120px_rgba(20,15,10,0.25)] lg:min-h-full"
              >
                {/* Image */}
                <div className="relative h-2/3 overflow-hidden lg:h-3/5">
                  {primaryEntry.heroImage && (
                    <Image
                      src={primaryEntry.heroImage}
                      alt={primaryEntry.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)] via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute left-6 top-6 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.4em] text-white backdrop-blur-sm">
                    {primaryEntry.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-end p-6 lg:p-8">
                  <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.4em] text-white/50">
                    {primaryEntry.publishedAt && (
                      <span>{formatDate(primaryEntry.publishedAt, locale)}</span>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      ~6 {copy.readTime}
                    </span>
                  </div>
                  
                  <h3 className="mt-4 font-display text-2xl leading-tight text-white lg:text-3xl">
                    {primaryEntry.title}
                  </h3>
                  
                  {primaryEntry.standfirst && (
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">
                      {primaryEntry.standfirst}
                    </p>
                  )}
                  
                  <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-[var(--gilded-rose)] transition-all group-hover:gap-3">
                    {copy.readMore}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.article>
          )}

          {/* Secondary Cards */}
          {secondaryEntries.map((entry, index) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              className="group"
            >
              <Link
                href={`/${locale}/journal/${entry.slug}`}
                className="relative flex h-full min-h-[18rem] flex-col overflow-hidden rounded-[1.5rem] border border-[var(--espresso)]/8 bg-white shadow-[0_20px_60px_rgba(20,15,10,0.08)] transition-all duration-500 hover:border-[var(--espresso)]/15 hover:shadow-[0_30px_80px_rgba(20,15,10,0.12)]"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  {entry.heroImage && (
                    <Image
                      src={entry.heroImage}
                      alt={entry.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute left-4 top-4 rounded-full border border-[var(--espresso)]/10 bg-white/90 px-3 py-1 text-[0.55rem] uppercase tracking-[0.35em] text-[var(--espresso)]/70 backdrop-blur-sm">
                    {entry.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.35em] text-[var(--espresso)]/40">
                      {entry.publishedAt && (
                        <span>{formatDate(entry.publishedAt, locale)}</span>
                      )}
                    </div>
                    
                    <h3 className="mt-2 font-display text-lg leading-snug text-[var(--espresso)]">
                      {entry.title}
                    </h3>
                  </div>
                  
                  <span className="mt-4 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--espresso)]/50 transition-all group-hover:text-[var(--espresso)]">
                    {copy.readMore}
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(date: Date | string | null, locale: Locale): string {
  if (!date) return "";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
  }).format(value);
}
