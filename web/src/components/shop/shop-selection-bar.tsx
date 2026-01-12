"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type SortOption = {
  id: string;
  label: string;
};

type ShopSelectionBarProps = {
  locale: Locale;
  title: string;
  count: number;
  sort: string;
  onSortChange: (sort: string) => void;
  sortOptions: SortOption[];
  onFiltersOpen: () => void;
  activeFiltersCount: number;
  activeCategory: string | null;
  onClearCategory: () => void;
};

const COPY = {
  en: {
    selection: "Selection",
    piecesAvailable: "pieces available",
    sort: "Sort",
    filters: "Filters",
    active: "active",
    clearCategory: "View all",
  },
  fr: {
    selection: "Sélection",
    piecesAvailable: "pièces disponibles",
    sort: "Trier",
    filters: "Filtres",
    active: "actifs",
    clearCategory: "Tout voir",
  },
  ar: {
    selection: "الاختيار",
    piecesAvailable: "قطعة متوفرة",
    sort: "ترتيب",
    filters: "فلاتر",
    active: "نشط",
    clearCategory: "عرض الكل",
  },
};

export function ShopSelectionBar({
  locale,
  title,
  count,
  sort,
  onSortChange,
  sortOptions,
  onFiltersOpen,
  activeFiltersCount,
  activeCategory,
  onClearCategory,
}: ShopSelectionBarProps) {
  const copy = COPY[locale];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="sticky top-20 z-30 mx-6 md:mx-12"
    >
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--espresso)]/10 bg-white/95 p-5 shadow-lg backdrop-blur-md md:flex-row md:items-center md:justify-between md:rounded-full md:px-8 md:py-4">
          {/* Left: Title & Count */}
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--espresso)]/5">
              <Sparkles size={16} className="text-[var(--espresso)]" />
            </div>
            <div>
              <h3 className="font-display text-xl text-[var(--espresso)] md:text-2xl">
                {title}
              </h3>
              <p className="mt-0.5 text-xs text-[var(--espresso)]/50">
                {count} {copy.piecesAvailable}
              </p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Active Category Chip */}
            {activeCategory && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={onClearCategory}
                className="flex items-center gap-2 rounded-full border border-[var(--gilded-rose)]/30 bg-[var(--gilded-rose)]/10 px-4 py-2 text-xs text-[var(--espresso)] transition-all hover:bg-[var(--gilded-rose)]/20"
              >
                <span className="text-[0.65rem] uppercase tracking-[0.3em]">{activeCategory}</span>
                <X size={12} />
              </motion.button>
            )}

            {/* Sort Dropdown */}
            <div className="relative">
              <label className="flex items-center gap-2 rounded-full border border-[var(--espresso)]/15 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--espresso)]/70 transition-all hover:border-[var(--espresso)]/30">
                <span className="text-[var(--espresso)]/40">{copy.sort}:</span>
                <select
                  value={sort}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="appearance-none bg-transparent pr-4 text-[var(--espresso)] outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="pointer-events-none -ml-3 text-[var(--espresso)]/40" />
              </label>
            </div>

            {/* Filters Button */}
            <button
              onClick={onFiltersOpen}
              className={cn(
                "relative flex items-center gap-2 rounded-full border px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.3em] transition-all",
                activeFiltersCount > 0
                  ? "border-[var(--espresso)]/30 bg-[var(--espresso)] text-white"
                  : "border-[var(--espresso)]/15 text-[var(--espresso)]/70 hover:border-[var(--espresso)]/30 hover:text-[var(--espresso)]"
              )}
            >
              <SlidersHorizontal size={14} />
              <span>{copy.filters}</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[0.55rem] text-[var(--espresso)]">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Clear Category Button */}
            {activeCategory && (
              <button
                onClick={onClearCategory}
                className="rounded-full border border-[var(--espresso)]/10 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--espresso)]/50 transition-all hover:border-[var(--espresso)]/20 hover:text-[var(--espresso)]"
              >
                {copy.clearCategory}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
