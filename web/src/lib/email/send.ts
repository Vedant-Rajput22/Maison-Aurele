import { resend, emailConfig } from "./client";
import { OrderConfirmationEmail } from "./templates/order-confirmation";
import { ShippingUpdateEmail } from "./templates/shipping-update";
import { render } from "@react-email/components";

interface OrderItem {
    productName: string;
    variantName?: string;
    quantity: number;
    priceCents: number;
    imageUrl?: string;
}

interface OrderData {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    subtotalCents: number;
    shippingCents: number;
    taxCents: number;
    totalCents: number;
    shippingAddress: {
        line1: string;
        line2?: string;
        city: string;
        postalCode: string;
        country: string;
    };
    locale?: "en" | "fr";
}

interface ShippingData {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    trackingNumber?: string;
    trackingUrl?: string;
    carrier?: string;
    estimatedDelivery?: string;
    locale?: "en" | "fr";
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(order: OrderData): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.log("[Email] Resend not configured, skipping order confirmation email");
        return { success: true };
    }

    try {
        const html = await render(
            OrderConfirmationEmail({
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                items: order.items,
                subtotalCents: order.subtotalCents,
                shippingCents: order.shippingCents,
                taxCents: order.taxCents,
                totalCents: order.totalCents,
                shippingAddress: order.shippingAddress,
                locale: order.locale,
            })
        );

        const subject = order.locale === "fr"
            ? `Confirmation de commande ${order.orderNumber}`
            : `Order Confirmation ${order.orderNumber}`;

        const { error } = await resend.emails.send({
            from: emailConfig.from,
            replyTo: emailConfig.replyTo,
            to: order.customerEmail,
            subject,
            html,
        });

        if (error) {
            console.error("[Email] Failed to send order confirmation:", error);
            return { success: false, error: error.message };
        }

        console.log(`[Email] Order confirmation sent to ${order.customerEmail}`);
        return { success: true };
    } catch (err) {
        console.error("[Email] Error sending order confirmation:", err);
        return { success: false, error: String(err) };
    }
}

/**
 * Send shipping update email
 */
export async function sendShippingUpdate(data: ShippingData): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.log("[Email] Resend not configured, skipping shipping update email");
        return { success: true };
    }

    try {
        const html = await render(
            ShippingUpdateEmail({
                orderNumber: data.orderNumber,
                customerName: data.customerName,
                trackingNumber: data.trackingNumber,
                trackingUrl: data.trackingUrl,
                carrier: data.carrier,
                estimatedDelivery: data.estimatedDelivery,
                locale: data.locale,
            })
        );

        const subject = data.locale === "fr"
            ? `Votre commande ${data.orderNumber} est en route`
            : `Your order ${data.orderNumber} is on its way`;

        const { error } = await resend.emails.send({
            from: emailConfig.from,
            replyTo: emailConfig.replyTo,
            to: data.customerEmail,
            subject,
            html,
        });

        if (error) {
            console.error("[Email] Failed to send shipping update:", error);
            return { success: false, error: error.message };
        }

        console.log(`[Email] Shipping update sent to ${data.customerEmail}`);
        return { success: true };
    } catch (err) {
        console.error("[Email] Error sending shipping update:", err);
        return { success: false, error: String(err) };
    }
}
