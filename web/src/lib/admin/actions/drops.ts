"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Locale } from "@prisma/client";

function toPayload(formData: FormData) {
    return {
        title: formData.get("title")?.toString() || "",
        collectionId: formData.get("collectionId")?.toString() || "",
        startsAt: formData.get("startsAt")?.toString() || null,
        endsAt: formData.get("endsAt")?.toString() || null,
        locale: formData.get("locale")?.toString() || null,
        waitlistOpen: formData.get("waitlistOpen") === "on",
    };
}

export async function createDrop(formData: FormData) {
    const payload = toPayload(formData);
    if (!payload.title) throw new Error("Title is required");
    if (!payload.collectionId) throw new Error("Collection is required");

    await prisma.limitedDrop.create({
        data: {
            title: payload.title,
            collectionId: payload.collectionId,
            startsAt: payload.startsAt ? new Date(payload.startsAt) : new Date(),
            endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
            locale: payload.locale === "EN" ? Locale.EN : payload.locale === "FR" ? Locale.FR : null,
            waitlistOpen: payload.waitlistOpen,
        },
    });

    revalidatePath("/admin/drops");
    redirect("/admin/drops");
}

export async function updateDrop(formData: FormData) {
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID is required");

    const payload = toPayload(formData);
    if (!payload.title) throw new Error("Title is required");

    await prisma.limitedDrop.update({
        where: { id },
        data: {
            title: payload.title,
            collectionId: payload.collectionId || undefined,
            startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
            endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
            locale: payload.locale === "EN" ? Locale.EN : payload.locale === "FR" ? Locale.FR : null,
            waitlistOpen: payload.waitlistOpen,
        },
    });

    revalidatePath("/admin/drops");
    revalidatePath(`/admin/drops/${id}`);
    redirect("/admin/drops");
}

export async function deleteDrop(formData: FormData) {
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID is required");

    await prisma.limitedDrop.delete({ where: { id } });

    revalidatePath("/admin/drops");
}

export async function closeDrop(formData: FormData) {
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID is required");

    await prisma.limitedDrop.update({
        where: { id },
        data: { endsAt: new Date() },
    });

    revalidatePath("/admin/drops");
}


