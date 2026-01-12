"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { useCommerce } from "@/components/commerce/commerce-provider";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { cn } from "@/lib/utils";

export type VariantDisplay = {
  id: string;
  label: string;
  priceCents: number;
  availability: number | null;
};

export function VariantSelector({ locale, variants }: { locale: Locale; variants: VariantDisplay[] }) {
  const { setCart } = useCommerce();
  const [activeId, setActiveId] = useState<string | null>(variants[0]?.id ?? null);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const resolvedActiveId = variants.some((variant) => variant.id === activeId)
    ? activeId
    : variants[0]?.id ?? null;
  const activeVariant = variants.find((variant) => variant.id === resolvedActiveId) ?? null;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {variants.map((variant) => {
          const isActive = variant.id === resolvedActiveId;
            return (
              <button
                type="button"
                key={variant.id}
                onClick={() => setActiveId(variant.id)}
              className={cn(
                "w-full rounded-2xl border px-4 py-4 text-left transition",
                isActive ? "border-ink bg-white shadow-[0_12px_30px_rgba(12,9,6,0.12)]" : "border-ink/10 hover:border-ink/30",
              )}
            >
              <p className="text-sm font-semibold text-ink">{variant.label}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
                {formatter.format(variant.priceCents / 100)}
                {typeof variant.availability === "number" && variant.availability <= 3
                  ? locale === "fr"
                    ? " · Dernières pièces"
                    : " · Low stock"
                  : null}
              </p>
            </button>
          );
        })}
      </div>
      {activeVariant && (
        <AddToCartButton locale={locale} variantId={activeVariant.id} onCartChange={setCart} />
      )}
    </div>
  );
}
