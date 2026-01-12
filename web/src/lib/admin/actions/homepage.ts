"use server";

import { Locale } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function normalizeSlug(input: string) {
  return input.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

function parseJsonConfig(raw: string | null): object {
  if (!raw || !raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) return parsed;
    throw new Error("Config must be JSON object");
  } catch (error) {
    throw new Error("Invalid JSON config");
  }
}

function toDate(value: FormDataEntryValue | null) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

function toModulePayload(formData: FormData) {
  return {
    id: formData.get("id")?.toString(),
    slug: normalizeSlug(formData.get("slug")?.toString() || ""),
    type: formData.get("type")?.toString() || "",
    locale: formData.get("locale")?.toString(),
    sortOrder: Number(formData.get("sortOrder")) || 0,
    config: parseJsonConfig(formData.get("config")?.toString() || null),
    activeFrom: toDate(formData.get("activeFrom")),
    activeTo: toDate(formData.get("activeTo")),
  };
}

type ModuleType = "hero" | "gallery" | "drop" | string;

function validateConfig(type: ModuleType, config: Record<string, unknown>) {
  if (!config || typeof config !== "object") {
    throw new Error("Config must be a JSON object");
  }

  const assertKeys = (keys: string[]) => {
    const missing = keys.filter((key) => !(key in config));
    if (missing.length) {
      throw new Error(`Missing config keys: ${missing.join(", ")}`);
    }
  };

  if (type === "hero") {
    assertKeys(["headline", "subheadline", "ctaLabel", "ctaHref", "image"]);
  } else if (type === "gallery") {
    assertKeys(["title", "items"]);
    if (!Array.isArray((config as any).items)) throw new Error("Gallery items must be an array");
  } else if (type === "drop") {
    assertKeys(["title", "subtitle", "ctaHref", "ctaLabel"]);
  }
}

export async function createHomepageModule(formData: FormData) {
  const payload = toModulePayload(formData);
  if (!payload.slug) throw new Error("Slug is required");
  if (!payload.type) throw new Error("Type is required");
  if (!payload.locale) throw new Error("Locale is required");

  validateConfig(payload.type, payload.config as Record<string, unknown>);

  await prisma.homepageModule.create({
    data: {
      slug: payload.slug,
      type: payload.type,
      locale: payload.locale as Locale,
      config: payload.config,
      activeFrom: payload.activeFrom,
      activeTo: payload.activeTo,
      sortOrder: payload.sortOrder,
    },
  });

  revalidateTag("homepage", "page");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/sequence");
  redirect("/admin/homepage");
}

export async function updateHomepageModule(formData: FormData) {
  const payload = toModulePayload(formData);
  if (!payload.id) throw new Error("Module id is required");
  if (!payload.slug) throw new Error("Slug is required");
  if (!payload.type) throw new Error("Type is required");
  if (!payload.locale) throw new Error("Locale is required");

  validateConfig(payload.type, payload.config as Record<string, unknown>);

  await prisma.homepageModule.update({
    where: { id: payload.id },
    data: {
      slug: payload.slug,
      type: payload.type,
      locale: payload.locale as Locale,
      config: payload.config,
      activeFrom: payload.activeFrom,
      activeTo: payload.activeTo,
      sortOrder: payload.sortOrder,
    },
  });

  revalidateTag("homepage", "page");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/sequence");
  redirect("/admin/homepage");
}

export async function deleteHomepageModule(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Module id is required");
  await prisma.homepageModule.delete({ where: { id } });
  revalidateTag("homepage", "page");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/sequence");
}

export async function reorderHomepageModules(formData: FormData) {
  const entries = Array.from(formData.entries());
  const updates = entries
    .filter(([key]) => key.startsWith("order-"))
    .map(([key, value]) => ({ id: key.replace("order-", ""), sortOrder: Number(value) }));

  const validUpdates = updates.filter((item) => item.id && Number.isFinite(item.sortOrder));
  if (!validUpdates.length) return;

  await Promise.all(
    validUpdates.map((item) =>
      prisma.homepageModule.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    ),
  );

  revalidateTag("homepage", "page");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/sequence");
}


