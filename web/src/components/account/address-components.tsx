"use client";

import { useState, useTransition } from "react";
import type { Address } from "@prisma/client";
import type { Locale } from "@/lib/i18n/config";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type AddressInput,
} from "@/lib/address/actions";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Address Form Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type AddressFormProps = {
  locale: Locale;
  address?: Address | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "modal" | "inline";
};

const COUNTRIES = [
  { code: "FR", name: { en: "France", fr: "France" } },
  { code: "US", name: { en: "United States", fr: "États-Unis" } },
  { code: "GB", name: { en: "United Kingdom", fr: "Royaume-Uni" } },
  { code: "DE", name: { en: "Germany", fr: "Allemagne" } },
  { code: "IT", name: { en: "Italy", fr: "Italie" } },
  { code: "ES", name: { en: "Spain", fr: "Espagne" } },
  { code: "CH", name: { en: "Switzerland", fr: "Suisse" } },
  { code: "BE", name: { en: "Belgium", fr: "Belgique" } },
  { code: "NL", name: { en: "Netherlands", fr: "Pays-Bas" } },
  { code: "JP", name: { en: "Japan", fr: "Japon" } },
  { code: "CN", name: { en: "China", fr: "Chine" } },
  { code: "AE", name: { en: "UAE", fr: "Émirats Arabes Unis" } },
  { code: "SG", name: { en: "Singapore", fr: "Singapour" } },
  { code: "AU", name: { en: "Australia", fr: "Australie" } },
];

