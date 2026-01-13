"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Check, RotateCcw } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type FilterKey = "colors" | "materials" | "sizes";
type FilterState = Record<FilterKey, Set<string>>;
type FilterOption = { label: string; value: string };

type ShopFilterDrawerProps = {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  options: Record<FilterKey, FilterOption[]>;
  toggleFilter: (section: FilterKey, value: string) => void;
  onClear: () => void;
  resultCount: number;
};

const COPY = {
  en: {
    title: "Refine Selection",
    subtitle: "Filter by your preferences",
    colors: "Colors",
    materials: "Materials",
    sizes: "Sizes",
    clearAll: "Clear all",
    show: "Show",
    pieces: "pieces",
    apply: "Apply filters",
    noFilters: "No filters available",
  },
  fr: {
    title: "Affiner la sélection",
    subtitle: "Filtrer selon vos préférences",
    colors: "Couleurs",
    materials: "Matières",
    sizes: "Tailles",
    clearAll: "Tout effacer",
    show: "Voir",
    pieces: "pièces",
    apply: "Appliquer les filtres",
    noFilters: "Aucun filtre disponible",
  },
  ar: {
    title: "تحسين الاختيار",
    subtitle: "تصفية حسب تفضيلاتك",
    colors: "الألوان",
    materials: "المواد",
    sizes: "المقاسات",
    clearAll: "مسح الكل",
    show: "عرض",
    pieces: "قطعة",
    apply: "تطبيق الفلاتر",
    noFilters: "لا توجد فلاتر متاحة",
  },
};

const SECTION_LABELS: Record<FilterKey, Record<"en" | "fr", string>> = {
  colors: { en: "Colors", fr: "Couleurs" },
  materials: { en: "Materials", fr: "Matières" },
  sizes: { en: "Sizes", fr: "Tailles" },
};

export function ShopFilterDrawer({
  locale,
  open,
  onClose,
  filters,
  options,
  toggleFilter,
  onClear,
  resultCount,
}: ShopFilterDrawerProps) {
  const copy = COPY[locale] || COPY.en;
  const [expandedSections, setExpandedSections] = useState<Set<FilterKey>>(
    new Set(["colors", "materials", "sizes"])
  );

  const activeFilterCount = useMemo(() => {
    return filters.colors.size + filters.materials.size + filters.sizes.size;
  }, [filters]);

  const toggleSection = (section: FilterKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-[100vw] sm:max-w-md overflow-hidden bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-[var(--espresso)]/10 px-4 py-5 sm:px-6 sm:py-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--espresso)]/5">
                      <SlidersHorizontal size={18} className="text-[var(--espresso)]" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-[var(--espresso)]">{copy.title}</h2>
                      <p className="mt-0.5 text-xs text-[var(--espresso)]/50">{copy.subtitle}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--espresso)]/15 text-[var(--espresso)]/60 transition-all hover:border-[var(--espresso)]/30 hover:text-[var(--espresso)] min-w-[44px] min-h-[44px]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Active Filters Count */}
              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-between rounded-xl bg-[var(--parchment)] px-4 py-3"
                >
                  <span className="text-xs text-[var(--espresso)]/60">
                    {activeFilterCount} {locale === "fr" ? "filtres actifs" : "active filters"}
                  </span>
                  <button
                    onClick={onClear}
                    className="flex items-center gap-1.5 text-xs text-[var(--espresso)]/70 transition-colors hover:text-[var(--espresso)]"
                  >
                    <RotateCcw size={12} />
                    {copy.clearAll}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Filter Sections */}
            <div className="h-[calc(100%-200px)] overflow-y-auto px-4 py-4 sm:px-6">
              {(Object.keys(options) as FilterKey[]).map((section) => {
                const sectionOptions = options[section];
                const isExpanded = expandedSections.has(section);
                const activeCount = filters[section].size;

                if (sectionOptions.length === 0) return null;

                return (
                  <div key={section} className="border-b border-[var(--espresso)]/10 py-5">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section)}
                      className="flex w-full items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-[0.4em] text-[var(--espresso)]">
                          {SECTION_LABELS[section][locale]}
                        </span>
                        {activeCount > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--espresso)] text-[0.55rem] text-white">
                            {activeCount}
                          </span>
                        )}
                      </div>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[var(--espresso)]/40"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </motion.span>
                    </button>

                    {/* Section Options */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 flex flex-wrap gap-2">
                            {sectionOptions.map((option) => {
                              const isActive = filters[section].has(option.value);
                              return (
                                <motion.button
                                  key={option.value}
                                  onClick={() => toggleFilter(section, option.value)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={cn(
                                    "relative flex items-center gap-2 rounded-full px-4 py-3 text-[0.65rem] uppercase tracking-[0.3em] transition-all min-h-[44px]",
                                    isActive
                                      ? "bg-[var(--espresso)] text-white"
                                      : "border border-[var(--espresso)]/15 text-[var(--espresso)]/70 hover:border-[var(--espresso)]/30 hover:text-[var(--espresso)]"
                                  )}
                                >
                                  {/* Color Swatch for colors section */}
                                  {section === "colors" && (
                                    <span
                                      className="h-3 w-3 rounded-full border border-current/20"
                                      style={{ backgroundColor: getColorHex(option.label) }}
                                    />
                                  )}
                                  <span>{option.label}</span>
                                  {isActive && (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="ml-1"
                                    >
                                      <Check size={10} />
                                    </motion.span>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--espresso)]/10 bg-white px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={onClear}
                  className="rounded-full border border-[var(--espresso)]/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--espresso)]/70 transition-all hover:border-[var(--espresso)]/40 hover:text-[var(--espresso)] min-h-[44px]"
                >
                  {copy.clearAll}
                </button>
                <button
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--espresso)] px-6 py-3.5 text-[0.65rem] uppercase tracking-[0.35em] text-white transition-all hover:bg-[var(--onyx)] min-h-[44px]"
                >
                  {copy.show} {resultCount} {copy.pieces}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper to map color names to hex values
function getColorHex(colorName: string): string {
  const colors: Record<string, string> = {
    black: "#1a1a1a", noir: "#1a1a1a",
    white: "#fafafa", blanc: "#fafafa",
    cream: "#f5f0e8", crème: "#f5f0e8",
    ivory: "#fffff0", ivoire: "#fffff0",
    beige: "#d9c8b4", taupe: "#8b7355",
    charcoal: "#36454f",
    gray: "#808080", grey: "#808080", gris: "#808080",
    brown: "#8b4513", marron: "#8b4513",
    chocolate: "#3d1c0a", chocolat: "#3d1c0a",
    caramel: "#c68e17", cognac: "#9a463d", tan: "#d2b48c",
    navy: "#1a2744", marine: "#1a2744",
    blue: "#3b5998", bleu: "#3b5998",
    red: "#8b0000", rouge: "#8b0000",
    burgundy: "#722f37", bordeaux: "#722f37",
    rose: "#d4a5a5", pink: "#d4a5a5", blush: "#de9b9b",
    green: "#355e3b", vert: "#355e3b",
    olive: "#556b2f", sage: "#9dc183",
    gold: "#d4a574", or: "#d4a574",
    silver: "#c0c0c0", argent: "#c0c0c0",
    bronze: "#cd7f32",
  };
  return colors[colorName.toLowerCase().trim()] || "#d9d0c5";
}
