"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Heart, Share2, MapPin, Calendar, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import { ProductInfoTabs } from "@/components/products/product-info-tabs";
import { VariantSelector } from "@/components/products/variant-selector";

type VariantDisplay = {
  id: string;
  label: string;
  priceCents: number;
  availability: number | null;
};

type Copy = {
  boutique: string;
  contact: string;
  description: string;
  size: string;
  availability: string;
  book: string;
};

type Props = {
  locale: Locale;
  copy: Copy;
  referenceCode: string;
  productName: string;
  productDescription?: string | null;
  descriptionCopy: string;
  sizeFitCopy: string;
  contactCopy: string;
  priceRange: string;
  variantDisplay: VariantDisplay[];
  limitedEdition: boolean;
  heritageTag?: string | null;
  originCountry?: string | null;
};

const COPY = {
  en: {
    newArrival: "New arrival",
    addToWishlist: "Add to wishlist",
    addedToWishlist: "Added to wishlist",
    share: "Share",
    bookFitting: "Book a fitting",
    findBoutique: "Find a boutique",
    limitedEdition: "Limited edition",
    madeIn: "Made in",
    expandDetails: "View all details",
    collapseDetails: "Show less",
    exclusiveService: "Exclusive services",
    personalizedGift: "Personalized gift wrapping",
    whiteGlove: "White-glove delivery",
    expertAdvice: "Expert advice available",
  },
  fr: {
    newArrival: "Nouveauté",
    addToWishlist: "Ajouter aux favoris",
    addedToWishlist: "Ajouté aux favoris",
    share: "Partager",
    bookFitting: "Réserver un essayage",
    findBoutique: "Trouver une boutique",
    limitedEdition: "Édition limitée",
    madeIn: "Fabriqué en",
    expandDetails: "Voir tous les détails",
    collapseDetails: "Voir moins",
    exclusiveService: "Services exclusifs",
    personalizedGift: "Emballage cadeau personnalisé",
    whiteGlove: "Livraison gants blancs",
    expertAdvice: "Conseils d'experts disponibles",
  },
  ar: {
    newArrival: "وصول جديد",
    addToWishlist: "أضف إلى المفضلة",
    addedToWishlist: "تمت الإضافة إلى المفضلة",
    share: "مشاركة",
    bookFitting: "احجز قياس",
    findBoutique: "ابحث عن بوتيك",
    limitedEdition: "إصدار محدود",
    madeIn: "صنع في",
    expandDetails: "عرض جميع التفاصيل",
    collapseDetails: "عرض أقل",
    exclusiveService: "خدمات حصرية",
    personalizedGift: "تغليف هدايا مخصص",
    whiteGlove: "توصيل فاخر",
    expertAdvice: "نصائح الخبراء متاحة",
  },
} as const;

