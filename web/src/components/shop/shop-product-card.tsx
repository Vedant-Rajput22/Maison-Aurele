"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Plus, ArrowUpRight, Sparkles, Eye } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ProductListCard } from "@/lib/data/products";
import type { CartSnapshot } from "@/lib/cart/actions";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { HoverSwapImage } from "@/components/products/hover-swap-image";
import { cn } from "@/lib/utils";

type ShopProductCardProps = {
  locale: Locale;
  product: ProductListCard;
  index: number;
  onCartChange?: (snapshot: CartSnapshot) => void;
  inWishlist: boolean;
  onWishlistToggle: () => void;
  wishlistPending: boolean;
  variant?: "default" | "featured" | "compact";
};

const COPY = {
  en: {
    view: "View",
    addToBag: "Add to bag",
    quickView: "Quick view",
    limited: "Limited edition",
    new: "New",
    exclusive: "Exclusive",
    uponRequest: "Upon request",
  },
  fr: {
    view: "Voir",
    addToBag: "Ajouter",
    quickView: "Aperçu rapide",
    limited: "Édition limitée",
    new: "Nouveauté",
    exclusive: "Exclusif",
    uponRequest: "Sur demande",
  },
  ar: {
    view: "عرض",
    addToBag: "أضف",
    quickView: "عرض سريع",
    limited: "إصدار محدود",
    new: "جديد",
    exclusive: "حصري",
    uponRequest: "عند الطلب",
  },
};

