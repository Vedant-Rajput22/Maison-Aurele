"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateAppointmentStatus(formData: FormData) {
    const id = formData.get("id")?.toString();
    const status = formData.get("status")?.toString();
    if (!id || !status) throw new Error("ID and status are required");

    await prisma.appointment.update({
        where: { id },
        data: { status },
    });

    revalidatePath("/admin/appointments");
    revalidatePath(`/admin/appointments/${id}`);
}

export async function addAppointmentNote(formData: FormData) {
    const id = formData.get("id")?.toString();
    const notes = formData.get("notes")?.toString() || null;
    if (!id) throw new Error("ID is required");

    await prisma.appointment.update({
        where: { id },
        data: { notes },
    });

    revalidatePath("/admin/appointments");
    revalidatePath(`/admin/appointments/${id}`);
}

export async function rescheduleAppointment(formData: FormData) {
    const id = formData.get("id")?.toString();
    const appointmentAt = formData.get("appointmentAt")?.toString();
    if (!id || !appointmentAt) throw new Error("ID and new date are required");

    await prisma.appointment.update({
        where: { id },
        data: {
            appointmentAt: new Date(appointmentAt),
            status: "rescheduled",
        },
    });

    revalidatePath("/admin/appointments");
    revalidatePath(`/admin/appointments/${id}`);
}

export async function cancelAppointment(formData: FormData) {
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID is required");

    await prisma.appointment.update({
        where: { id },
        data: { status: "cancelled" },
    });

    revalidatePath("/admin/appointments");
}

export async function confirmAppointment(formData: FormData) {
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID is required");

    await prisma.appointment.update({
        where: { id },
        data: { status: "confirmed" },
    });

    revalidatePath("/admin/appointments");
}

export async function completeAppointment(formData: FormData) {
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID is required");

    await prisma.appointment.update({
        where: { id },
        data: { status: "completed" },
    });

    revalidatePath("/admin/appointments");
}

export async function assignConcierge(formData: FormData) {
    const id = formData.get("id")?.toString();
    const concierge = formData.get("concierge")?.toString() || null;
    if (!id) throw new Error("ID is required");

    await prisma.appointment.update({
        where: { id },
        data: { concierge },
    });

    revalidatePath("/admin/appointments");
    revalidatePath(`/admin/appointments/${id}`);
}


