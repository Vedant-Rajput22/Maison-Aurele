"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Address } from "@prisma/client";
import type { Locale } from "@/lib/i18n/config";
import type { CartSnapshot } from "@/lib/cart/actions";
import {
  updateCartItemQuantityAction,
  removeCartItemAction,
} from "@/lib/cart/actions";
import { startCheckoutAction } from "@/lib/checkout/actions";
import { clearCartSessionAction } from "@/lib/cart/clear-session-action";
import { useCommerce } from "@/components/commerce/commerce-provider";
import { AddressForm, AddressModal } from "@/components/account/address-components";

type Props = {
  locale: Locale;
  initialCart: CartSnapshot;
  isLoggedIn: boolean;
  addresses: Address[];
  checkoutSuccess?: boolean;
};

export function CartPageClient({ locale, initialCart, isLoggedIn, addresses: initialAddresses, checkoutSuccess }: Props) {
  const router = useRouter();
  const { clearCart } = useCommerce();
  const hasCleared = useRef(false);

  // Use empty cart if checkout was successful, otherwise use initial cart
  const effectiveInitialCart = checkoutSuccess ? {
    cartId: null,
    currency: initialCart.currency,
    itemCount: 0,
    subtotalCents: 0,
    items: [],
  } : initialCart;

  const [cart, setCart] = useState(effectiveInitialCart);

  // Store clearCart in a ref to avoid stale closure
  const clearCartRef = useRef(clearCart);
  useEffect(() => {
    clearCartRef.current = clearCart;
  }, [clearCart]);

  // Clear cart session and global context on checkout success
  useEffect(() => {
    if (checkoutSuccess && !hasCleared.current) {
      hasCleared.current = true;
      // Immediately clear the global cart context so sidebar shows empty
      clearCartRef.current();
      // Also clear the cart session cookie via server action (background)
      clearCartSessionAction();
    }
  }, [checkoutSuccess]);
  const [addresses] = useState(initialAddresses);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialAddresses.find((a) => a.isDefault)?.id ?? initialAddresses[0]?.id ?? null
  );
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const isEmpty = cart.items.length === 0;

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
      style: "currency",
      currency: cart.currency,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  const mutateQuantity = (itemId: string, quantity: number) => {
    setPendingId(itemId);
    startTransition(async () => {
      const result = await updateCartItemQuantityAction({
        itemId,
        quantity,
        locale,
      });
      if (result.cart) {
        setCart(result.cart);
      }
      setPendingId(null);
    });
  };

  const removeItem = (itemId: string) => {
    setPendingId(itemId);
    startTransition(async () => {
      const result = await removeCartItemAction({ itemId, locale });
      if (result.cart) {
        setCart(result.cart);
      }
      setPendingId(null);
    });
  };

  return (
    <div className="min-h-screen bg-[#05070d] px-4 pb-24 pt-24 text-white sm:px-6 sm:pt-32 md:px-12">
      <div className="mx-auto max-w-5xl space-y-16">
        <header className="text-center text-white">
          <p className="text-[0.65rem] uppercase tracking-[0.55em] text-white/60">
            {locale === "fr" ? "Panier Maison Aurele" : "Maison Aurele Cart"}
          </p>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-white">
            {locale === "fr" ? "Livraison sur mesure" : "White glove delivery"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70">
            {locale === "fr"
              ? "Chaque commande est préparée dans l’atelier parisien, emballée à la main et livrée par conciergerie partenaire."
              : "Each order is prepared in the Paris atelier, hand packed, and delivered by our partner concierge service."}
          </p>
        </header>

        {/* Checkout Success Banner */}
        {checkoutSuccess && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
            <p className="text-lg font-display text-green-400">
              {locale === "fr" ? "Commande confirmée !" : "Order confirmed!"}
            </p>
            <p className="mt-2 text-sm text-white/70">
              {locale === "fr"
                ? "Merci pour votre commande. Vous recevrez un email de confirmation sous peu."
                : "Thank you for your order. You will receive a confirmation email shortly."}
            </p>
            <Link
              href={`/${locale}/account`}
              className="mt-4 inline-block rounded-full border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white hover:border-white/60"
            >
              {locale === "fr" ? "Voir mes commandes" : "View my orders"}
            </Link>
          </div>
        )}

        <section className="space-y-6 sm:space-y-8 rounded-2xl sm:rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#151628] via-[#0c0e19] to-[#05070d] p-4 sm:p-6 md:p-10 shadow-[0_40px_180px_rgba(2,3,12,0.65)]">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center text-white/70">
              <p className="text-sm uppercase tracking-[0.5em]">
                {locale === "fr" ? "Aucune pièce sélectionnée" : "No pieces selected"}
              </p>
              <p className="max-w-md text-sm text-white/60">
                {locale === "fr"
                  ? "Découvrez les collections pour ajouter vos silhouettes favorites."
                  : "Browse the collections to add silhouettes you love."}
              </p>
              <Link
                href={`/${locale}/shop`}
                className="rounded-full border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white hover:border-white/60"
              >
                {locale === "fr" ? "Retourner à la boutique" : "Back to shop"}
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 sm:gap-6 rounded-xl sm:rounded-[2.5rem] border border-white/10 bg-white/5 p-4 sm:p-6 text-white md:flex-row"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-white/10 md:h-44 md:w-48">
                  {item.heroImage && (
                    <Image
                      src={item.heroImage}
                      alt={item.productName}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`/${locale}/products/${item.productSlug}`}
                        className="font-display text-xl sm:text-2xl text-white hover:opacity-80"
                      >
                        {item.productName}
                      </Link>
                      <span className="text-sm text-white/70">
                        {formatPrice(item.priceCents)}
                      </span>
                    </div>
                    <p className="text-xs uppercase tracking-[0.45em] text-white/50">
                      {item.color} {item.size}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => mutateQuantity(item.id, item.quantity - 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-sm min-w-[44px] min-h-[44px]"
                        disabled={isPending && pendingId === item.id}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm tracking-[0.3em] text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => mutateQuantity(item.id, item.quantity + 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-sm min-w-[44px] min-h-[44px]"
                        disabled={isPending && pendingId === item.id}
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-white/70">
                        {formatPrice(item.priceCents * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs uppercase tracking-[0.35em] text-white/60 underline decoration-dotted"
                        disabled={isPending && pendingId === item.id}
                      >
                        {locale === "fr" ? "Retirer" : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        {!isEmpty && (
          <>
            {/* Address Selection Section */}
            <section className="rounded-2xl sm:rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#11121c] via-[#0b0c16] to-[#05060b] p-4 sm:p-6 md:p-10 shadow-[0_45px_200px_rgba(5,5,9,0.6)]">
              <p className="text-[0.6rem] uppercase tracking-[0.55em] text-white/60">
                {locale === "fr" ? "Adresse de livraison" : "Shipping Address"}
              </p>
              <h2 className="mt-3 font-display text-2xl text-white">
                {locale === "fr"
                  ? "Sélectionnez une adresse ou ajoutez-en une nouvelle"
                  : "Select an address or add a new one"}
              </h2>

              {!isLoggedIn ? (
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-white/60">
                    {locale === "fr"
                      ? "Connectez-vous pour sélectionner une adresse"
                      : "Sign in to select a saved address"}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href={`/${locale}/login?callbackUrl=/${locale}/cart`}
                      className="rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.4em] text-black transition hover:bg-white/90"
                    >
                      {locale === "fr" ? "Se connecter" : "Sign in"}
                    </Link>
                    <span className="text-xs text-white/40">
                      {locale === "fr"
                        ? "Ou continuez en tant qu'invité"
                        : "Or continue as guest"}
                    </span>
                  </div>
                </div>
              ) : showAddressForm ? (
                <div className="mt-6">
                  <AddressForm
                    locale={locale}
                    onSuccess={() => {
                      router.refresh();
                      setShowAddressForm(false);
                    }}
                    onCancel={() => setShowAddressForm(false)}
                  />
                </div>
              ) : (
                <div className="mt-6">
                  {addresses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center">
                      <p className="text-sm text-white/50">
                        {locale === "fr"
                          ? "Aucune adresse enregistrée"
                          : "No saved addresses"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(true)}
                        className="mt-4 rounded-full border border-white/30 px-6 py-2 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-black"
                      >
                        {locale === "fr" ? "Ajouter une adresse" : "Add an address"}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {addresses.map((address) => (
                          <AddressSelectCard
                            key={address.id}
                            address={address}
                            locale={locale}
                            selected={selectedAddressId === address.id}
                            onSelect={() => setSelectedAddressId(address.id)}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(true)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 p-4 text-xs uppercase tracking-[0.4em] text-white/60 transition hover:border-white/40 hover:text-white"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        {locale === "fr" ? "Ajouter une adresse" : "Add an address"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </section>

            {/* Summary Section */}
            <section className="rounded-2xl sm:rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#11121c] via-[#0b0c16] to-[#05060b] p-4 sm:p-6 md:p-10 text-white shadow-[0_45px_200px_rgba(5,5,9,0.6)]">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.55em] text-white/60">
                    {locale === "fr" ? "Récapitulatif" : "Summary"}
                  </p>
                  <h2 className="mt-3 font-display text-3xl">
                    {locale === "fr" ? "Prêt pour le rendez-vous" : "Ready for rendez-vous"}
                  </h2>
                  <p className="mt-3 text-sm text-white/70">
                    {locale === "fr"
                      ? "La conciergerie confirmera l'adresse, les délais et les options d'expérience."
                      : "Our concierge will confirm address, lead times, and experience options."}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                    {locale === "fr" ? "Sous-total" : "Subtotal"}
                  </p>
                  <p className="text-3xl">{formatPrice(cart.subtotalCents)}</p>
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
                    {locale === "fr"
                      ? "Taxes et livraison calculées après adresse"
                      : "Taxes & delivery calculated after address"}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/appointments`}
                  className="rounded-full border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white/80 hover:text-white"
                >
                  {locale === "fr" ? "Planifier un rendez-vous" : "Plan an appointment"}
                </Link>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutPending}
                  className="rounded-full bg-white px-8 py-3 text-xs uppercase tracking-[0.4em] text-black disabled:opacity-50"
                >
                  {checkoutPending
                    ? locale === "fr"
                      ? "Connexion..."
                      : "Connecting..."
                    : locale === "fr"
                      ? "Passer la commande"
                      : "Place order"}
                </button>
              </div>
              {checkoutMessage && (
                <p className="mt-4 text-xs uppercase tracking-[0.35em] text-white/60">
                  {checkoutMessage}
                </p>
              )}
            </section>
          </>
        )}
      </div>

      {/* Address Modal */}
      <AddressModal
        locale={locale}
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSuccess={() => {
          router.refresh();
          setShowAddressModal(false);
        }}
      />
    </div>
  );

  function handleCheckout() {
    setCheckoutMessage(null);
    setCheckoutPending(true);
    startCheckoutAction(locale, { shippingAddressId: selectedAddressId ?? undefined })
      .then((result) => {
        if (result.ok && result.checkoutUrl) {
          window.location.assign(result.checkoutUrl);
        } else {
          setCheckoutMessage(
            result.error ??
            (locale === "fr"
              ? "Impossible de lancer le paiement."
              : "Unable to start checkout.")
          );
        }
      })
      .finally(() => setCheckoutPending(false));
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Address Select Card (simplified for checkout selection)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AddressSelectCard({
  address,
  locale,
  selected,
  onSelect,
}: {
  address: Address;
  locale: Locale;
  selected: boolean;
  onSelect: () => void;
}) {
  const COUNTRIES: Record<string, { en: string; fr: string }> = {
    FR: { en: "France", fr: "France" },
    US: { en: "United States", fr: "États-Unis" },
    GB: { en: "United Kingdom", fr: "Royaume-Uni" },
    DE: { en: "Germany", fr: "Allemagne" },
    IT: { en: "Italy", fr: "Italie" },
    ES: { en: "Spain", fr: "Espagne" },
    CH: { en: "Switzerland", fr: "Suisse" },
    BE: { en: "Belgium", fr: "Belgique" },
    NL: { en: "Netherlands", fr: "Pays-Bas" },
    JP: { en: "Japan", fr: "Japon" },
    CN: { en: "China", fr: "Chine" },
    AE: { en: "UAE", fr: "Émirats Arabes Unis" },
    SG: { en: "Singapore", fr: "Singapour" },
    AU: { en: "Australia", fr: "Australie" },
  };

  const countryName = COUNTRIES[address.country]?.[locale] ?? address.country;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        group relative w-full rounded-2xl border p-5 text-left transition-all duration-300
        ${selected
          ? "border-white/40 bg-white/10 ring-1 ring-white/20"
          : "border-white/10 bg-white/5 hover:border-white/25"
        }
      `}
    >
      {/* Selection indicator */}
      <div className="absolute right-4 top-4">
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${selected
            ? "border-white bg-white"
            : "border-white/30 group-hover:border-white/50"
            }`}
        >
          {selected && (
            <svg
              className="h-3 w-3 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Default badge */}
      {address.isDefault && (
        <span className="mb-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.35em] text-white/60">
          {locale === "fr" ? "Par défaut" : "Default"}
        </span>
      )}

      {/* Label */}
      <p className="font-display text-base text-white">
        {address.label ?? address.city}
      </p>

      {/* Address details */}
      <div className="mt-2 space-y-0.5 text-xs text-white/60">
        <p>
          {address.firstName} {address.lastName}
        </p>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>
          {address.postalCode} {address.city}
        </p>
        <p>{countryName}</p>
      </div>
    </button>
  );
}
