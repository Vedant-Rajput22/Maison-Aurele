"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Currency, Locale, ProductStatus } from "@prisma/client";

function normalizeSlug(input: string) {
  return input.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

function toPayload(formData: FormData) {
  return {
    slug: String(formData.get("slug") || ""),
    status: (formData.get("status") as ProductStatus) ?? ProductStatus.DRAFT,
    skuPrefix: formData.get("skuPrefix")?.toString() || undefined,
    nameFr: String(formData.get("nameFr") || ""),
    nameEn: String(formData.get("nameEn") || ""),
    descriptionFr: formData.get("descriptionFr")?.toString() || undefined,
    descriptionEn: formData.get("descriptionEn")?.toString() || undefined,
  };
}

export async function createProduct(formData: FormData) {
  const payload = toPayload(formData);
  const slug = normalizeSlug(payload.slug);
  if (!slug) throw new Error("Slug is required");

  await prisma.product.create({
    data: {
      slug,
      status: payload.status,
      skuPrefix: payload.skuPrefix,
      translations: {
        create: [
          {
            locale: Locale.FR,
            name: payload.nameFr || payload.nameEn,
            description: payload.descriptionFr ?? null,
          },
          {
            locale: Locale.EN,
            name: payload.nameEn || payload.nameFr,
            description: payload.descriptionEn ?? null,
          },
        ],
      },
    },
  });

  revalidatePath("/admin/products");
  revalidateTag("products", "page");
  redirect(`/admin/products/${slug}`);
}

export async function updateProduct(formData: FormData) {
  const payload = { ...toPayload(formData), id: String(formData.get("id")) };
  const slug = normalizeSlug(payload.slug);
  if (!slug) throw new Error("Slug is required");

  await prisma.product.update({
    where: { id: payload.id },
    data: {
      slug,
      status: payload.status,
      skuPrefix: payload.skuPrefix,
      translations: {
        upsert: [
          {
            where: { productId_locale: { productId: payload.id, locale: Locale.FR } },
            update: { name: payload.nameFr || payload.nameEn, description: payload.descriptionFr ?? null },
            create: { locale: Locale.FR, name: payload.nameFr || payload.nameEn, description: payload.descriptionFr ?? null },
          },
          {
            where: { productId_locale: { productId: payload.id, locale: Locale.EN } },
            update: { name: payload.nameEn || payload.nameFr, description: payload.descriptionEn ?? null },
            create: { locale: Locale.EN, name: payload.nameEn || payload.nameFr, description: payload.descriptionEn ?? null },
          },
        ],
      },
    },
  });

  revalidatePath("/admin/products");
  revalidateTag("products", "page");
  redirect(`/admin/products/${slug}`);
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidateTag("products", "page");
}

function parsePrice(value: FormDataEntryValue | null) {
  if (value === null) return null;
  const asNumber = Number.parseFloat(String(value));
  if (Number.isNaN(asNumber)) return null;
  return Math.round(asNumber * 100);
}

function parseIntOrNull(value: FormDataEntryValue | null) {
  if (value === null || value === undefined) return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toDate(value: FormDataEntryValue | null) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

function variantPayload(formData: FormData) {
  return {
    id: formData.get("id")?.toString(),
    productId: formData.get("productId")?.toString(),
    sku: formData.get("sku")?.toString() || "",
    color: formData.get("color")?.toString() || "",
    size: formData.get("size")?.toString() || undefined,
    materialMix: formData.get("materialMix")?.toString() || undefined,
    priceCents: parsePrice(formData.get("price")) ?? 0,
    compareAtCents: parsePrice(formData.get("compareAt")),
    currency: (formData.get("currency")?.toString() as Currency) || Currency.EUR,
    availableFrom: toDate(formData.get("availableFrom")),
    personalizationAllowed: formData.get("personalizationAllowed") === "on",
    weightGrams: parseIntOrNull(formData.get("weightGrams")),
    quantity: parseIntOrNull(formData.get("quantity")) ?? 0,
  };
}

export async function createVariant(formData: FormData) {
  const payload = variantPayload(formData);
  if (!payload.productId) throw new Error("Product is required");
  if (!payload.sku) throw new Error("SKU is required");
  if (!payload.color) throw new Error("Color is required");

  await prisma.productVariant.create({
    data: {
      productId: payload.productId,
      sku: payload.sku,
      color: payload.color,
      size: payload.size,
      materialMix: payload.materialMix,
      priceCents: payload.priceCents,
      compareAtCents: payload.compareAtCents ?? undefined,
      currency: payload.currency,
      availableFrom: payload.availableFrom,
      personalizationAllowed: payload.personalizationAllowed,
      weightGrams: payload.weightGrams ?? undefined,
      inventory: { create: { quantity: payload.quantity, reserved: 0 } },
    },
  });

  revalidatePath("/admin/products");
  revalidateTag("products", "page");
}

export async function updateVariant(formData: FormData) {
  const payload = variantPayload(formData);
  if (!payload.id) throw new Error("Variant id is required");
  if (!payload.productId) throw new Error("Product is required");
  if (!payload.sku) throw new Error("SKU is required");
  if (!payload.color) throw new Error("Color is required");

  await prisma.productVariant.update({
    where: { id: payload.id },
    data: {
      sku: payload.sku,
      color: payload.color,
      size: payload.size,
      materialMix: payload.materialMix,
      priceCents: payload.priceCents,
      compareAtCents: payload.compareAtCents ?? undefined,
      currency: payload.currency,
      availableFrom: payload.availableFrom,
      personalizationAllowed: payload.personalizationAllowed,
      weightGrams: payload.weightGrams ?? undefined,
      inventory: {
        upsert: {
          create: { quantity: payload.quantity, reserved: 0 },
          update: { quantity: payload.quantity },
        },
      },
    },
  });

  revalidatePath("/admin/products");
  revalidateTag("products", "page");
}

export async function deleteVariant(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Variant id is required");
  await prisma.productVariant.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidateTag("products", "page");
}

function mediaPayload(formData: FormData) {
  return {
    id: formData.get("id")?.toString(),
    productId: formData.get("productId")?.toString(),
    url: formData.get("url")?.toString() || "",
    alt: formData.get("alt")?.toString() || undefined,
    placement: formData.get("placement")?.toString() || "gallery",
    sortOrder: parseIntOrNull(formData.get("sortOrder")) ?? 0,
    type: (formData.get("type")?.toString() || "IMAGE") as "IMAGE" | "VIDEO",
  };
}

export async function createProductMedia(formData: FormData) {
  const payload = mediaPayload(formData);
  if (!payload.productId) throw new Error("Product is required");
  if (!payload.url) throw new Error("Media URL is required");

  const asset = await prisma.mediaAsset.create({
    data: {
      type: payload.type,
      url: payload.url,
      alt: payload.alt,
    },
  });

  await prisma.productMedia.create({
    data: {
      productId: payload.productId,
      assetId: asset.id,
      placement: payload.placement,
      sortOrder: payload.sortOrder,
    },
  });

  revalidatePath("/admin/products");
  revalidateTag("products", "page");
}

export async function updateProductMedia(formData: FormData) {
  const payload = mediaPayload(formData);
  if (!payload.id) throw new Error("Media id is required");

  const existing = await prisma.productMedia.findUnique({
    where: { id: payload.id },
    include: { asset: true },
  });
  if (!existing) throw new Error("Media not found");

  await prisma.productMedia.update({
    where: { id: payload.id },
    data: {
      placement: payload.placement,
      sortOrder: payload.sortOrder,
      asset: {
        update: {
          url: payload.url || existing.asset.url,
          alt: payload.alt ?? existing.asset.alt,
          type: payload.type,
        },
      },
    },
  });

  revalidatePath("/admin/products");
  revalidateTag("products", "page");
}

export async function deleteProductMedia(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Media id is required");

  const media = await prisma.productMedia.delete({
    where: { id },
    include: { asset: true },
  });

  const remainingRefs = await prisma.productMedia.count({ where: { assetId: media.assetId } });
  const remainingVariantRefs = await prisma.productVariantMedia.count({ where: { assetId: media.assetId } });
  if (remainingRefs === 0 && remainingVariantRefs === 0) {
    await prisma.mediaAsset.delete({ where: { id: media.assetId } });
  }

  revalidatePath("/admin/products");
  revalidateTag("products", "page");
}


