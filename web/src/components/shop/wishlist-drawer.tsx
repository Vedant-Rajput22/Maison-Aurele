"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { WishlistSnapshot } from "@/lib/wishlist/actions";
import { X } from "lucide-react";

type Props = {
  locale: Locale;
  open: boolean;
  wishlist: WishlistSnapshot;
  onClose: () => void;
  onRemove: (productId: string) => void;
  pending?: boolean;
  pendingId?: string | null;
};

export function WishlistDrawer({
  locale,
  open,
  wishlist,
  onClose,
  onRemove,
  pending,
  pendingId,
}: Props) {
  const isEmpty = wishlist.items.length === 0;

  return (
    <div
      className={`fixed inset-0 z-40 transition ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside
        className={`absolute left-0 top-0 h-full w-full max-w-[100vw] sm:max-w-lg border-r border-white/10 bg-[#111111] text-white transition-transform duration-500 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-8 sm:py-6">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/50">
              {locale === "fr" ? "Souhaits" : "Wishlist"}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl">
              {locale === "fr" ? "Mes desirables" : "Keepsakes"}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/20 p-3 text-white/70 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[calc(100%-160px)] sm:h-[calc(100%-180px)] flex-col overflow-y-auto px-4 py-4 sm:px-8 sm:py-6">
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-white/60">
              <p className="text-sm uppercase tracking-[0.5em]">
                {locale === "fr" ? "Pas encore de selection" : "Nothing saved yet"}
              </p>
              <p className="mt-4 max-w-sm text-xs text-white/45">
                {locale === "fr"
                  ? "Marquez vos silhouettes favorites pour composer une garde-robe sur-mesure."
                  : "Mark silhouettes you love to craft a bespoke wardrobe."}
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {wishlist.items.map((product) => (
                <li key={product.productId} className="flex gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-white/10 p-3 sm:p-4">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-xl sm:rounded-2xl bg-black/30">
                    {product.heroImage && (
                      <Image
                        src={product.heroImage}
                        alt={product.name}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-[0.55rem] uppercase tracking-[0.45em] text-white/50">
                        {product.categoryTitle}
                      </p>
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="font-display text-base sm:text-xl text-white hover:opacity-80"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-white/70">{formatPrice(product.priceCents, locale)}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em]">
                      <span className="text-white/50">{locale === "fr" ? "Collection" : "Collection"}</span>
                      <button
                        onClick={() => onRemove(product.productId)}
                        disabled={pending && pendingId === product.productId}
                        className="rounded-full border border-white/20 px-4 py-2 text-white/70 hover:text-white disabled:opacity-50 min-h-[44px]"
                      >
                        {locale === "fr" ? "Retirer" : "Remove"}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-white/10 px-4 py-4 sm:px-8 sm:py-6 text-xs text-white/50">
          {locale === "fr"
            ? "Vos favoris sont partages avec votre conseiller en boutique."
            : "Favorites sync with your concierge appointment."}
        </div>
      </aside>
    </div>
  );
}

function formatPrice(priceCents: number | null | undefined, locale: Locale) {
  if (!priceCents) return locale === "fr" ? "Sur demande" : "Upon request";
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}
