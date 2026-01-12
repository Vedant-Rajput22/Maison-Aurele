"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Locale } from "@prisma/client";

function normalizeCode(input: string) {
    return input.trim().toUpperCase().replace(/[^A-Z0-9-]+/g, "");
}

function intOrZero(value: FormDataEntryValue | null) {
    const parsed = Number.parseInt(String(value ?? "0"), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function toPayload(formData: FormData) {
    return {
        code: String(formData.get("code") || ""),
        description: formData.get("description")?.toString() || null,
        discountType: formData.get("discountType")?.toString() || "percentage",
        discountValue: intOrZero(formData.get("discountValue")),
        startsAt: formData.get("startsAt")?.toString() || null,
        endsAt: formData.get("endsAt")?.toString() || null,
        usageLimit: formData.get("usageLimit")?.toString() || null,
        locale: formData.get("locale")?.toString() || null,
        limitedEditionOnly: formData.get("limitedEditionOnly") === "on",
    };
}

export async function createPromotion(formData: FormData) {
    const payload = toPayload(formData);
    const code = normalizeCode(payload.code);
    if (!code) throw new Error("Code is required");

    await prisma.promotion.create({
        data: {
            code,
            description: payload.description,
            discountType: payload.discountType,
            discountValue: payload.discountValue,
            startsAt: payload.startsAt ? new Date(payload.startsAt) : new Date(),
            endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
            usageLimit: payload.usageLimit ? parseInt(payload.usageLimit, 10) : null,
            locale: payload.locale === "EN" ? Locale.EN : payload.locale === "FR" ? Locale.FR : null,
            limitedEditionOnly: payload.limitedEditionOnly,
        },
    });

    revalidatePath("/admin/promotions");
    redirect("/admin/promotions");
}

export async function updatePromotion(formData: FormData) {
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID is required");

    const payload = toPayload(formData);
    const code = normalizeCode(payload.code);
    if (!code) throw new Error("Code is required");

    await prisma.promotion.update({
        where: { id },
        data: {
            code,
            description: payload.description,
            discountType: payload.discountType,
            discountValue: payload.discountValue,
            startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
            endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
            usageLimit: payload.usageLimit ? parseInt(payload.usageLimit, 10) : null,
            locale: payload.locale === "EN" ? Locale.EN : payload.locale === "FR" ? Locale.FR : null,
            limitedEditionOnly: payload.limitedEditionOnly,
        },
    });

    revalidatePath("/admin/promotions");
    revalidatePath(`/admin/promotions/${id}`);
    redirect("/admin/promotions");
}

export async function deletePromotion(formData: FormData) {
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID is required");

    await prisma.promotion.delete({ where: { id } });

    revalidatePath("/admin/promotions");
}

export async function togglePromotionActive(formData: FormData) {
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID is required");

    const promo = await prisma.promotion.findUnique({ where: { id } });
    if (!promo) throw new Error("Promotion not found");

    // Toggle by setting end date to now or removing it
    const isActive = !promo.endsAt || promo.endsAt > new Date();

    await prisma.promotion.update({
        where: { id },
        data: {
            endsAt: isActive ? new Date() : null,
        },
    });

    revalidatePath("/admin/promotions");
}


