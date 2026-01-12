"use client";

import { useRef, forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Grid3X3, LayoutGrid, Rows3 } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ProductListCard } from "@/lib/data/products";
import type { CartSnapshot } from "@/lib/cart/actions";
import { ShopProductCard } from "./shop-product-card";
import { cn } from "@/lib/utils";

type ShopProductGridProps = {
  locale: Locale;
  products: ProductListCard[];
  title: string;
  subtitle?: string;
  count: number;
  onCartChange?: (snapshot: CartSnapshot) => void;
  wishlist: { itemIds: string[] };
  onWishlistToggle: (productId: string) => void;
  wishlistPendingId?: string | null;
  wishlistPending?: boolean;
};

type ViewMode = "grid" | "large" | "list";

const COPY = {
  en: {
    pieces: "pieces",
    viewAll: "View all",
    noProducts: "No pieces match your criteria",
    adjustFilters: "Try adjusting your filters to discover more pieces",
    empty: "Our collection is being curated",
    comingSoon: "New pieces arriving soon",
  },
  fr: {
    pieces: "pièces",
    viewAll: "Voir tout",
    noProducts: "Aucune pièce ne correspond à vos critères",
    adjustFilters: "Essayez d'ajuster vos filtres pour découvrir plus de pièces",
    empty: "Notre collection est en cours de création",
    comingSoon: "Nouvelles pièces bientôt",
  },
  ar: {
    pieces: "قطعة",
    viewAll: "عرض الكل",
    noProducts: "لا توجد قطع تطابق معاييرك",
    adjustFilters: "حاول تعديل الفلاتر لاكتشاف المزيد من القطع",
    empty: "مجموعتنا قيد الإعداد",
    comingSoon: "قطع جديدة قريباً",
  },
};

export const ShopProductGrid = forwardRef<HTMLDivElement, ShopProductGridProps>(
  function ShopProductGrid(
    {
      locale,
      products,
      title,
      subtitle,
      count,
      onCartChange,
      wishlist,
      onWishlistToggle,
      wishlistPendingId,
      wishlistPending,
    },
    ref
  ) {
    const copy = COPY[locale];
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    // Empty state
    if (products.length === 0) {
      return (
        <section ref={sectionRef} className="px-6 py-24 md:px-12">
          <div className="mx-auto max-w-screen-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-[var(--espresso)]/20 bg-[var(--parchment)]/50 px-8 py-24 text-center"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--espresso)]/5">
                <Grid3X3 size={32} className="text-[var(--espresso)]/40" />
              </div>
              <h3 className="font-display text-2xl text-[var(--espresso)]">{copy.noProducts}</h3>
              <p className="mt-3 max-w-md text-sm text-[var(--espresso)]/60">{copy.adjustFilters}</p>
            </motion.div>
          </div>
        </section>
      );
    }

    return (
      <section ref={sectionRef} className="px-6 py-12 md:px-12 md:py-16">
        <div ref={ref} className="mx-auto max-w-screen-2xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xs uppercase tracking-[0.5em] text-[var(--espresso)]/40"
              >
                {count} {copy.pieces}
              </motion.span>
              <h2 className="mt-2 font-display text-3xl text-[var(--espresso)] md:text-4xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 text-sm text-[var(--espresso)]/60">{subtitle}</p>
              )}
            </div>

            <Link
              href={`/${locale}/collections`}
              className="group flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-[var(--espresso)]/60 transition-colors hover:text-[var(--espresso)]"
            >
              {locale === "fr" ? "Explorer les collections" : "Explore collections"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Product Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
              <ShopProductCard
                key={product.id}
                locale={locale}
                product={product}
                index={index}
                onCartChange={onCartChange}
                inWishlist={wishlist.itemIds.includes(product.id)}
                onWishlistToggle={() => onWishlistToggle(product.id)}
                wishlistPending={wishlistPendingId === product.id && (wishlistPending ?? false)}
                variant={index === 0 ? "featured" : "default"}
              />
            ))}
          </div>

          {/* Load More Indicator */}
          {products.length >= 12 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 flex justify-center"
            >
              <button className="group flex items-center gap-3 rounded-full border border-[var(--espresso)]/20 bg-white px-8 py-4 text-xs uppercase tracking-[0.4em] text-[var(--espresso)]/70 shadow-lg transition-all hover:border-[var(--espresso)]/40 hover:text-[var(--espresso)] hover:shadow-xl">
                {locale === "fr" ? "Charger plus" : "Load more"}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}
        </div>
      </section>
    );
  }
);
