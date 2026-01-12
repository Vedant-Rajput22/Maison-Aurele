"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditorialCategory, Locale, ProductStatus, Prisma } from "@prisma/client";

type BlockInput = {
  type?: string;
  assetId?: string;
  sortOrder?: number;
  data?: unknown;
  headlineFr?: string | null;
  headlineEn?: string | null;
  bodyFr?: string | null;
  bodyEn?: string | null;
  captionFr?: string | null;
  captionEn?: string | null;
};

function normalizeSlug(input: string) {
  return input.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

function parseRichText(raw: string | null | undefined) {
  if (!raw) return [] as object[];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const paragraphs = raw
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
    return paragraphs.map((text) => ({ type: "paragraph", children: [{ text }] }));
  }
}

function parseBlocks(raw: string | null | undefined): BlockInput[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as BlockInput[];
    }
    return [];
  } catch {
    return [];
  }
}

function toJsonValue(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value as Prisma.InputJsonValue;
}

function parseFeatures(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,\n]/)
    .map((id) => id.trim())
    .filter(Boolean);
}

function toPayload(formData: FormData) {
  return {
    slug: String(formData.get("slug") || ""),
    category: (formData.get("category") as EditorialCategory) ?? EditorialCategory.JOURNAL,
    status: (formData.get("status") as ProductStatus) ?? ProductStatus.DRAFT,
    titleFr: String(formData.get("titleFr") || ""),
    titleEn: String(formData.get("titleEn") || ""),
    standfirstFr: formData.get("standfirstFr")?.toString() || undefined,
    standfirstEn: formData.get("standfirstEn")?.toString() || undefined,
    publishAt: formData.get("publishAt")?.toString() || null,
    heroAssetId: formData.get("heroAssetId")?.toString() || null,
    bodyFr: formData.get("bodyFr")?.toString() || null,
    bodyEn: formData.get("bodyEn")?.toString() || null,
    blocksJson: formData.get("blocks")?.toString() || null,
    featureProducts: formData.get("featureProducts")?.toString() || null,
  };
}

function buildBlocks(blocks: BlockInput[]) {
  return blocks.map((block, index) => ({
    type: block.type || "story",
    asset: block.assetId ? { connect: { id: block.assetId } } : undefined,
    data: toJsonValue(block.data),
    sortOrder: typeof block.sortOrder === "number" ? block.sortOrder : index,
    translations: {
      create: [
        {
          locale: Locale.FR,
          headline: block.headlineFr ?? null,
          body: block.bodyFr ?? null,
          caption: block.captionFr ?? null,
        },
        {
          locale: Locale.EN,
          headline: block.headlineEn ?? null,
          body: block.bodyEn ?? null,
          caption: block.captionEn ?? null,
        },
      ],
    },
  }));
}

function buildFeatures(ids: string[]) {
  return ids.map((productId, index) => ({
    product: { connect: { id: productId } },
    sortOrder: index,
  }));
}

function resolvePublishedAt(
  requested: string | null,
  status: ProductStatus,
  existing?: Date | null,
) {
  if (requested) {
    return new Date(requested);
  }
  if (status === ProductStatus.ACTIVE) {
    return existing ?? new Date();
  }
  return existing ?? null;
}

export async function createEditorialPost(formData: FormData) {
  const payload = toPayload(formData);
  const slug = normalizeSlug(payload.slug);
  if (!slug) {
    throw new Error("Slug is required");
  }

  const publishedAt = resolvePublishedAt(payload.publishAt, payload.status);
  const blocks = buildBlocks(parseBlocks(payload.blocksJson));
  const features = buildFeatures(parseFeatures(payload.featureProducts));
  const heroAssetId = payload.heroAssetId || undefined;

  await prisma.editorialPost.create({
    data: {
      slug,
      category: payload.category,
      status: payload.status,
      publishedAt,
      heroAsset: heroAssetId ? { connect: { id: heroAssetId } } : undefined,
      translations: {
        create: [
          {
            locale: Locale.FR,
            title: payload.titleFr || payload.titleEn,
            standfirst: payload.standfirstFr ?? null,
            bodyRichText: parseRichText(payload.bodyFr),
          },
          {
            locale: Locale.EN,
            title: payload.titleEn || payload.titleFr,
            standfirst: payload.standfirstEn ?? null,
            bodyRichText: parseRichText(payload.bodyEn),
          },
        ],
      },
      blocks: { create: blocks },
      featuredProducts: { create: features },
    },
  });

  revalidatePath("/admin/editorial");
  revalidateTag("journal", "page");
  revalidateTag("editorial", "page");
  redirect(`/admin/editorial/${slug}`);
}

