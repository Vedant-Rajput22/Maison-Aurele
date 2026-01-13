"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { CartSnapshot } from "@/lib/cart/actions";
import { updateCartItemQuantityAction, removeCartItemAction } from "@/lib/cart/actions";
import { X } from "lucide-react";

type Props = {
  locale: Locale;
  open: boolean;
  cart: CartSnapshot;
  onClose: () => void;
  onCartChange: (snapshot: CartSnapshot) => void;
};

export function CartDrawer({ locale, open, cart, onClose, onCartChange }: Props) {
  const [pendingItem, setPendingItem] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEmpty = cart.items.length === 0;

  useEffect(() => {
    const body = document.body;
    if (open) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
    return () => {
      body.style.overflow = "";
    };
  }, [open]);

  const mutateQuantity = (itemId: string, quantity: number) => {
    setPendingItem(itemId);
    startTransition(async () => {
      const result = await updateCartItemQuantityAction({ itemId, quantity, locale });
      if (result.cart) {
        onCartChange(result.cart);
      }
      setPendingItem(null);
    });
  };

  const handleRemove = (itemId: string) => {
    setPendingItem(itemId);
    startTransition(async () => {
      const result = await removeCartItemAction({ itemId, locale });
      if (result.cart) {
        onCartChange(result.cart);
      }
      setPendingItem(null);
    });
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
      style: "currency",
      currency: cart.currency,
      maximumFractionDigits: 0,
    }).format(value / 100);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[100vw] sm:max-w-lg flex-col overscroll-contain bg-[#0c0c0c] text-white transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-8 sm:py-6">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/60">
              {locale === "fr" ? "Panier" : "Cart"}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl">{locale === "fr" ? "Edition Maison" : "Maison Edition"}</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/20 p-3 text-white/70 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-8">
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-white/60">
              <p className="text-sm uppercase tracking-[0.5em]">{locale === "fr" ? "Votre selection est vide" : "Your selection is empty"}</p>
              <p className="mt-3 max-w-sm text-xs text-white/50">
                {locale === "fr"
                  ? "Ajoutez des silhouettes pour composer votre livraison sur-mesure."
                  : "Add silhouettes to compose your made-to-order delivery."}
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur"
                >
                  <div className="relative h-20 w-16 sm:h-28 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-black/30">
                    {item.heroImage && (
                      <Image
                        src={item.heroImage}
                        alt={item.productName}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[0.55rem] uppercase tracking-[0.45em] text-white/50">
                            {item.color} {item.size}
                          </p>
                          <Link
                            href={`/${locale}/products/${item.productSlug}`}
                            className="font-display text-base sm:text-xl text-white hover:opacity-80"
                          >
                            {item.productName}
                          </Link>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="rounded-full border border-white/15 px-2 py-1 text-[0.6rem] uppercase tracking-[0.4em] text-white/60 hover:text-white"
                          disabled={isPending && pendingItem === item.id}
                        >
                          {locale === "fr" ? "Retirer" : "Remove"}
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-white/70">{formatPrice(item.priceCents)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => mutateQuantity(item.id, item.quantity - 1)}
                          className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/20 text-sm min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
                          disabled={isPending && pendingItem === item.id}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm tracking-[0.3em]">{item.quantity}</span>
                        <button
                          onClick={() => mutateQuantity(item.id, item.quantity + 1)}
                          className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/20 text-sm min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
                          disabled={isPending && pendingItem === item.id}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-white/70">
                        {formatPrice(item.priceCents * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-white/10 bg-[#0c0c0c] px-4 py-4 sm:px-8 sm:py-6">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.35em] text-white/60">
            <span>{locale === "fr" ? "Sous-total" : "Subtotal"}</span>
            <span className="text-white">{formatPrice(cart.subtotalCents)}</span>
          </div>
          <div className="mt-4 text-xs text-white/40">
            {locale === "fr"
              ? "Livraison main blanche, taxes calculees apres adresse."
              : "White-glove delivery, taxes calculated after address."}
          </div>
          <Link
            href={`/${locale}/cart`}
            onClick={onClose}
            className={`mt-6 block rounded-full bg-white/90 px-6 py-4 text-center text-sm uppercase tracking-[0.4em] text-black transition hover:bg-white ${isEmpty ? "pointer-events-none opacity-40" : ""
              }`}
          >
            {locale === "fr" ? "Passer en caisse" : "Proceed to checkout"}
          </Link>
        </div>
      </aside>
    </div>
  );
}

