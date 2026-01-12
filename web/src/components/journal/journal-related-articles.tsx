"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { JournalCard } from "@/lib/data/journal";
import { ArrowUpRight } from "lucide-react";

type JournalRelatedArticlesProps = {
  locale: Locale;
  articles: JournalCard[];
  title?: string;
};

const COPY = {
  en: {
    section: "Continue Reading",
    subtitle: "Related stories you might enjoy",
    viewAll: "View all stories",
    readMore: "Read",
  },
  fr: {
    section: "Continuer la lecture",
    subtitle: "Histoires similaires qui pourraient vous plaire",
    viewAll: "Voir toutes les histoires",
    readMore: "Lire",
  },
  ar: {
    section: "متابعة القراءة",
    subtitle: "مقالات ذات صلة قد تستمتع بها",
    viewAll: "عرض جميع القصص",
    readMore: "اقرأ",
  },
};

export function JournalRelatedArticles({ locale, articles, title }: JournalRelatedArticlesProps) {
  const copy = COPY[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  if (articles.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="border-t border-[var(--espresso)]/10 bg-[var(--parchment)] px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-screen-xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            <span className="text-xs uppercase tracking-[0.5em] text-[var(--espresso)]/40">
              {title || copy.section}
            </span>
            <h2 className="mt-3 font-display text-3xl text-[var(--espresso)] md:text-4xl">
              {copy.subtitle}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Link
              href={`/${locale}/journal`}
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-[var(--espresso)]/50 transition-colors hover:text-[var(--espresso)]"
            >
              {copy.viewAll}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <RelatedArticleCard
              key={article.id}
              article={article}
              locale={locale}
              index={index}
              isInView={isInView}
              copy={copy}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedArticleCard({
  article,
  locale,
  index,
  isInView,
  copy,
}: {
  article: JournalCard;
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
        href={`/${locale}/journal/${article.slug}`}
        className="flex flex-col overflow-hidden rounded-[1.8rem] border border-[var(--espresso)]/8 bg-white shadow-[0_20px_60px_rgba(20,15,10,0.06)] transition-all duration-500 hover:border-[var(--espresso)]/15 hover:shadow-[0_30px_80px_rgba(20,15,10,0.1)]"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {article.heroImage ? (
            <Image
              src={article.heroImage}
              alt={article.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--espresso)]/10 to-[var(--espresso)]/5" />
          )}
          
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
          
          {/* Category */}
          <span className="absolute left-4 top-4 rounded-full border border-[var(--espresso)]/10 bg-white/90 px-3 py-1 text-[0.55rem] uppercase tracking-[0.35em] text-[var(--espresso)]/70 backdrop-blur-sm">
            {article.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <span className="text-[0.55rem] uppercase tracking-[0.35em] text-[var(--espresso)]/40">
            {formatDate(article.publishedAt, locale)}
          </span>
          
          <h3 className="mt-2 font-display text-lg leading-snug text-[var(--espresso)] transition-colors group-hover:text-[var(--espresso)]/80">
            {article.title}
          </h3>
          
          {article.standfirst && (
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--espresso)]/60">
              {article.standfirst}
            </p>
          )}
          
          <span className="mt-4 inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.35em] text-[var(--espresso)]/50 transition-all group-hover:gap-3 group-hover:text-[var(--espresso)]">
            {copy.readMore}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

/**
 * Compact related articles for sidebar
 */
export function JournalRelatedSidebar({
  locale,
  articles,
}: {
  locale: Locale;
  articles: JournalCard[];
}) {
  const copy = COPY[locale];

  if (articles.length === 0) return null;

  return (
    <div className="rounded-[2rem] border border-[var(--espresso)]/8 bg-white/80 p-6 shadow-[0_20px_60px_rgba(20,15,10,0.06)] backdrop-blur">
      <span className="text-xs uppercase tracking-[0.5em] text-[var(--espresso)]/40">
        {copy.section}
      </span>
      
      <div className="mt-6 divide-y divide-[var(--espresso)]/8">
        {articles.slice(0, 4).map((article) => (
          <Link
            key={article.id}
            href={`/${locale}/journal/${article.slug}`}
            className="group block py-4 first:pt-0 last:pb-0"
          >
            <span className="text-[0.5rem] uppercase tracking-[0.3em] text-[var(--espresso)]/40">
              {article.category}
            </span>
            <h4 className="mt-1 text-sm font-medium leading-snug text-[var(--espresso)] transition-colors group-hover:text-[var(--espresso)]/70">
              {article.title}
            </h4>
          </Link>
        ))}
      </div>

      <Link
        href={`/${locale}/journal`}
        className="mt-6 inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.35em] text-[var(--espresso)]/50 transition-colors hover:text-[var(--espresso)]"
      >
        {copy.viewAll}
        <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function formatDate(date: Date | string | null | undefined, locale: Locale): string {
  if (!date) return "";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}
