"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FulfillmentStatus, OrderStatus, PaymentStatus } from "@prisma/client";

export async function updateOrderState(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId) {
    throw new Error("Order id is required");
  }

  const status = (formData.get("status") as OrderStatus) ?? OrderStatus.PENDING;
  const fulfillmentStatus =
    (formData.get("fulfillmentStatus") as FulfillmentStatus) ?? FulfillmentStatus.NOT_STARTED;
  const paymentStatus = (formData.get("paymentStatus") as PaymentStatus) ?? PaymentStatus.UNPAID;
  const note = formData.get("note")?.toString().trim();

  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { currency: true } });
  if (!order) {
    throw new Error("Order not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status, fulfillmentStatus, paymentStatus },
    });

    if (note) {
      await tx.paymentRecord.create({
        data: {
          orderId,
          provider: "ops-note",
          providerId: `note-${Date.now()}`,
          amountCents: 0,
          currency: order.currency,
          status: PaymentStatus.UNPAID,
          data: { note },
        },
      });
    }
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}`);
}

export async function addOrderNote(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  const note = formData.get("note")?.toString().trim();

  if (!orderId) {
    throw new Error("Order id is required");
  }
  if (!note) {
    redirect(`/admin/orders/${orderId}`);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { currency: true } });
  if (!order) {
    throw new Error("Order not found");
  }

  await prisma.paymentRecord.create({
    data: {
      orderId,
      provider: "ops-note",
      providerId: `note-${Date.now()}`,
      amountCents: 0,
      currency: order.currency,
      status: PaymentStatus.UNPAID,
      data: { note },
    },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}`);
}


