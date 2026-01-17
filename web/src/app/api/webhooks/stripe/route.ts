import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { FulfillmentStatus, Locale as DbLocale, OrderStatus, PaymentStatus } from "@prisma/client";
import { sendOrderConfirmation } from "@/lib/email/send";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new NextResponse("Webhook signature misconfigured", { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown webhook error";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const cartId = session.metadata?.cartId;
  if (!cartId) {
    return;
  }

  const providerId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? session.id;
  const existingPayment = await prisma.paymentRecord.findFirst({
    where: { providerId },
  });
  if (existingPayment) {
    return;
  }

  const locale = normalizeLocale(session.metadata?.locale);

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  translations: {
                    where: { locale },
                  },
                  media: {
                    include: { asset: true },
                    orderBy: { sortOrder: 'asc' },
                    take: 1,
                  },
                },
              },
              media: {
                include: { asset: true },
                orderBy: { sortOrder: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return;
  }

  const subtotalCents = cart.items.reduce((sum, item) => sum + item.variant.priceCents * item.quantity, 0);
  const totalCents = session.amount_total ?? subtotalCents;
  const orderNumber = generateOrderNumber();

  // Use cart userId, or fallback to metadata userId if cart wasn't associated
  const orderUserId = cart.userId ?? (session.metadata?.userId || undefined);

  const order = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        number: orderNumber,
        userId: orderUserId,
        currency: cart.currency,
        subtotalCents,
        taxCents: 0, // Stripe might provide tax details in total_details if configured
        shippingCents: 0,
        totalCents,
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        fulfillmentStatus: FulfillmentStatus.NOT_STARTED,
        items: {
          create: cart.items.map((item) => {
            const translation = item.variant.product.translations[0];
            return {
              variantId: item.variantId,
              productName: translation?.name ?? item.variant.product.slug,
              locale,
              unitPriceCents: item.variant.priceCents,
              quantity: item.quantity,
            };
          }),
        },
        payments: {
          create: {
            providerId,
            amountCents: totalCents,
            currency: cart.currency,
            status: PaymentStatus.PAID,
            data: {
              sessionId: session.id,
              customerId:
                typeof session.customer === "string"
                  ? session.customer
                  : session.customer?.id ?? null,
              metadata: session.metadata ?? {},
            },
          },
        },
      },
      include: {
        items: true,
      }
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    await tx.cart.delete({ where: { id: cart.id } });

    return order;
  });

  // Prepare data for email
  const customerEmail = session.customer_details?.email ?? session.customer_email;
  const customerName = session.customer_details?.name ?? "Valued Customer";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shippingDetails = (session as any).shipping_details?.address ?? session.customer_details?.address;

  if (customerEmail && shippingDetails) {
    const orderItems = cart.items.map((item) => {
      const translation = item.variant.product.translations[0];
      const imageUrl = item.variant.media[0]?.asset.url ?? item.variant.product.media[0]?.asset.url;

      return {
        productName: translation?.name ?? "Product",
        variantName: item.variant.size ? `Size: ${item.variant.size}` : undefined,
        quantity: item.quantity,
        priceCents: item.variant.priceCents,
        imageUrl,
      };
    });

    await sendOrderConfirmation({
      orderNumber: order.number,
      customerName,
      customerEmail,
      items: orderItems,
      subtotalCents,
      shippingCents: 0,
      taxCents: 0,
      totalCents,
      shippingAddress: {
        line1: shippingDetails.line1 ?? "",
        line2: shippingDetails.line2 ?? undefined,
        city: shippingDetails.city ?? "",
        postalCode: shippingDetails.postal_code ?? "",
        country: shippingDetails.country ?? "",
      },
      locale: locale === DbLocale.FR ? "fr" : "en",
    });
  }
}

function normalizeLocale(value?: string | null): DbLocale {
  if (!value) return DbLocale.EN;
  return value.toLowerCase() === "fr" ? DbLocale.FR : DbLocale.EN;
}

function generateOrderNumber() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
  const random = Math.floor(Math.random() * 90000 + 10000);
  return `MA-${stamp}-${random}`;
}
