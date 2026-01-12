"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n/config";

export type AddressInput = {
  label?: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
};

type ActionResult<T = void> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export async function getUserAddresses() {
  const user = await getCurrentUser();
  if (!user) return [];

  return prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { label: "asc" }],
  });
}

export async function getAddressById(id: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  return prisma.address.findFirst({
    where: { id, userId: user.id },
  });
}

export async function createAddress(
  input: AddressInput,
  locale: Locale
): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      error: locale === "fr" ? "Veuillez vous connecter" : "Please sign in",
    };
  }

  try {
    // If this address should be default, unset other defaults first
    if (input.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    // If this is the first address, make it default
    const existingCount = await prisma.address.count({
      where: { userId: user.id },
    });

    const address = await prisma.address.create({
      data: {
        ...input,
        isDefault: input.isDefault || existingCount === 0,
        userId: user.id,
      },
    });

    revalidatePath(`/${locale}/account`);
    revalidatePath(`/${locale}/cart`);

    return { ok: true, data: { id: address.id } };
  } catch (error) {
    console.error("Failed to create address:", error);
    return {
      ok: false,
      error:
        locale === "fr"
          ? "Impossible de créer l'adresse"
          : "Failed to create address",
    };
  }
}

export async function updateAddress(
  id: string,
  input: Partial<AddressInput>,
  locale: Locale
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      error: locale === "fr" ? "Veuillez vous connecter" : "Please sign in",
    };
  }

  try {
    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return {
        ok: false,
        error: locale === "fr" ? "Adresse introuvable" : "Address not found",
      };
    }

    // If setting as default, unset others first
    if (input.isDefault && !existing.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    await prisma.address.update({
      where: { id },
      data: input,
    });

    revalidatePath(`/${locale}/account`);
    revalidatePath(`/${locale}/cart`);

    return { ok: true };
  } catch (error) {
    console.error("Failed to update address:", error);
    return {
      ok: false,
      error:
        locale === "fr"
          ? "Impossible de modifier l'adresse"
          : "Failed to update address",
    };
  }
}

export async function deleteAddress(
  id: string,
  locale: Locale
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      error: locale === "fr" ? "Veuillez vous connecter" : "Please sign in",
    };
  }

  try {
    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return {
        ok: false,
        error: locale === "fr" ? "Adresse introuvable" : "Address not found",
      };
    }

    await prisma.address.delete({ where: { id } });

    // If deleted address was default, set another as default
    if (existing.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { userId: user.id },
        orderBy: { label: "asc" },
      });
      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath(`/${locale}/account`);
    revalidatePath(`/${locale}/cart`);

    return { ok: true };
  } catch (error) {
    console.error("Failed to delete address:", error);
    return {
      ok: false,
      error:
        locale === "fr"
          ? "Impossible de supprimer l'adresse"
          : "Failed to delete address",
    };
  }
}

export async function setDefaultAddress(
  id: string,
  locale: Locale
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      error: locale === "fr" ? "Veuillez vous connecter" : "Please sign in",
    };
  }

  try {
    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return {
        ok: false,
        error: locale === "fr" ? "Adresse introuvable" : "Address not found",
      };
    }

    // Unset all defaults for user
    await prisma.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });

    // Set this one as default
    await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    revalidatePath(`/${locale}/account`);
    revalidatePath(`/${locale}/cart`);

    return { ok: true };
  } catch (error) {
    console.error("Failed to set default address:", error);
    return {
      ok: false,
      error:
        locale === "fr"
          ? "Impossible de définir l'adresse par défaut"
          : "Failed to set default address",
    };
  }
}
