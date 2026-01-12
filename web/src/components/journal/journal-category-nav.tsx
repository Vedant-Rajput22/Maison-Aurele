"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

type JournalCategoryNavProps = {
  locale: Locale;
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
};

const COPY = {
  en: {
    all: "All Stories",
    filter: "Filter by",
  },
  fr: {
    all: "Toutes les histoires",
    filter: "Filtrer par",
  },
  ar: {
    all: "جميع القصص",
    filter: "تصفية حسب",
  },
};

export function JournalCategoryNav({
  locale,
  categories,
  activeCategory,
  onCategoryChange,
}: JournalCategoryNavProps) {
  const copy = COPY[locale];
  const navRef = useRef<HTMLDivElement>(null);

  const allCategories = [
    { key: null, label: copy.all },
    ...categories.map((cat) => ({ key: cat, label: cat })),
  ];

  return (
    <nav
      ref={navRef}
      className="relative border-b border-[var(--espresso)]/10 bg-[var(--parchment)]"
    >
      <div className="mx-auto max-w-screen-2xl px-6 py-6 md:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter Label */}
          <span className="text-xs uppercase tracking-[0.4em] text-[var(--espresso)]/40">
            {copy.filter}
          </span>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3">
            {allCategories.map(({ key, label }) => (
              <motion.button
                key={key ?? "all"}
                onClick={() => onCategoryChange(key)}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.35em] transition-all duration-300",
                  activeCategory === key
                    ? "text-white"
                    : "text-[var(--espresso)]/60 hover:text-[var(--espresso)]"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active Background */}
                {activeCategory === key && (
                  <motion.span
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 rounded-full bg-[var(--onyx)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                {/* Inactive Border */}
                {activeCategory !== key && (
                  <span className="absolute inset-0 rounded-full border border-[var(--espresso)]/15" />
                )}
                
                <span className="relative z-10">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 h-px w-full">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-[var(--gilded-rose)]/50 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </nav>
  );
}

/**
 * Compact category tabs for article pages
 */
export function JournalCategoryTabs({
  locale,
  categories,
  activeCategory,
}: {
  locale: Locale;
  categories: string[];
  activeCategory?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((category) => (
        <span
          key={category}
          className={cn(
            "rounded-full px-3 py-1 text-[0.55rem] uppercase tracking-[0.3em] transition-colors",
            category === activeCategory
              ? "bg-[var(--onyx)] text-white"
              : "border border-[var(--espresso)]/10 text-[var(--espresso)]/50"
          )}
        >
          {category}
        </span>
      ))}
    </div>
  );
}
