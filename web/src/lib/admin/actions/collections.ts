"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Locale, ProductStatus } from "@prisma/client";

function normalizeSlug(input: string) {
  return input.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

function toPayload(formData: FormData) {
  return {
    slug: String(formData.get("slug") || ""),
    titleFr: String(formData.get("titleFr") || ""),
    titleEn: String(formData.get("titleEn") || ""),
    subtitleFr: formData.get("subtitleFr")?.toString() || undefined,
    subtitleEn: formData.get("subtitleEn")?.toString() || undefined,
    status: (formData.get("status") as ProductStatus) ?? ProductStatus.DRAFT,
    releaseDate: formData.get("releaseDate")?.toString() || null,
  };
}

export async function createCollection(formData: FormData) {
  const payload = toPayload(formData);
  const slug = normalizeSlug(payload.slug);
  if (!slug) throw new Error("Slug is required");
  const releaseDate = payload.releaseDate ? new Date(payload.releaseDate) : null;

  await prisma.collection.create({
    data: {
      slug,
      status: payload.status,
      releaseDate,
      translations: {
        create: [
          {
            locale: Locale.FR,
            title: payload.titleFr || payload.titleEn,
            subtitle: payload.subtitleFr ?? null,
          },
          {
            locale: Locale.EN,
            title: payload.titleEn || payload.titleFr,
            subtitle: payload.subtitleEn ?? null,
          },
        ],
      },
    },
  });

  revalidatePath("/admin/collections");
  revalidateTag("collections", "page");
  redirect(`/admin/collections/${slug}`);
}

export async function updateCollection(formData: FormData) {
  const payload = { ...toPayload(formData), id: String(formData.get("id")) };
  const slug = normalizeSlug(payload.slug);
  if (!slug) throw new Error("Slug is required");
  const releaseDate = payload.releaseDate ? new Date(payload.releaseDate) : null;

  await prisma.collection.update({
    where: { id: payload.id },
    data: {
      slug,
      status: payload.status,
      releaseDate,
      translations: {
        upsert: [
          {
            where: { collectionId_locale: { collectionId: payload.id, locale: Locale.FR } },
            update: { title: payload.titleFr || payload.titleEn, subtitle: payload.subtitleFr ?? null },
            create: { locale: Locale.FR, title: payload.titleFr || payload.titleEn, subtitle: payload.subtitleFr ?? null },
          },
          {
            where: { collectionId_locale: { collectionId: payload.id, locale: Locale.EN } },
            update: { title: payload.titleEn || payload.titleFr, subtitle: payload.subtitleEn ?? null },
            create: { locale: Locale.EN, title: payload.titleEn || payload.titleFr, subtitle: payload.subtitleEn ?? null },
          },
        ],
      },
    },
  });

  revalidatePath("/admin/collections");
  revalidateTag("collections", "page");
  redirect(`/admin/collections/${slug}`);
}

export async function deleteCollection(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.collection.delete({ where: { id } });
  revalidatePath("/admin/collections");
  revalidateTag("collections", "page");
}

function intOrZero(value: FormDataEntryValue | null) {
  const parsed = Number.parseInt(String(value ?? "0"), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

type LocalePayload = { title?: string; body?: string; caption?: string };

function translationPayload(formData: FormData, prefix: string): LocalePayload {
  return {
    title: formData.get(`${prefix}Title`)?.toString() || undefined,
    body: formData.get(`${prefix}Body`)?.toString() || undefined,
    caption: formData.get(`${prefix}Caption`)?.toString() || undefined,
  };
}

export async function createCollectionSection(formData: FormData) {
  const collectionId = formData.get("collectionId")?.toString();
  const layout = formData.get("layout")?.toString() || "text";
  const assetUrl = formData.get("url")?.toString();
  const sortOrder = intOrZero(formData.get("sortOrder"));
  if (!collectionId) throw new Error("Collection is required");

  const fr = translationPayload(formData, "fr");
  const en = translationPayload(formData, "en");

  const assetId = assetUrl
    ? (
      await prisma.mediaAsset.create({ data: { type: "IMAGE", url: assetUrl, alt: fr.title ?? en.title ?? "" } })
    ).id
    : undefined;

  await prisma.collectionSection.create({
    data: {
      collectionId,
      layout,
      sortOrder,
      assetId,
      translations: {
        create: [
          { locale: Locale.FR, heading: fr.title ?? en.title ?? "", body: fr.body ?? null, caption: fr.caption ?? null },
          { locale: Locale.EN, heading: en.title ?? fr.title ?? "", body: en.body ?? null, caption: en.caption ?? null },
        ],
      },
    },
  });

  revalidatePath(`/admin/collections/${formData.get("slug") ?? ""}`);
  revalidatePath("/admin/collections");
  revalidateTag("collections", "page");
}

export async function updateCollectionSection(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Section id is required");
  const layout = formData.get("layout")?.toString() || "text";
  const assetUrl = formData.get("url")?.toString();
  const sortOrder = intOrZero(formData.get("sortOrder"));

  const fr = translationPayload(formData, "fr");
  const en = translationPayload(formData, "en");

  const section = await prisma.collectionSection.findUnique({ where: { id }, include: { asset: true } });
  if (!section) throw new Error("Section not found");

  await prisma.collectionSection.update({
    where: { id },
    data: {
      layout,
      sortOrder,
      translations: {
        upsert: [
          {
            where: { sectionId_locale: { sectionId: id, locale: Locale.FR } },
            update: { heading: fr.title ?? en.title ?? "", body: fr.body ?? null, caption: fr.caption ?? null },
            create: { locale: Locale.FR, heading: fr.title ?? en.title ?? "", body: fr.body ?? null, caption: fr.caption ?? null },
          },
          {
            where: { sectionId_locale: { sectionId: id, locale: Locale.EN } },
            update: { heading: en.title ?? fr.title ?? "", body: en.body ?? null, caption: en.caption ?? null },
            create: { locale: Locale.EN, heading: en.title ?? fr.title ?? "", body: en.body ?? null, caption: en.caption ?? null },
          },
        ],
      },
      asset: assetUrl
        ? {
          upsert: {
            update: { url: assetUrl, alt: fr.title ?? en.title ?? section.asset?.alt ?? "" },
            create: { type: "IMAGE", url: assetUrl, alt: fr.title ?? en.title ?? "" },
          },
        }
        : undefined,
    },
  });

  revalidatePath(`/admin/collections/${formData.get("slug") ?? ""}`);
  revalidatePath("/admin/collections");
  revalidateTag("collections", "page");
}

export async function deleteCollectionSection(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Section id is required");

  const section = await prisma.collectionSection.delete({ where: { id }, include: { asset: true } });
  if (section.assetId) {
    const remaining = await prisma.collectionSection.count({ where: { assetId: section.assetId } });
    if (remaining === 0) {
      await prisma.mediaAsset.delete({ where: { id: section.assetId } });
    }
  }

  revalidatePath(`/admin/collections/${formData.get("slug") ?? ""}`);
  revalidatePath("/admin/collections");
  revalidateTag("collections", "page");
}

export async function createLookbookSlide(formData: FormData) {
  const collectionId = formData.get("collectionId")?.toString();
  const url = formData.get("url")?.toString();
  if (!collectionId) throw new Error("Collection is required");
  if (!url) throw new Error("Image URL is required");

  const fr = translationPayload(formData, "fr");
  const en = translationPayload(formData, "en");
  const sortOrder = intOrZero(formData.get("sortOrder"));
  const hotspotProductId = formData.get("hotspotProductId")?.toString() || undefined;

  const asset = await prisma.mediaAsset.create({
    data: {
      type: "IMAGE",
      url,
      alt: fr.title ?? en.title ?? "",
    },
  });

  await prisma.lookbookSlide.create({
    data: {
      collectionId,
      assetId: asset.id,
      sortOrder,
      hotspotProductId,
      translations: {
        create: [
          { locale: Locale.FR, title: fr.title ?? en.title ?? "", body: fr.body ?? null, caption: fr.caption ?? null },
          { locale: Locale.EN, title: en.title ?? fr.title ?? "", body: en.body ?? null, caption: en.caption ?? null },
        ],
      },
    },
  });

  revalidatePath(`/admin/collections/${formData.get("slug") ?? ""}`);
  revalidatePath("/admin/collections");
  revalidateTag("collections", "page");
}

export async function updateLookbookSlide(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Slide id is required");
  const url = formData.get("url")?.toString();
  if (!url) throw new Error("Image URL is required");

  const fr = translationPayload(formData, "fr");
  const en = translationPayload(formData, "en");
  const sortOrder = intOrZero(formData.get("sortOrder"));
  const hotspotProductId = formData.get("hotspotProductId")?.toString() || null;

  const slide = await prisma.lookbookSlide.findUnique({ where: { id }, include: { asset: true } });
  if (!slide) throw new Error("Slide not found");

  await prisma.lookbookSlide.update({
    where: { id },
    data: {
      sortOrder,
      hotspotProductId,
      translations: {
        upsert: [
          {
            where: { slideId_locale: { slideId: id, locale: Locale.FR } },
            update: { title: fr.title ?? en.title ?? "", body: fr.body ?? null, caption: fr.caption ?? null },
            create: { locale: Locale.FR, title: fr.title ?? en.title ?? "", body: fr.body ?? null, caption: fr.caption ?? null },
          },
          {
            where: { slideId_locale: { slideId: id, locale: Locale.EN } },
            update: { title: en.title ?? fr.title ?? "", body: en.body ?? null, caption: en.caption ?? null },
            create: { locale: Locale.EN, title: en.title ?? fr.title ?? "", body: en.body ?? null, caption: en.caption ?? null },
          },
        ],
      },
      asset: {
        update: {
          url,
          alt: fr.title ?? en.title ?? slide.asset.alt ?? "",
        },
      },
    },
  });

  revalidatePath(`/admin/collections/${formData.get("slug") ?? ""}`);
  revalidatePath("/admin/collections");
}

export async function deleteLookbookSlide(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Slide id is required");

  const slide = await prisma.lookbookSlide.delete({ where: { id }, include: { asset: true } });
  const remainingAssetRefs = await prisma.lookbookSlide.count({ where: { assetId: slide.assetId } });
  if (remainingAssetRefs === 0) {
    await prisma.mediaAsset.delete({ where: { id: slide.assetId } });
  }

  revalidatePath(`/admin/collections/${formData.get("slug") ?? ""}`);
  revalidatePath("/admin/collections");
}

// ═══════════════════════════════════════════════════════════════
// COLLECTION PRODUCTS (ITEMS)
// ═══════════════════════════════════════════════════════════════

export async function addProductToCollection(formData: FormData) {
  const collectionId = formData.get("collectionId")?.toString();
  const productId = formData.get("productId")?.toString();
  const slug = formData.get("slug")?.toString();
  if (!collectionId || !productId) throw new Error("Collection and Product IDs are required");

  // Check if already exists
  const existing = await prisma.collectionItem.findFirst({
    where: { collectionId, productId },
  });
  if (existing) {
    revalidatePath(`/admin/collections/${slug ?? ""}`);
    return;
  }

  // Get max sort order
  const maxSort = await prisma.collectionItem.aggregate({
    where: { collectionId },
    _max: { sortOrder: true },
  });

  await prisma.collectionItem.create({
    data: {
      collectionId,
      productId,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      highlighted: false,
    },
  });

  revalidatePath(`/admin/collections/${slug ?? ""}`);
  revalidatePath("/admin/collections");
  revalidateTag("collections", "page");
}

export async function removeProductFromCollection(formData: FormData) {
  const collectionId = formData.get("collectionId")?.toString();
  const productId = formData.get("productId")?.toString();
  const slug = formData.get("slug")?.toString();
  if (!collectionId || !productId) throw new Error("Collection and Product IDs are required");

  await prisma.collectionItem.deleteMany({
    where: { collectionId, productId },
  });

  revalidatePath(`/admin/collections/${slug ?? ""}`);
  revalidatePath("/admin/collections");
  revalidateTag("collections", "page");
}

export async function toggleProductHighlight(formData: FormData) {
  const collectionId = formData.get("collectionId")?.toString();
  const productId = formData.get("productId")?.toString();
  const slug = formData.get("slug")?.toString();
  if (!collectionId || !productId) throw new Error("Collection and Product IDs are required");

  const item = await prisma.collectionItem.findFirst({
    where: { collectionId, productId },
  });
  if (!item) throw new Error("Collection item not found");

  await prisma.collectionItem.update({
    where: { id: item.id },
    data: { highlighted: !item.highlighted },
  });

  revalidatePath(`/admin/collections/${slug ?? ""}`);
  revalidatePath("/admin/collections");
  revalidateTag("collections", "page");
}

export async function updateProductSortOrder(formData: FormData) {
  const itemId = formData.get("itemId")?.toString();
  const sortOrder = intOrZero(formData.get("sortOrder"));
  const slug = formData.get("slug")?.toString();
  if (!itemId) throw new Error("Item ID is required");

  await prisma.collectionItem.update({
    where: { id: itemId },
    data: { sortOrder },
  });

  revalidatePath(`/admin/collections/${slug ?? ""}`);
  revalidatePath("/admin/collections");
}