export async function updateEditorialPost(formData: FormData) {
  const payload = { ...toPayload(formData), id: String(formData.get("id")) };
  const slug = normalizeSlug(payload.slug);
  if (!slug) {
    throw new Error("Slug is required");
  }

  const existing = await prisma.editorialPost.findUnique({
    where: { id: payload.id },
    select: { publishedAt: true },
  });

  const publishedAt = resolvePublishedAt(payload.publishAt, payload.status, existing?.publishedAt);
  const blocks = buildBlocks(parseBlocks(payload.blocksJson));
  const features = buildFeatures(parseFeatures(payload.featureProducts));
  const heroAssetId = payload.heroAssetId || null;

  await prisma.$transaction([
    prisma.editorialBlock.deleteMany({ where: { postId: payload.id } }),
    prisma.editorialFeature.deleteMany({ where: { postId: payload.id } }),
    prisma.editorialPost.update({
      where: { id: payload.id },
      data: {
        slug,
        category: payload.category,
        status: payload.status,
        publishedAt,
        heroAssetId,
        translations: {
          upsert: [
            {
              where: { postId_locale: { postId: payload.id, locale: Locale.FR } },
              update: {
                title: payload.titleFr || payload.titleEn,
                standfirst: payload.standfirstFr ?? null,
                bodyRichText: parseRichText(payload.bodyFr),
              },
              create: {
                locale: Locale.FR,
                title: payload.titleFr || payload.titleEn,
                standfirst: payload.standfirstFr ?? null,
                bodyRichText: parseRichText(payload.bodyFr),
              },
            },
            {
              where: { postId_locale: { postId: payload.id, locale: Locale.EN } },
              update: {
                title: payload.titleEn || payload.titleFr,
                standfirst: payload.standfirstEn ?? null,
                bodyRichText: parseRichText(payload.bodyEn),
              },
              create: {
                locale: Locale.EN,
                title: payload.titleEn || payload.titleFr,
                standfirst: payload.standfirstEn ?? null,
                bodyRichText: parseRichText(payload.bodyEn),
              },
            },
          ],
        },
        blocks: { create: blocks },
        featuredProducts: { create: features },
      },
    }),
  ]);

  revalidatePath("/admin/editorial");
  revalidateTag("journal", "page");
  revalidateTag("editorial", "page");
  redirect(`/admin/editorial/${slug}`);
}

export async function deleteEditorialPost(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.editorialPost.delete({ where: { id } });
  revalidatePath("/admin/editorial");
  revalidateTag("journal", "page");
  revalidateTag("editorial", "page");
}

// ═══════════════════════════════════════════════════════════════
// EDITORIAL BLOCKS
// ═══════════════════════════════════════════════════════════════

export async function createEditorialBlock(formData: FormData) {
  const postId = formData.get("postId")?.toString();
  const slug = formData.get("slug")?.toString();
  const type = formData.get("type")?.toString() || "text";
  const assetUrl = formData.get("assetUrl")?.toString();
  if (!postId) throw new Error("Post ID is required");

  // Get max sort order
  const maxSort = await prisma.editorialBlock.aggregate({
    where: { postId },
    _max: { sortOrder: true },
  });

  let assetId: string | undefined;
  if (assetUrl) {
    const asset = await prisma.mediaAsset.create({
      data: { type: "IMAGE", url: assetUrl, alt: "" },
    });
    assetId = asset.id;
  }

  const headlineFr = formData.get("headlineFr")?.toString() || null;
  const headlineEn = formData.get("headlineEn")?.toString() || null;
  const bodyFr = formData.get("bodyFr")?.toString() || null;
  const bodyEn = formData.get("bodyEn")?.toString() || null;
  const captionFr = formData.get("captionFr")?.toString() || null;
  const captionEn = formData.get("captionEn")?.toString() || null;

  await prisma.editorialBlock.create({
    data: {
      postId,
      type,
      assetId,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      translations: {
        create: [
          { locale: Locale.FR, headline: headlineFr, body: bodyFr, caption: captionFr },
          { locale: Locale.EN, headline: headlineEn, body: bodyEn, caption: captionEn },
        ],
      },
    },
  });

  revalidatePath(`/admin/editorial/${slug ?? ""}`);
  revalidatePath("/admin/editorial");
  revalidateTag("journal", "page");
}

