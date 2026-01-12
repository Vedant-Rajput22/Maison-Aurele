"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { ProductListCard } from "@/lib/data/products";
import type { ShopCategory, ShopCategoryGroup } from "@/lib/data/shop";
import { ShopNavbar } from "@/components/shop/shop-navbar";
import { ShopHero } from "@/components/shop/shop-hero";
import { ShopCategoryShowcase } from "@/components/shop/shop-category-showcase";
import { ShopSelectionBar } from "@/components/shop/shop-selection-bar";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";
import { ShopFilterDrawer } from "@/components/shop/shop-filter-drawer";
import { useCommerce } from "@/components/commerce/commerce-provider";

type Props = {
  locale: Locale;
  products: ProductListCard[];
  groups: ShopCategoryGroup[];
  quickCategories: ShopCategory[];
  isAuthenticated: boolean;
};

type FilterKey = "colors" | "materials" | "sizes";
type FilterState = Record<FilterKey, Set<string>>;
type FilterOption = { label: string; value: string };

const SORT_OPTIONS = {
  fr: [
    { id: "recommended", label: "Recommandé" },
    { id: "newest", label: "Nouveautés" },
    { id: "price-asc", label: "Prix croissant" },
    { id: "price-desc", label: "Prix décroissant" },
  ],
  en: [
    { id: "recommended", label: "Recommended" },
    { id: "newest", label: "Newest first" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
  ],
  ar: [
    { id: "recommended", label: "موصى به" },
    { id: "newest", label: "الأحدث أولاً" },
    { id: "price-asc", label: "السعر: من الأقل للأعلى" },
    { id: "price-desc", label: "السعر: من الأعلى للأقل" },
  ],
} as const;

export function ShopExperience({ locale, products, groups, quickCategories, isAuthenticated }: Props) {
  const [activeGroupSelection, setActiveGroupSelection] = useState<string>(groups[0]?.slug ?? "");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("recommended");
  const [filters, setFilters] = useState<FilterState>({
    colors: new Set(),
    materials: new Set(),
    sizes: new Set(),
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { setCart, wishlist, toggleWishlist, wishlistPending, wishlistPendingId } = useCommerce();
  const gridRef = useRef<HTMLDivElement>(null);

  const activeGroup = useMemo(() => {
    if (groups.length === 0) return "";
    if (activeGroupSelection && groups.some((group) => group.slug === activeGroupSelection)) {
      return activeGroupSelection;
    }
    return groups[0]?.slug ?? "";
  }, [activeGroupSelection, groups]);

  const handleGroupChange = useCallback((groupSlug: string) => {
    if (!groups.some((group) => group.slug === groupSlug)) return;
    setActiveGroupSelection(groupSlug);
    setActiveCategory(null);
  }, [groups]);

  const scrollToGrid = useCallback(() => {
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleCategorySelect = useCallback((slug: string) => {
    const parent = groups.find((group) => group.categories.some((category) => category.slug === slug));
    if (parent) {
      setActiveGroupSelection(parent.slug);
    }
    setActiveCategory(slug);
    scrollToGrid();
  }, [groups, scrollToGrid]);

  const handleQuickCategory = useCallback((slug: string) => handleCategorySelect(slug), [handleCategorySelect]);

  const filterOptions = useMemo(() => buildFilterOptions(products), [products]);

  const activeFiltersCount = useMemo(() => {
    return filters.colors.size + filters.materials.size + filters.sizes.size;
  }, [filters]);

  const filteredProducts = useMemo(() => {
    const base = products.filter((product) => {
      if (product.categoryGroup?.slug && product.categoryGroup.slug !== activeGroup) {
        return false;
      }
      if (activeCategory && product.category?.slug !== activeCategory) {
        return false;
      }
      return matchesFilterState(product, filters);
    });
    return sortProducts(base, sort);
  }, [products, activeGroup, activeCategory, filters, sort]);

  const sortLabels = SORT_OPTIONS[locale];
  const activeGroupMeta = groups.find((group) => group.slug === activeGroup) ?? groups[0] ?? null;
  const selectionTitle = activeCategory
    ? getCategoryLabel(activeCategory, groups)
    : activeGroupMeta?.title ?? (locale === "fr" ? "Sélection" : "Selection");

  const toggleFilter = useCallback((section: FilterKey, value: string) => {
    setFilters((prev) => {
      const next = new Set(prev[section]);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return { ...prev, [section]: next } as FilterState;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ colors: new Set(), materials: new Set(), sizes: new Set() });
  }, []);

  const handleWishlistToggle = useCallback((productId: string) => {
    toggleWishlist(productId);
  }, [toggleWishlist]);

  return (
    <div className="min-h-screen bg-[var(--parchment)]">
      <ShopNavbar locale={locale} isAuthenticated={isAuthenticated} />

      {/* Cinematic Hero */}
      <ShopHero
        locale={locale}
        quickCategories={quickCategories}
        onCategorySelect={handleQuickCategory}
        onScrollToGrid={scrollToGrid}
      />

      {/* Category Showcase */}
      {groups.length > 0 && (
        <ShopCategoryShowcase
          locale={locale}
          groups={groups}
          activeGroup={activeGroup}
          onGroupChange={handleGroupChange}
          onCategorySelect={handleCategorySelect}
        />
      )}

      {/* Selection Bar (Sticky) */}
      <ShopSelectionBar
        locale={locale}
        title={selectionTitle ?? (locale === "fr" ? "Sélection" : "Selection")}
        count={filteredProducts.length}
        sort={sort}
        onSortChange={setSort}
        sortOptions={[...sortLabels]}
        onFiltersOpen={() => setFiltersOpen(true)}
        activeFiltersCount={activeFiltersCount}
        activeCategory={activeCategory ? getCategoryLabel(activeCategory, groups) : null}
        onClearCategory={() => setActiveCategory(null)}
      />

      {/* Product Grid */}
      <ShopProductGrid
        ref={gridRef}
        locale={locale}
        products={filteredProducts}
        title={selectionTitle ?? (locale === "fr" ? "Sélection" : "Selection")}
        count={filteredProducts.length}
        onCartChange={(next) => setCart(next)}
        wishlist={wishlist}
        onWishlistToggle={handleWishlistToggle}
        wishlistPendingId={wishlistPendingId}
        wishlistPending={wishlistPending}
      />

      {/* Filter Drawer */}
      <ShopFilterDrawer
        locale={locale}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        options={filterOptions}
        toggleFilter={toggleFilter}
        onClear={clearFilters}
        resultCount={filteredProducts.length}
      />
    </div>
  );
}

// Helper functions
function matchesFilterState(product: ProductListCard, filters: FilterState) {
  const colorTokens = product.colors.map(normalizeFilterValue);
  const materialTokens = product.materials.map(normalizeFilterValue);
  const sizeTokens = product.sizes.map(normalizeFilterValue);

  if (filters.colors.size && !colorTokens.some((token) => filters.colors.has(token))) {
    return false;
  }
  if (filters.materials.size && !materialTokens.some((token) => filters.materials.has(token))) {
    return false;
  }
  if (filters.sizes.size && !sizeTokens.some((token) => filters.sizes.has(token))) {
    return false;
  }
  return true;
}

function sortProducts(products: ProductListCard[], sort: string) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => (a.priceCents ?? Number.MAX_SAFE_INTEGER) - (b.priceCents ?? Number.MAX_SAFE_INTEGER));
    case "price-desc":
      return sorted.sort((a, b) => (b.priceCents ?? 0) - (a.priceCents ?? 0));
    case "newest":
      return sorted.reverse();
    default:
      return sorted.sort((a, b) => a.slug.localeCompare(b.slug));
  }
}

function buildFilterOptions(products: ProductListCard[]) {
  const base: Record<FilterKey, Map<string, FilterOption>> = {
    colors: new Map(),
    materials: new Map(),
    sizes: new Map(),
  };

  products.forEach((product) => {
    product.colors.forEach((color) => {
      const value = normalizeFilterValue(color);
      if (!base.colors.has(value)) {
        base.colors.set(value, { label: color, value });
      }
    });
    product.materials.forEach((material) => {
      const value = normalizeFilterValue(material);
      if (!base.materials.has(value)) {
        base.materials.set(value, { label: material, value });
      }
    });
    product.sizes.forEach((size) => {
      const value = normalizeFilterValue(size);
      if (!base.sizes.has(value)) {
        base.sizes.set(value, { label: size, value });
      }
    });
  });

  return {
    colors: Array.from(base.colors.values()),
    materials: Array.from(base.materials.values()),
    sizes: Array.from(base.sizes.values()),
  };
}

function normalizeFilterValue(value: string) {
  return value.toLowerCase().trim();
}

function getCategoryLabel(slug: string | null, groups: ShopCategoryGroup[]) {
  if (!slug) return null;
  for (const group of groups) {
    const match = group.categories.find((category) => category.slug === slug);
    if (match) return match.title;
  }
  return null;
}
