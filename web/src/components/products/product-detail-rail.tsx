"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
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

export function ProductDetailRail(props: Props) {
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

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

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={cn(
          "space-y-6 rounded-[2.5rem] border border-ink/10 bg-white/95 px-8 py-10 shadow-[0_40px_120px_rgba(12,9,6,0.08)] backdrop-blur transition-[max-height] duration-500",
          expanded ? "max-h-none" : "max-h-[calc(100vh-6rem)] overflow-hidden",
        )}
      >
        <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.45em] text-ink/50">
          <span>{locale === "fr" ? "Nouveaute" : "New runway"}</span>
          <span>{referenceCode}</span>
        </div>
        <div>
          <h1 className="font-display text-4xl leading-tight">{productName}</h1>
          {productDescription && <p className="mt-4 text-sm leading-relaxed text-ink/70">{productDescription}</p>}
        </div>
        <div className="text-lg font-medium">{priceRange}</div>
        <div className="grid gap-3">
          <Link
            href={`/${locale}/boutique`}
            className="flex h-12 items-center justify-center rounded-full border border-ink/20 bg-white text-xs uppercase tracking-[0.4em] text-ink transition hover:border-ink/40"
          >
            {copy.boutique}
          </Link>
          <Link
            href={`/${locale}/appointments`}
            className="flex h-12 items-center justify-center rounded-full bg-ink text-xs uppercase tracking-[0.4em] text-white transition hover:bg-opacity-90"
          >
            {copy.contact}
          </Link>
        </div>
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
        <div className="flex flex-wrap gap-4 text-[0.6rem] uppercase tracking-[0.4em] text-ink/50">
          {limitedEdition && <span>{locale === "fr" ? "Edition limitee" : "Limited edition"}</span>}
          {heritageTag && <span>{heritageTag}</span>}
          {originCountry && <span>{originCountry}</span>}
        </div>
      </div>
      {!expanded && overflowing && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[var(--onyx)] px-4 py-2 text-[0.6rem] uppercase tracking-[0.4em] text-white shadow-lg"
          >
            <ChevronDown size={16} />
            {locale === "fr" ? "Afficher plus" : "Expand"}
          </button>
        </div>
      )}
    </div>
  );
}