export function ProductDetailRailLuxury(props: Props) {
  const {
    locale,
    copy,
    referenceCode,
    productName,
    productDescription,
    descriptionCopy,
    sizeFitCopy,
    contactCopy,
    priceRange,
    variantDisplay,
    limitedEdition,
    heritageTag,
    originCountry,
  } = props;

  const localCopy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setOverflowing(el.scrollHeight > el.clientHeight + 4);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: productName,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  return (
    <div className="relative">
      {/* Ambient decoration */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(218,200,182,0.3),transparent_70%)] blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        ref={containerRef}
        className={cn(
          "relative space-y-6 overflow-hidden rounded-[2.5rem] border border-ink/8 bg-white/98 px-8 py-10 shadow-[0_50px_140px_rgba(12,9,6,0.12)] backdrop-blur-xl transition-[max-height] duration-700 ease-out",
          expanded ? "max-h-none" : "max-h-[calc(100vh-6rem)] overflow-hidden"
        )}
      >
        {/* Header with badge and actions */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {/* Status badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 px-3 py-1 text-[0.6rem] uppercase tracking-[0.4em] text-amber-800">
                <Sparkles size={10} />
                {localCopy.newArrival}
              </span>
              {limitedEdition && (
                <span className="rounded-full border border-ink/15 px-3 py-1 text-[0.6rem] uppercase tracking-[0.4em] text-ink/60">
                  {localCopy.limitedEdition}
                </span>
              )}
            </div>
            <p className="text-[0.55rem] uppercase tracking-[0.5em] text-ink/40">
              {referenceCode}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setWishlisted(!wishlisted)}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all",
                wishlisted
                  ? "border-rose-200 bg-rose-50"
                  : "border-ink/10 hover:border-ink/20"
              )}
            >
              <Heart
                size={16}
                className={cn(
                  "transition-all",
                  wishlisted ? "fill-rose-500 text-rose-500" : "text-ink/50 group-hover:text-ink/70"
                )}
              />
            </motion.button>
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 transition hover:border-ink/20"
              >
                <Share2 size={16} className="text-ink/50" />
              </motion.button>
              <AnimatePresence>
                {showShareTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-[0.6rem] text-white"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Product title and description */}
        <div className="space-y-4">
          <h1 className="font-display text-4xl leading-[1.15] tracking-tight">
            {productName}
          </h1>
          {productDescription && (
            <p className="text-[0.95rem] leading-relaxed text-ink/65">{productDescription}</p>
          )}
        </div>

        {/* Price display */}
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl tracking-tight">{priceRange}</span>
          {heritageTag && (
            <span className="rounded-full bg-ink/5 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-ink/50">
              {heritageTag}
            </span>
          )}
        </div>

        {/* CTA buttons */}
        <div className="grid gap-3">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link
              href={`/${locale}/appointments`}
              className="group relative flex h-14 items-center justify-center overflow-hidden rounded-full bg-ink text-xs uppercase tracking-[0.4em] text-white transition"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Calendar size={14} />
                {copy.book}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link
              href={`/${locale}/boutique`}
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white text-xs uppercase tracking-[0.4em] text-ink transition hover:border-ink/30 hover:bg-ink/5"
            >
              <MapPin size={14} />
              {copy.boutique}
            </Link>
          </motion.div>
        </div>

        {/* Exclusive services banner */}
        <div className="rounded-2xl border border-ink/8 bg-gradient-to-br from-[var(--parchment)] to-white/50 p-5">
          <p className="mb-3 text-[0.6rem] uppercase tracking-[0.5em] text-ink/50">
            {localCopy.exclusiveService}
          </p>
          <div className="space-y-2">
            {[
              localCopy.personalizedGift,
              localCopy.whiteGlove,
              localCopy.expertAdvice,
            ].map((service) => (
              <div key={service} className="flex items-center gap-2 text-sm text-ink/70">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-ink/10">
                  <Check size={10} className="text-ink/60" />
                </div>
                {service}
              </div>
            ))}
          </div>
        </div>

        {/* Info tabs */}
        <ProductInfoTabs
          tabs={[
            { key: "description", label: copy.description, content: descriptionCopy },
            {
              key: "size",
              label: copy.size,
              content: (
                <div className="space-y-6">
                  <p className="text-sm leading-relaxed text-ink/75">{sizeFitCopy}</p>
                  <VariantSelector locale={locale} variants={variantDisplay} />
                </div>
              ),
            },
            { key: "availability", label: copy.availability, content: contactCopy },
          ]}
        />

        {/* Origin & metadata */}
        <div className="flex flex-wrap items-center gap-3 border-t border-ink/8 pt-6">
          {originCountry && (
            <div className="flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-br from-amber-200 to-amber-400" />
              <span className="text-[0.6rem] uppercase tracking-[0.3em] text-ink/60">
                {localCopy.madeIn} {originCountry}
              </span>
            </div>
          )}
          {heritageTag && (
            <div className="rounded-full border border-ink/10 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-ink/60">
              {heritageTag}
            </div>
          )}
        </div>
      </motion.div>

      {/* Expand button */}
      <AnimatePresence>
        {!expanded && overflowing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-6"
          >
            {/* Gradient fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-[2.5rem] bg-gradient-to-t from-white via-white/90 to-transparent" />
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="pointer-events-auto relative inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[0.6rem] uppercase tracking-[0.4em] text-white shadow-xl transition hover:bg-ink/90"
            >
              <ChevronDown size={14} />
              {localCopy.expandDetails}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse button when expanded */}
      {expanded && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-6 py-2 text-[0.6rem] uppercase tracking-[0.4em] text-ink/60 transition hover:border-ink/20 hover:text-ink"
          >
            <ChevronDown size={14} className="rotate-180" />
            {localCopy.collapseDetails}
          </button>
        </div>
      )}
    </div>
  );
}
