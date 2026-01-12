"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ShopCategoryGroup, ShopCategory } from "@/lib/data/shop";
import { cn } from "@/lib/utils";

type ShopCategoryShowcaseProps = {
  locale: Locale;
  groups: ShopCategoryGroup[];
  activeGroup: string;
  onGroupChange: (slug: string) => void;
  onCategorySelect: (slug: string) => void;
};

const COPY = {
  en: {
    chapter: "Chapter",
    explore: "Explore",
    viewCollection: "View collection",
    categories: "Categories",
    universes: "Our Universes",
    subtitle: "Discover collections curated by our master artisans",
  },
  fr: {
    chapter: "Chapitre",
    explore: "Explorer",
    viewCollection: "Voir la collection",
    categories: "Catégories",
    universes: "Nos Univers",
    subtitle: "Découvrez des collections créées par nos maîtres artisans",
  },
  ar: {
    chapter: "فصل",
    explore: "استكشف",
    viewCollection: "عرض المجموعة",
    categories: "الفئات",
    universes: "عوالمنا",
    subtitle: "اكتشف مجموعات منتقاة من قبل أساتذة الحرف لدينا",
  },
};

export function ShopCategoryShowcase({
  locale,
  groups,
  activeGroup,
  onGroupChange,
  onCategorySelect,
}: ShopCategoryShowcaseProps) {
  const copy = COPY[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  if (groups.length === 0) return null;

  const activeGroupData = groups.find((g) => g.slug === activeGroup) ?? groups[0];

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-20 md:px-12 md:py-28">
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(209,169,130,0.08),transparent_50%)]" />
      
      <div className="relative mx-auto max-w-screen-2xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="text-xs uppercase tracking-[0.6em] text-[var(--espresso)]/40">
            {copy.universes}
          </span>
          <h2 className="mt-4 font-display text-4xl text-[var(--espresso)] md:text-5xl">
            {copy.subtitle}
          </h2>
        </motion.div>

        {/* Group Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {groups.map((group, index) => {
            const isActive = group.slug === activeGroup;
            const isHovered = hoveredGroup === group.slug;
            
            return (
              <motion.article
                key={group.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                onMouseEnter={() => setHoveredGroup(group.slug)}
                onMouseLeave={() => setHoveredGroup(null)}
                className={cn(
                  "group relative overflow-hidden rounded-[2.5rem] border bg-white shadow-lg transition-all duration-500",
                  isActive 
                    ? "border-[var(--espresso)]/30 ring-2 ring-[var(--espresso)]/20 shadow-2xl" 
                    : "border-[var(--espresso)]/10 hover:border-[var(--espresso)]/20 hover:shadow-xl"
                )}
              >
                {/* Hero Image - use first category heroImage as fallback */}
                {(() => {
                  const heroImage = group.categories[0]?.heroImage ?? group.categories[0]?.secondaryImage;
                  if (!heroImage) return null;
                  return (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={heroImage}
                        alt={group.title}
                        fill
                        sizes="(min-width:768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Overlay Content */}
                      <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                        <span className="text-[0.6rem] uppercase tracking-[0.5em] text-white/60">
                          {copy.chapter}
                        </span>
                        <h3 className="mt-2 font-display text-3xl md:text-4xl">{group.title}</h3>
                      </div>

                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeGroupIndicator"
                          className="absolute right-6 top-6 flex h-8 items-center gap-2 rounded-full bg-white px-4 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--espresso)]"
                        >
                          <span className="h-2 w-2 rounded-full bg-[var(--gilded-rose)]" />
                          {locale === "fr" ? "Actif" : "Active"}
                        </motion.div>
                      )}
                    </div>
                  );
                })()}

                {/* Content */}
                <div className="p-6 md:p-8">
                  {group.description && (
                    <p className="text-sm leading-relaxed text-[var(--espresso)]/60">
                      {group.description}
                    </p>
                  )}

                  {/* Category Pills */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.categories.slice(0, 4).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => onCategorySelect(category.slug)}
                        className="rounded-full border border-[var(--espresso)]/15 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.3em] text-[var(--espresso)]/60 transition-all hover:border-[var(--espresso)]/30 hover:text-[var(--espresso)]"
                      >
                        {category.title}
                      </button>
                    ))}
                    {group.categories.length > 4 && (
                      <span className="flex items-center px-2 text-[0.55rem] text-[var(--espresso)]/40">
                        +{group.categories.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onGroupChange(group.slug)}
                    className={cn(
                      "mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs uppercase tracking-[0.4em] transition-all",
                      isActive
                        ? "bg-[var(--espresso)] text-white"
                        : "border border-[var(--espresso)]/20 text-[var(--espresso)]/70 hover:border-[var(--espresso)]/40 hover:text-[var(--espresso)]"
                    )}
                  >
                    {copy.explore}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Category Grid for Active Group */}
        {activeGroupData && activeGroupData.categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.5em] text-[var(--espresso)]/40">
                  {activeGroupData.title}
                </span>
                <h3 className="mt-2 font-display text-2xl text-[var(--espresso)]">
                  {copy.categories}
                </h3>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeGroupData.categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  locale={locale}
                  category={category}
                  index={index}
                  onSelect={() => onCategorySelect(category.slug)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function CategoryCard({
  locale,
  category,
  index,
  onSelect,
}: {
  locale: Locale;
  category: ShopCategory;
  index: number;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      className="group relative w-full overflow-hidden rounded-[1.5rem] border border-[var(--espresso)]/10 bg-white text-left shadow-md transition-all duration-500 hover:border-[var(--espresso)]/20 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {category.heroImage ? (
          <>
            <Image
              src={category.heroImage}
              alt={category.title}
              fill
              sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {category.secondaryImage && (
              <Image
                src={category.secondaryImage}
                alt={category.title}
                fill
                sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--parchment)]">
            <span className="font-display text-3xl text-[var(--espresso)]/20">
              {category.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[0.55rem] uppercase tracking-[0.4em] text-white/60">
            {locale === "fr" ? "Chapitre" : "Chapter"}
          </p>
          <h4 className="mt-1 font-display text-xl text-white">{category.title}</h4>
        </div>

        {/* Hover Arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm"
        >
          <ArrowUpRight size={16} />
        </motion.div>
      </div>
    </motion.button>
  );
}