export function ShopProductCard({
  locale,
  product,
  index,
  onCartChange,
  inWishlist,
  onWishlistToggle,
  wishlistPending,
  variant = "default",
}: ShopProductCardProps) {
  const copy = COPY[locale];
  const cardRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const formatPrice = (priceCents: number | null | undefined) => {
    if (!priceCents) return copy.uponRequest;
    return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(priceCents / 100);
  };

  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-[var(--espresso)]/8 bg-white shadow-[0_20px_80px_rgba(17,11,9,0.06)] transition-all duration-500",
        isHovered && "border-[var(--espresso)]/15 shadow-[0_30px_100px_rgba(17,11,9,0.12)]",
        isFeatured && "md:col-span-2 md:row-span-2",
      )}
    >
      {/* Image Container */}
      <Link 
        href={`/${locale}/products/${product.slug}`}
        className={cn(
          "relative block overflow-hidden",
          isFeatured ? "aspect-[4/5]" : isCompact ? "aspect-square" : "aspect-[3/4]"
        )}
      >
        {/* Loading Skeleton */}
        <AnimatePresence>
          {!imageLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 animate-pulse bg-gradient-to-br from-[var(--parchment)] to-[var(--espresso)]/5"
            />
          )}
        </AnimatePresence>

        {/* Product Image */}
        {product.heroImage && (
          <div className="h-full w-full">
            <HoverSwapImage
              primary={product.heroImage}
              secondary={product.images?.[1] ?? null}
              alt={product.name}
              sizes={isFeatured ? "(min-width:768px) 60vw, 100vw" : "(min-width:768px) 33vw, 100vw"}
            />
          </div>
        )}

        {/* Hover Overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
        />

        {/* Top Badges */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.limitedEdition && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1.5 rounded-full border border-white/30 bg-black/40 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-white backdrop-blur-sm"
            >
              <Sparkles size={10} />
              {copy.limited}
            </motion.span>
          )}
          {product.category?.title && (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-white backdrop-blur-sm">
              {product.category.title}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onWishlistToggle();
          }}
          disabled={wishlistPending}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered || inWishlist ? 1 : 0, scale: isHovered || inWishlist ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm transition-all",
            inWishlist 
              ? "border-[var(--gilded-rose)] bg-[var(--gilded-rose)]/20 text-[var(--gilded-rose)]" 
              : "border-white/30 bg-black/30 text-white/80 hover:bg-white/20 hover:text-white",
            wishlistPending && "opacity-50"
          )}
        >
          <Heart className={cn("transition-all", inWishlist && "fill-current")} size={18} />
        </motion.button>

        {/* Quick View Button - Center */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-6 py-3 text-[0.65rem] uppercase tracking-[0.4em] text-white backdrop-blur-md transition-all hover:bg-white/30">
            <Eye size={14} />
            {copy.quickView}
          </span>
        </motion.div>

        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </Link>

      {/* Content */}
      <div className={cn(
        "relative space-y-4 px-5 pb-6 pt-5",
        isFeatured && "md:px-8 md:pb-8 md:pt-6"
      )}>
        {/* Heritage & Price Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--espresso)]/50">
            {product.heritageTag && (
              <>
                <span>{product.heritageTag}</span>
                <span className="h-3 w-px bg-[var(--espresso)]/20" />
              </>
            )}
            <span className="text-[var(--espresso)]/70">{formatPrice(product.priceCents)}</span>
          </div>
        </div>

        {/* Name & Description */}
        <div>
          <Link href={`/${locale}/products/${product.slug}`}>
            <h3 className={cn(
              "font-display text-[var(--espresso)] transition-colors group-hover:text-[var(--gilded-rose)]",
              isFeatured ? "text-3xl" : "text-xl"
            )}>
              {product.name}
            </h3>
          </Link>
          {product.description && !isCompact && (
            <p className={cn(
              "mt-2 text-sm leading-relaxed text-[var(--espresso)]/60 line-clamp-2",
              isFeatured && "line-clamp-3 md:text-base"
            )}>
              {product.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <motion.div 
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 5 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex items-center gap-3 pt-2",
            isCompact && "pt-0"
          )}
        >
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--espresso)]/20 bg-transparent px-5 py-3 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--espresso)]/70 transition-all hover:border-[var(--espresso)]/40 hover:text-[var(--espresso)]"
          >
            {copy.view}
            <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          {product.defaultVariantId && (
            <AddToCartButton 
              locale={locale} 
              variantId={product.defaultVariantId} 
              onCartChange={onCartChange}
              className="flex-1"
            />
          )}
        </motion.div>

        {/* Color Options Preview */}
        {product.colors.length > 0 && !isCompact && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[0.55rem] uppercase tracking-[0.3em] text-[var(--espresso)]/40">
              {product.colors.length} {locale === "fr" ? "couleurs" : "colors"}
            </span>
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color, i) => (
                <div
                  key={`${product.id}-${color}-${i}`}
                  className="h-3 w-3 rounded-full border border-[var(--espresso)]/10"
                  style={{ 
                    backgroundColor: getColorHex(color) 
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="flex h-3 w-3 items-center justify-center rounded-full border border-[var(--espresso)]/10 bg-[var(--parchment)] text-[0.45rem] text-[var(--espresso)]/50">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Shine Effect on Hover */}
      <motion.div
        initial={false}
        animate={{ 
          x: isHovered ? "100%" : "-100%",
          opacity: isHovered ? 0.1 : 0 
        }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        style={{ transform: "skewX(-20deg)" }}
      />
    </motion.article>
  );
}

// Helper to map color names to hex values
function getColorHex(colorName: string): string {
  const colors: Record<string, string> = {
    // Neutrals
    black: "#1a1a1a",
    noir: "#1a1a1a",
    white: "#fafafa",
    blanc: "#fafafa",
    cream: "#f5f0e8",
    crème: "#f5f0e8",
    ivory: "#fffff0",
    ivoire: "#fffff0",
    beige: "#d9c8b4",
    taupe: "#8b7355",
    charcoal: "#36454f",
    gray: "#808080",
    grey: "#808080",
    gris: "#808080",
    
    // Browns
    brown: "#8b4513",
    marron: "#8b4513",
    chocolate: "#3d1c0a",
    chocolat: "#3d1c0a",
    caramel: "#c68e17",
    cognac: "#9a463d",
    tan: "#d2b48c",
    
    // Blues
    navy: "#1a2744",
    marine: "#1a2744",
    blue: "#3b5998",
    bleu: "#3b5998",
    
    // Reds & Pinks
    red: "#8b0000",
    rouge: "#8b0000",
    burgundy: "#722f37",
    bordeaux: "#722f37",
    rose: "#d4a5a5",
    pink: "#d4a5a5",
    blush: "#de9b9b",
    
    // Greens
    green: "#355e3b",
    vert: "#355e3b",
    olive: "#556b2f",
    sage: "#9dc183",
    
    // Metallics
    gold: "#d4a574",
    or: "#d4a574",
    silver: "#c0c0c0",
    argent: "#c0c0c0",
    bronze: "#cd7f32",
  };
  
  const normalized = colorName.toLowerCase().trim();
  return colors[normalized] || "#d9d0c5";
}
