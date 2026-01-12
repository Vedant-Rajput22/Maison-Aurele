"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";
import type { JournalCard } from "@/lib/data/journal";
import {
  JournalHero,
  JournalFeaturedGrid,
  JournalEditorialCarousel,
  JournalCategoryNav,
  JournalArticleCard,
  JournalNewsletter,
  JournalCampaignVideo,
} from "@/components/journal";
import { ArrowRight } from "lucide-react";

type JournalIndexClientProps = {
  locale: Locale;
  entries: JournalCard[];
  categories: string[];
};

const COPY = {
  en: {
    empty: {
      kicker: "Journal",
      title: "Coming soon",
      body: "No journal entries are available yet. Please check back soon.",
      cta: "Back to home",
    },
    allStories: {
      kicker: "All Stories",
      title: "The Complete Archive",
      subtitle: "Every chapter, essay, and correspondence from our editorial world",
    },
  },
  fr: {
    empty: {
      kicker: "Journal",
      title: "Bientôt",
      body: "Aucun article n'est disponible pour le moment. Revenez très vite.",
      cta: "Retour à l'accueil",
    },
    allStories: {
      kicker: "Toutes les histoires",
      title: "Les Archives complètes",
      subtitle: "Chaque chapitre, essai et correspondance de notre monde éditorial",
    },
  },
  ar: {
    empty: {
      kicker: "المجلة",
      title: "قريباً",
      body: "لا توجد مقالات متاحة حالياً. يرجى العودة قريباً.",
      cta: "العودة للرئيسية",
    },
    allStories: {
      kicker: "جميع القصص",
      title: "الأرشيف الكامل",
      subtitle: "كل فصل ومقال ومراسلة من عالمنا التحريري",
    },
  },
};

export function JournalIndexClient({ locale, entries, categories }: JournalIndexClientProps) {
  const copy = COPY[locale];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filtered entries based on category
  const filteredEntries = useMemo(() => {
    if (!activeCategory) return entries;
    return entries.filter((entry) => entry.category === activeCategory);
  }, [entries, activeCategory]);

  // Split entries for different sections
  const heroEntry = entries.length > 0 ? entries[0] : null;
  const supportingEntries = entries.slice(1, 3);
  const featuredGridEntries = entries.slice(0, 5);
  const carouselEntries = entries.slice(2, 8);
  const archiveEntries = filteredEntries.slice(activeCategory ? 0 : 5);

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center md:px-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.5em] text-[var(--espresso)]/40"
        >
          {copy.empty.kicker}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-4xl text-[var(--espresso)] md:text-5xl"
        >
          {copy.empty.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 max-w-md text-base text-[var(--espresso)]/60"
        >
          {copy.empty.body}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href={`/${locale}`}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--espresso)]/20 px-6 py-3 text-xs uppercase tracking-[0.4em] text-[var(--espresso)] transition-all hover:border-[var(--espresso)]/40 hover:bg-[var(--espresso)]/5"
          >
            {copy.empty.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Cinematic Hero Section */}
      <JournalHero
        locale={locale}
        featuredEntry={heroEntry}
        supportingEntries={supportingEntries}
      />

      {/* Featured Grid - Bento style layout */}
      {featuredGridEntries.length > 0 && (
        <JournalFeaturedGrid locale={locale} entries={featuredGridEntries} />
      )}

      {/* Editorial Carousel - Horizontal scroll */}
      {carouselEntries.length > 2 && (
        <JournalEditorialCarousel locale={locale} entries={carouselEntries} />
      )}

      {/* Campaign Video Section */}
      <JournalCampaignVideo 
        locale={locale} 
        linkTo={`/${locale}/collections/nuit-07-ss`}
      />

      {/* Category Navigation */}
      {categories.length > 0 && (
        <JournalCategoryNav
          locale={locale}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* All Stories Archive */}
      {archiveEntries.length > 0 && (
        <section className="bg-[var(--parchment)] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-screen-2xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <span className="text-xs uppercase tracking-[0.5em] text-[var(--espresso)]/40">
                {copy.allStories.kicker}
              </span>
              <h2 className="mt-3 font-display text-4xl text-[var(--espresso)] md:text-5xl">
                {activeCategory || copy.allStories.title}
              </h2>
              {!activeCategory && (
                <p className="mt-3 max-w-xl text-base text-[var(--espresso)]/60">
                  {copy.allStories.subtitle}
                </p>
              )}
            </motion.div>

            {/* Stories Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory || "all"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {archiveEntries.map((entry, index) => (
                  <JournalArticleCard
                    key={entry.id}
                    locale={locale}
                    entry={entry}
                    index={index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More - Future enhancement */}
            {archiveEntries.length > 9 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <button className="inline-flex items-center gap-3 rounded-full border border-[var(--espresso)]/20 px-8 py-4 text-xs uppercase tracking-[0.4em] text-[var(--espresso)] transition-all hover:border-[var(--espresso)]/40 hover:bg-[var(--espresso)]/5">
                  {locale === "fr" ? "Charger plus" : "Load more"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <JournalNewsletter locale={locale} variant="dark" />
    </div>
  );
}