export function AddressForm({
  locale,
  address,
  onSuccess,
  onCancel,
  variant = "inline",
}: AddressFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!address;

  const copy =
    locale === "fr"
      ? {
          title: isEditing ? "Modifier l'adresse" : "Nouvelle adresse",
          label: "Nom de l'adresse",
          labelPlaceholder: "Maison, Bureau, etc.",
          firstName: "Prénom",
          lastName: "Nom",
          line1: "Adresse",
          line2: "Appartement, étage, etc.",
          city: "Ville",
          region: "Région / État",
          postalCode: "Code postal",
          country: "Pays",
          phone: "Téléphone",
          setDefault: "Définir comme adresse par défaut",
          save: isEditing ? "Enregistrer" : "Ajouter l'adresse",
          cancel: "Annuler",
          saving: "Enregistrement...",
        }
      : {
          title: isEditing ? "Edit Address" : "New Address",
          label: "Address name",
          labelPlaceholder: "Home, Office, etc.",
          firstName: "First name",
          lastName: "Last name",
          line1: "Street address",
          line2: "Apt, suite, floor",
          city: "City",
          region: "State / Region",
          postalCode: "Postal code",
          country: "Country",
          phone: "Phone",
          setDefault: "Set as default address",
          save: isEditing ? "Save changes" : "Add address",
          cancel: "Cancel",
          saving: "Saving...",
        };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const input: AddressInput = {
      label: (formData.get("label") as string) || undefined,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      line1: formData.get("line1") as string,
      line2: (formData.get("line2") as string) || undefined,
      city: formData.get("city") as string,
      region: (formData.get("region") as string) || undefined,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      phone: (formData.get("phone") as string) || undefined,
      isDefault: formData.get("isDefault") === "on",
    };

    startTransition(async () => {
      const result = isEditing
        ? await updateAddress(address.id, input, locale)
        : await createAddress(input, locale);

      if (result.ok) {
        onSuccess?.();
      } else {
        setError(result.error ?? "An error occurred");
      }
    });
  };

  const inputClasses =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors";
  const labelClasses = "block text-[0.65rem] uppercase tracking-[0.4em] text-white/50 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {variant === "inline" && (
        <h3 className="font-display text-xl text-white">{copy.title}</h3>
      )}

      {/* Label */}
      <div>
        <label className={labelClasses}>{copy.label}</label>
        <input
          type="text"
          name="label"
          defaultValue={address?.label ?? ""}
          placeholder={copy.labelPlaceholder}
          className={inputClasses}
        />
      </div>

      {/* Name row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>{copy.firstName}</label>
          <input
            type="text"
            name="firstName"
            defaultValue={address?.firstName ?? ""}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>{copy.lastName}</label>
          <input
            type="text"
            name="lastName"
            defaultValue={address?.lastName ?? ""}
            required
            className={inputClasses}
          />
        </div>
      </div>

      {/* Address lines */}
      <div>
        <label className={labelClasses}>{copy.line1}</label>
        <input
          type="text"
          name="line1"
          defaultValue={address?.line1 ?? ""}
          required
          className={inputClasses}
        />
      </div>
      <div>
        <label className={labelClasses}>{copy.line2}</label>
        <input
          type="text"
          name="line2"
          defaultValue={address?.line2 ?? ""}
          placeholder={copy.line2}
          className={inputClasses}
        />
      </div>

      {/* City & Postal */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>{copy.city}</label>
          <input
            type="text"
            name="city"
            defaultValue={address?.city ?? ""}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>{copy.postalCode}</label>
          <input
            type="text"
            name="postalCode"
            defaultValue={address?.postalCode ?? ""}
            required
            className={inputClasses}
          />
        </div>
      </div>

      {/* Region & Country */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>{copy.region}</label>
          <input
            type="text"
            name="region"
            defaultValue={address?.region ?? ""}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>{copy.country}</label>
          <select
            name="country"
            defaultValue={address?.country ?? "FR"}
            required
            className={inputClasses}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name[locale]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className={labelClasses}>{copy.phone}</label>
        <input
          type="tel"
          name="phone"
          defaultValue={address?.phone ?? ""}
          className={inputClasses}
        />
      </div>

      {/* Default checkbox */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            name="isDefault"
            defaultChecked={address?.isDefault ?? false}
            className="peer sr-only"
          />
          <div className="h-5 w-5 rounded-md border border-white/20 bg-white/5 transition-all peer-checked:border-white/40 peer-checked:bg-white/10" />
          <svg
            className="absolute left-1 top-1 h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
          {copy.setDefault}
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-50"
          >
            {copy.cancel}
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-white px-8 py-3 text-xs uppercase tracking-[0.4em] text-black transition hover:bg-white/90 disabled:opacity-50"
        >
          {isPending ? copy.saving : copy.save}
        </button>
      </div>
    </form>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Address Card Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type AddressCardProps = {
  address: Address;
  locale: Locale;
  onEdit?: () => void;
  onSelect?: () => void;
  selected?: boolean;
  selectable?: boolean;
  showActions?: boolean;
};

export function AddressCard({
  address,
  locale,
  onEdit,
  onSelect,
  selected = false,
  selectable = false,
  showActions = true,
}: AddressCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const copy =
    locale === "fr"
      ? {
          default: "Par défaut",
          edit: "Modifier",
          delete: "Supprimer",
          setDefault: "Définir par défaut",
          confirmDelete: "Confirmer la suppression ?",
          yes: "Oui",
          no: "Non",
          phone: "Tél",
        }
      : {
          default: "Default",
          edit: "Edit",
          delete: "Delete",
          setDefault: "Set as default",
          confirmDelete: "Confirm delete?",
          yes: "Yes",
          no: "No",
          phone: "Phone",
        };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteAddress(address.id, locale);
      setShowConfirmDelete(false);
    });
  };

  const handleSetDefault = () => {
    startTransition(async () => {
      await setDefaultAddress(address.id, locale);
    });
  };

  const countryName =
    COUNTRIES.find((c) => c.code === address.country)?.name[locale] ?? address.country;

  return (
    <div
      className={`
        group relative rounded-2xl border p-5 transition-all duration-300
        ${
          selected
            ? "border-white/40 bg-white/10 ring-1 ring-white/20"
            : "border-white/10 bg-white/5 hover:border-white/20"
        }
        ${selectable ? "cursor-pointer" : ""}
        ${isPending ? "opacity-50" : ""}
      `}
      onClick={selectable ? onSelect : undefined}
    >
      {/* Default badge */}
      {address.isDefault && (
        <div className="absolute -top-2 right-4">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[0.55rem] uppercase tracking-[0.4em] text-white/70 backdrop-blur-sm">
            {copy.default}
          </span>
        </div>
      )}

      {/* Selection indicator */}
      {selectable && (
        <div className="absolute left-4 top-4">
          <div
            className={`h-5 w-5 rounded-full border-2 transition-all ${
              selected
                ? "border-white bg-white"
                : "border-white/30 group-hover:border-white/50"
            }`}
          >
            {selected && (
              <svg
                className="h-full w-full p-0.5 text-black"
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
      )}

      <div className={selectable ? "pl-8" : ""}>
        {/* Label */}
        <p className="font-display text-lg text-white">
          {address.label ?? address.city}
        </p>

        {/* Name & Address */}
        <div className="mt-3 space-y-1 text-sm text-white/70">
          <p className="font-medium text-white/90">
            {address.firstName} {address.lastName}
          </p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.postalCode} {address.city}
            {address.region && `, ${address.region}`}
          </p>
          <p>{countryName}</p>
        </div>

        {/* Phone */}
        {address.phone && (
          <p className="mt-3 text-xs uppercase tracking-[0.35em] text-white/50">
            {copy.phone} · {address.phone}
          </p>
        )}

        {/* Actions */}
        {showActions && !showConfirmDelete && (
          <div className="mt-4 flex flex-wrap gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                disabled={isPending}
                className="rounded-full border border-white/20 px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.35em] text-white/70 transition hover:border-white/40 hover:text-white"
              >
                {copy.edit}
              </button>
            )}
            {!address.isDefault && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetDefault();
                }}
                disabled={isPending}
                className="rounded-full border border-white/20 px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.35em] text-white/70 transition hover:border-white/40 hover:text-white"
              >
                {copy.setDefault}
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmDelete(true);
              }}
              disabled={isPending}
              className="rounded-full border border-red-500/30 px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.35em] text-red-400/70 transition hover:border-red-500/50 hover:text-red-400"
            >
              {copy.delete}
            </button>
          </div>
        )}

        {/* Delete confirmation */}
        {showConfirmDelete && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-white/70">{copy.confirmDelete}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isPending}
              className="rounded-full bg-red-500/20 px-3 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-red-400 transition hover:bg-red-500/30"
            >
              {copy.yes}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmDelete(false);
              }}
              disabled={isPending}
              className="rounded-full border border-white/20 px-3 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-white/70 transition hover:border-white/40"
            >
              {copy.no}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Address Selector Component (for checkout)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type AddressSelectorProps = {
  addresses: Address[];
  locale: Locale;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew: () => void;
};

