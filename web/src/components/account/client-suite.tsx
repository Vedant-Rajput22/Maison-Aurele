"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Address, Order, OrderItem, ProductVariant, Product, MediaAsset, ProductMedia, OrderStatus, FulfillmentStatus, PaymentStatus } from "@prisma/client";
import type { Locale } from "@/lib/i18n/config";
import { signOut } from "next-auth/react";
import { AddressCard, AddressModal } from "./address-components";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type OrderItemWithDetails = OrderItem & {
  variant: ProductVariant & {
    product: Product & {
      media: (ProductMedia & { asset: MediaAsset | null })[];
    };
  };
};

type OrderWithItems = Order & {
  items: OrderItemWithDetails[];
};

type UserProfile = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  addresses: Address[];
  orders: OrderWithItems[];
};

type ClientSuiteProps = {
  profile: UserProfile;
  locale: Locale;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Status Labels
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function statusLabel(status: OrderStatus, locale: Locale) {
  const labels: Record<OrderStatus, { en: string; fr: string }> = {
    PENDING: { en: "Pending", fr: "En attente" },
    CONFIRMED: { en: "Confirmed", fr: "Confirmée" },
    FULFILLED: { en: "Fulfilled", fr: "Clôturée" },
    CANCELLED: { en: "Cancelled", fr: "Annulée" },
    REFUNDED: { en: "Refunded", fr: "Remboursée" },
  };
  return labels[status]?.[locale] ?? status;
}

function fulfillmentLabel(status: FulfillmentStatus, locale: Locale) {
  const labels: Record<FulfillmentStatus, { en: string; fr: string }> = {
    NOT_STARTED: { en: "Preparation", fr: "Préparation" },
    IN_PROGRESS: { en: "In progress", fr: "En cours" },
    SHIPPED: { en: "Shipped", fr: "Expédiée" },
    DELIVERED: { en: "Delivered", fr: "Livrée" },
    WHITE_GLOVE_SCHEDULED: { en: "White Glove", fr: "White Glove" },
  };
  return labels[status]?.[locale] ?? status;
}

function paymentLabel(status: PaymentStatus, locale: Locale) {
  const labels: Record<PaymentStatus, { en: string; fr: string }> = {
    UNPAID: { en: "Unpaid", fr: "Non payé" },
    AUTHORIZED: { en: "Authorized", fr: "Autorisé" },
    PAID: { en: "Paid", fr: "Payé" },
    REFUNDED: { en: "Refunded", fr: "Remboursé" },
  };
  return labels[status]?.[locale] ?? status;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Client Suite Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ClientSuite({ profile, locale }: ClientSuiteProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses" | "settings">("overview");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const router = useRouter();

  const copy =
    locale === "fr"
      ? {
          siteTitle: "Maison Aurèle",
          clientSuite: "Suite Client",
          greeting: `Bienvenue, ${profile.firstName ?? "Cher Client"}`,
          subtitle: "Votre espace personnel dédié à l'excellence",
          tabs: {
            overview: "Aperçu",
            orders: "Commandes",
            addresses: "Adresses",
            settings: "Préférences",
          },
          overview: {
            recentOrders: "Commandes récentes",
            noOrders: "Vos pièces d'exception apparaîtront ici",
            viewAll: "Voir toutes les commandes",
            savedAddresses: "Adresses enregistrées",
            noAddresses: "Aucune adresse enregistrée",
            addAddress: "Ajouter une adresse",
            quickActions: "Actions rapides",
            shopCollection: "Explorer les collections",
            bookAppointment: "Réserver un rendez-vous",
            contactConcierge: "Contacter la conciergerie",
          },
          orders: {
            title: "Vos commandes",
            subtitle: "Suivez vos acquisitions d'exception",
            empty: "Aucune commande pour le moment",
            emptyDesc: "Explorez nos collections pour découvrir des pièces uniques",
            orderNumber: "Commande",
            placedOn: "Commandé le",
            total: "Total",
            items: "Articles",
            viewDetails: "Détails",
          },
          addresses: {
            title: "Carnet d'adresses",
            subtitle: "Gérez vos adresses de livraison",
            addNew: "Nouvelle adresse",
          },
          settings: {
            title: "Préférences",
            subtitle: "Personnalisez votre expérience",
            profile: "Profil",
            email: "Adresse e-mail",
            phone: "Téléphone",
            notProvided: "Non renseigné",
            signOut: "Se déconnecter",
          },
        }
      : {
          siteTitle: "Maison Aurèle",
          clientSuite: "Client Suite",
          greeting: `Welcome back, ${profile.firstName ?? "Valued Client"}`,
          subtitle: "Your personal space dedicated to excellence",
          tabs: {
            overview: "Overview",
            orders: "Orders",
            addresses: "Addresses",
            settings: "Settings",
          },
          overview: {
            recentOrders: "Recent Orders",
            noOrders: "Your exceptional pieces will appear here",
            viewAll: "View all orders",
            savedAddresses: "Saved Addresses",
            noAddresses: "No addresses saved",
            addAddress: "Add address",
            quickActions: "Quick Actions",
            shopCollection: "Explore collections",
            bookAppointment: "Book appointment",
            contactConcierge: "Contact concierge",
          },
          orders: {
            title: "Your Orders",
            subtitle: "Track your exceptional acquisitions",
            empty: "No orders yet",
            emptyDesc: "Explore our collections to discover unique pieces",
            orderNumber: "Order",
            placedOn: "Placed on",
            total: "Total",
            items: "Items",
            viewDetails: "Details",
          },
          addresses: {
            title: "Address Book",
            subtitle: "Manage your delivery addresses",
            addNew: "New address",
          },
          settings: {
            title: "Settings",
            subtitle: "Customize your experience",
            profile: "Profile",
            email: "Email address",
            phone: "Phone",
            notProvided: "Not provided",
            signOut: "Sign out",
          },
        };

  const formatter = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const dateFormatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressModalOpen(true);
  };

  const handleAddressModalClose = () => {
    setAddressModalOpen(false);
    setEditingAddress(null);
  };

  const handleAddressSuccess = () => {
    router.refresh();
    handleAddressModalClose();
  };

  return (
    <div className="min-h-screen bg-[#030308]">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0a0a12] to-[#030308]">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Gradient orbs */}
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-3xl" />
        <div className="absolute -right-40 top-20 h-60 w-60 rounded-full bg-gradient-to-bl from-rose-500/5 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-32 md:px-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.6em] text-white/40">
                {copy.siteTitle} · {copy.clientSuite}
              </p>
              <h1 className="mt-6 font-display text-4xl text-white md:text-5xl lg:text-6xl">
                {copy.greeting}
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/50">
                {copy.subtitle}
              </p>
            </div>
            <SignOutButton locale={locale} label={copy.settings.signOut} />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#030308]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex gap-1 overflow-x-auto py-1 scrollbar-none">
            {(["overview", "orders", "addresses", "settings"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative whitespace-nowrap px-6 py-4 text-[0.65rem] uppercase tracking-[0.4em] transition-all
                  ${
                    activeTab === tab
                      ? "text-white"
                      : "text-white/40 hover:text-white/70"
                  }
                `}
              >
                {copy.tabs[tab]}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        {activeTab === "overview" && (
          <OverviewTab
            profile={profile}
            locale={locale}
            copy={copy.overview}
            formatter={formatter}
            dateFormatter={dateFormatter}
            onViewOrders={() => setActiveTab("orders")}
            onViewAddresses={() => setActiveTab("addresses")}
            onAddAddress={() => setAddressModalOpen(true)}
          />
        )}

        {activeTab === "orders" && (
          <OrdersTab
            orders={profile.orders}
            locale={locale}
            copy={copy.orders}
            formatter={formatter}
            dateFormatter={dateFormatter}
          />
        )}

        {activeTab === "addresses" && (
          <AddressesTab
            addresses={profile.addresses}
            locale={locale}
            copy={copy.addresses}
            onAdd={() => setAddressModalOpen(true)}
            onEdit={handleEditAddress}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab profile={profile} locale={locale} copy={copy.settings} />
        )}
      </main>

      {/* Address Modal */}
      <AddressModal
        locale={locale}
        address={editingAddress}
        isOpen={addressModalOpen}
        onClose={handleAddressModalClose}
        onSuccess={handleAddressSuccess}
      />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sign Out Button
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SignOutButton({ locale, label }: { locale: Locale; label: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await signOut({ callbackUrl: `/${locale}` });
        })
      }
      disabled={pending}
      className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white/60 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      <svg
        className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
        />
      </svg>
      {label}
    </button>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Overview Tab
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type OverviewCopy = {
  recentOrders: string;
  noOrders: string;
  viewAll: string;
  savedAddresses: string;
  noAddresses: string;
  addAddress: string;
  quickActions: string;
  shopCollection: string;
  bookAppointment: string;
  contactConcierge: string;
};

function OverviewTab({
  profile,
  locale,
  copy,
  formatter,
  dateFormatter,
  onViewOrders,
  onViewAddresses,
  onAddAddress,
}: {
  profile: UserProfile;
  locale: Locale;
  copy: OverviewCopy;
  formatter: Intl.NumberFormat;
  dateFormatter: Intl.DateTimeFormat;
  onViewOrders: () => void;
  onViewAddresses: () => void;
  onAddAddress: () => void;
}) {
  const recentOrders = profile.orders.slice(0, 3);
  const recentAddresses = profile.addresses.slice(0, 2);

  return (
    <div className="space-y-12">
      {/* Quick Actions */}
      <section>
        <SectionHeader title={copy.quickActions} />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <QuickActionCard
            href={`/${locale}/shop`}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            }
            title={copy.shopCollection}
          />
          <QuickActionCard
            href={`/${locale}/appointments`}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            }
            title={copy.bookAppointment}
          />
          <QuickActionCard
            href={`/${locale}/maison`}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            }
            title={copy.contactConcierge}
          />
        </div>
      </section>

      {/* Recent Orders */}
      <section>
        <div className="flex items-center justify-between">
          <SectionHeader title={copy.recentOrders} />
          {recentOrders.length > 0 && (
            <button
              onClick={onViewOrders}
              className="text-[0.65rem] uppercase tracking-[0.4em] text-white/40 transition hover:text-white"
            >
              {copy.viewAll} →
            </button>
          )}
        </div>
        <div className="mt-6">
          {recentOrders.length === 0 ? (
            <EmptyState message={copy.noOrders} />
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  locale={locale}
                  formatter={formatter}
                  dateFormatter={dateFormatter}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Saved Addresses */}
      <section>
        <div className="flex items-center justify-between">
          <SectionHeader title={copy.savedAddresses} />
          <button
            onClick={onViewAddresses}
            className="text-[0.65rem] uppercase tracking-[0.4em] text-white/40 transition hover:text-white"
          >
            {locale === "fr" ? "Gérer" : "Manage"} →
          </button>
        </div>
        <div className="mt-6">
          {recentAddresses.length === 0 ? (
            <EmptyState
              message={copy.noAddresses}
              action={{ label: copy.addAddress, onClick: onAddAddress }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {recentAddresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  locale={locale}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Orders Tab
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type OrdersCopy = {
  title: string;
  subtitle: string;
  empty: string;
  emptyDesc: string;
  orderNumber: string;
  placedOn: string;
  total: string;
  items: string;
  viewDetails: string;
};

function OrdersTab({
  orders,
  locale,
  copy,
  formatter,
  dateFormatter,
}: {
  orders: OrderWithItems[];
  locale: Locale;
  copy: OrdersCopy;
  formatter: Intl.NumberFormat;
  dateFormatter: Intl.DateTimeFormat;
}) {
  return (
    <div>
      <PageHeader title={copy.title} subtitle={copy.subtitle} />

      {orders.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            message={copy.empty}
            description={copy.emptyDesc}
            action={{
              label: locale === "fr" ? "Explorer les collections" : "Explore collections",
              href: `/${locale}/shop`,
            }}
          />
        </div>
      ) : (
        <div className="mt-12 space-y-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              locale={locale}
              formatter={formatter}
              dateFormatter={dateFormatter}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Addresses Tab
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AddressesTab({
  addresses,
  locale,
  copy,
  onAdd,
  onEdit,
}: {
  addresses: Address[];
  locale: Locale;
  copy: { title: string; subtitle: string; addNew: string };
  onAdd: () => void;
  onEdit: (address: Address) => void;
}) {
  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader title={copy.title} subtitle={copy.subtitle} />
        <button
          onClick={onAdd}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {copy.addNew}
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            message={locale === "fr" ? "Aucune adresse enregistrée" : "No addresses saved"}
            action={{ label: copy.addNew, onClick: onAdd }}
          />
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              locale={locale}
              onEdit={() => onEdit(address)}
              showActions
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Settings Tab
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SettingsTab({
  profile,
  locale,
  copy,
}: {
  profile: UserProfile;
  locale: Locale;
  copy: {
    title: string;
    subtitle: string;
    profile: string;
    email: string;
    phone: string;
    notProvided: string;
    signOut: string;
  };
}) {
  return (
    <div>
      <PageHeader title={copy.title} subtitle={copy.subtitle} />

      <div className="mt-12 space-y-8">
        {/* Profile Section */}
        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-8">
          <h3 className="text-xs uppercase tracking-[0.5em] text-white/40">{copy.profile}</h3>

          <div className="mt-8 space-y-6">
            <ProfileField
              label={locale === "fr" ? "Nom complet" : "Full name"}
              value={
                [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
                copy.notProvided
              }
            />
            <ProfileField label={copy.email} value={profile.email ?? copy.notProvided} />
            <ProfileField label={copy.phone} value={profile.phone ?? copy.notProvided} />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-3xl border border-red-500/10 bg-gradient-to-br from-red-500/[0.02] to-transparent p-8">
          <h3 className="text-xs uppercase tracking-[0.5em] text-red-400/60">
            {locale === "fr" ? "Zone de danger" : "Danger Zone"}
          </h3>
          <p className="mt-4 text-sm text-white/40">
            {locale === "fr"
              ? "Déconnectez-vous de votre compte. Vos données resteront sauvegardées."
              : "Sign out of your account. Your data will remain saved."}
          </p>
          <div className="mt-6">
            <SignOutButton locale={locale} label={copy.signOut} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 border-b border-white/5 pb-6 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-white/40">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Shared Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xs uppercase tracking-[0.5em] text-white/40">{title}</h2>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-white">{title}</h2>
      <p className="mt-2 text-sm text-white/50">{subtitle}</p>
    </div>
  );
}

function EmptyState({
  message,
  description,
  action,
}: {
  message: string;
  description?: string;
  action?: { label: string; onClick?: () => void; href?: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center">
      <div className="mb-4 rounded-full border border-white/10 bg-white/5 p-4">
        <svg
          className="h-6 w-6 text-white/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>
      <p className="text-sm text-white/50">{message}</p>
      {description && <p className="mt-2 text-xs text-white/30">{description}</p>}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="mt-6 rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.4em] text-white/70 transition hover:border-white/40 hover:text-white"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="mt-6 rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.4em] text-white/70 transition hover:border-white/40 hover:text-white"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-6 transition-all hover:border-white/10 hover:from-white/[0.05]"
    >
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/50 transition-colors group-hover:text-white">
        {icon}
      </div>
      <span className="text-sm text-white/70 transition-colors group-hover:text-white">
        {title}
      </span>
      <svg
        className="ml-auto h-4 w-4 text-white/20 transition-all group-hover:translate-x-1 group-hover:text-white/50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}

function OrderCard({
  order,
  locale,
  formatter,
  dateFormatter,
  compact = false,
}: {
  order: OrderWithItems;
  locale: Locale;
  formatter: Intl.NumberFormat;
  dateFormatter: Intl.DateTimeFormat;
  compact?: boolean;
}) {
  return (
    <article
      className={`
        group rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent transition-all hover:border-white/10
        ${compact ? "p-6" : "p-8"}
      `}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/40">
            {locale === "fr" ? "Commande" : "Order"} #{order.number}
          </p>
          <p className="mt-1 text-xs text-white/30">
            {dateFormatter.format(new Date(order.placedAt))}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl text-white">
            {formatter.format(order.totalCents / 100)}
          </p>
        </div>
      </div>

      {/* Status tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusPill label={statusLabel(order.status, locale)} variant="default" />
        <StatusPill label={fulfillmentLabel(order.fulfillmentStatus, locale)} variant="subtle" />
        <StatusPill label={paymentLabel(order.paymentStatus, locale)} variant="subtle" />
      </div>

      {/* Items */}
      {!compact && order.items.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3 border-t border-white/5 pt-6">
          {order.items.map((item) => {
            const hero = item.variant.product.media[0]?.asset?.url;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
              >
                <div className="relative h-12 w-10 overflow-hidden rounded-lg bg-white/5">
                  {hero && (
                    <Image
                      src={hero}
                      alt={item.productName}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm text-white">{item.productName}</p>
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
                    ×{item.quantity}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

function StatusPill({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "subtle";
}) {
  return (
    <span
      className={`
        rounded-full px-3 py-1 text-[0.55rem] uppercase tracking-[0.35em]
        ${
          variant === "default"
            ? "border border-white/10 bg-white/5 text-white/70"
            : "text-white/40"
        }
      `}
    >
      {label}
    </span>
  );
}