export async function updateEditorialBlock(formData: FormData) {
  const id = formData.get("id")?.toString();
  const slug = formData.get("slug")?.toString();
  const type = formData.get("type")?.toString() || "text";
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10);
  const assetUrl = formData.get("assetUrl")?.toString();
  if (!id) throw new Error("Block ID is required");

  const headlineFr = formData.get("headlineFr")?.toString() || null;
  const headlineEn = formData.get("headlineEn")?.toString() || null;
  const bodyFr = formData.get("bodyFr")?.toString() || null;
  const bodyEn = formData.get("bodyEn")?.toString() || null;
  const captionFr = formData.get("captionFr")?.toString() || null;
  const captionEn = formData.get("captionEn")?.toString() || null;

  const block = await prisma.editorialBlock.findUnique({ where: { id }, include: { asset: true } });
  if (!block) throw new Error("Block not found");

  await prisma.editorialBlock.update({
    where: { id },
    data: {
      type,
      sortOrder,
      translations: {
        upsert: [
          {
            where: { blockId_locale: { blockId: id, locale: Locale.FR } },
            update: { headline: headlineFr, body: bodyFr, caption: captionFr },
            create: { locale: Locale.FR, headline: headlineFr, body: bodyFr, caption: captionFr },
          },
          {
            where: { blockId_locale: { blockId: id, locale: Locale.EN } },
            update: { headline: headlineEn, body: bodyEn, caption: captionEn },
            create: { locale: Locale.EN, headline: headlineEn, body: bodyEn, caption: captionEn },
          },
        ],
      },
      asset: assetUrl
        ? {
          upsert: {
            update: { url: assetUrl },
            create: { type: "IMAGE", url: assetUrl, alt: "" },
          },
        }
        : undefined,
    },
  });

  revalidatePath(`/admin/editorial/${slug ?? ""}`);
  revalidatePath("/admin/editorial");
  revalidateTag("journal", "page");
}

export async function deleteEditorialBlock(formData: FormData) {
  const id = formData.get("id")?.toString();
  const slug = formData.get("slug")?.toString();
  if (!id) throw new Error("Block ID is required");

  const block = await prisma.editorialBlock.delete({ where: { id }, include: { asset: true } });
  if (block.assetId) {
    const remaining = await prisma.editorialBlock.count({ where: { assetId: block.assetId } });
    if (remaining === 0) {
      await prisma.mediaAsset.delete({ where: { id: block.assetId } });
    }
  }

  revalidatePath(`/admin/editorial/${slug ?? ""}`);
  revalidatePath("/admin/editorial");
  revalidateTag("journal", "page");
}

// ═══════════════════════════════════════════════════════════════
// FEATURED PRODUCTS
// ═══════════════════════════════════════════════════════════════

export async function addFeaturedProduct(formData: FormData) {
  const postId = formData.get("postId")?.toString();
  const productId = formData.get("productId")?.toString();
  const slug = formData.get("slug")?.toString();
  const note = formData.get("note")?.toString() || null;
  if (!postId || !productId) throw new Error("Post ID and Product ID are required");

  // Check if already exists
  const existing = await prisma.editorialFeature.findFirst({
    where: { postId, productId },
  });
  if (existing) {
    revalidatePath(`/admin/editorial/${slug ?? ""}`);
    return;
  }

  // Get max sort order
  const maxSort = await prisma.editorialFeature.aggregate({
    where: { postId },
    _max: { sortOrder: true },
  });

  await prisma.editorialFeature.create({
    data: {
      postId,
      productId,
      note,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath(`/admin/editorial/${slug ?? ""}`);
  revalidatePath("/admin/editorial");
  revalidateTag("journal", "page");
}

export async function removeFeaturedProduct(formData: FormData) {
  const postId = formData.get("postId")?.toString();
  const productId = formData.get("productId")?.toString();
  const slug = formData.get("slug")?.toString();
  if (!postId || !productId) throw new Error("Post ID and Product ID are required");

  await prisma.editorialFeature.deleteMany({
    where: { postId, productId },
  });

  revalidatePath(`/admin/editorial/${slug ?? ""}`);
  revalidatePath("/admin/editorial");
  revalidateTag("journal", "page");
}

export async function updateFeaturedProductNote(formData: FormData) {
  const id = formData.get("id")?.toString();
  const note = formData.get("note")?.toString() || null;
  const slug = formData.get("slug")?.toString();
  if (!id) throw new Error("Feature ID is required");

  await prisma.editorialFeature.update({
    where: { id },
    data: { note },
  });

  revalidatePath(`/admin/editorial/${slug ?? ""}`);
  revalidatePath("/admin/editorial");
  revalidateTag("journal", "page");
}