export function AddressSelector({
  addresses,
  locale,
  selectedId,
  onSelect,
  onAddNew,
}: AddressSelectorProps) {
  const copy =
    locale === "fr"
      ? {
          title: "Adresse de livraison",
          addNew: "Ajouter une nouvelle adresse",
          noAddresses: "Aucune adresse enregistrée",
        }
      : {
          title: "Shipping Address",
          addNew: "Add new address",
          noAddresses: "No saved addresses",
        };

  return (
    <div className="space-y-4">
      <h3 className="text-xs uppercase tracking-[0.5em] text-white/50">{copy.title}</h3>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center">
          <p className="text-sm text-white/50">{copy.noAddresses}</p>
          <button
            type="button"
            onClick={onAddNew}
            className="mt-4 rounded-full border border-white/30 px-6 py-2 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-black"
          >
            {copy.addNew}
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                locale={locale}
                selectable
                selected={selectedId === address.id}
                onSelect={() => onSelect(address.id)}
                showActions={false}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onAddNew}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 p-4 text-xs uppercase tracking-[0.4em] text-white/60 transition hover:border-white/40 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {copy.addNew}
          </button>
        </>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Address Modal Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type AddressModalProps = {
  locale: Locale;
  address?: Address | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function AddressModal({
  locale,
  address,
  isOpen,
  onClose,
  onSuccess,
}: AddressModalProps) {
  if (!isOpen) return null;

  const title = address
    ? locale === "fr"
      ? "Modifier l'adresse"
      : "Edit Address"
    : locale === "fr"
      ? "Nouvelle adresse"
      : "New Address";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0a0b14] p-8 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="mb-6 font-display text-2xl text-white">{title}</h2>

        <AddressForm
          locale={locale}
          address={address}
          variant="modal"
          onCancel={onClose}
          onSuccess={() => {
            onSuccess?.();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
