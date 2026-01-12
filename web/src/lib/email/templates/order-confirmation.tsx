import * as React from "react";
import { Column, Heading, Hr, Img, Row, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

interface OrderItem {
    productName: string;
    variantName?: string;
    quantity: number;
    priceCents: number;
    imageUrl?: string;
}

interface OrderConfirmationProps {
    orderNumber: string;
    customerName: string;
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

export function OrderConfirmationEmail({
    orderNumber,
    customerName,
    items,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
    shippingAddress,
    locale = "en",
}: OrderConfirmationProps) {
    const copy = locale === "fr" ? COPY_FR : COPY_EN;
    const formatter = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
    });

    return (
        <EmailLayout preview={`${copy.preview} ${orderNumber}`}>
            {/* Greeting */}
            <Heading style={styles.greeting}>{copy.greeting.replace("{name}", customerName)}</Heading>
            <Text style={styles.intro}>{copy.intro}</Text>

            {/* Order Number */}
            <Section style={styles.orderBox}>
                <Text style={styles.orderLabel}>{copy.orderNumber}</Text>
                <Text style={styles.orderValue}>{orderNumber}</Text>
            </Section>

            {/* Items */}
            <Section style={styles.itemsSection}>
                <Text style={styles.sectionTitle}>{copy.items}</Text>
                {items.map((item, index) => (
                    <Row key={index} style={styles.itemRow}>
                        <Column style={styles.itemImageCol}>
                            {item.imageUrl ? (
                                <Img src={item.imageUrl} alt={item.productName} width={60} height={80} style={styles.itemImage} />
                            ) : (
                                <div style={styles.itemImagePlaceholder} />
                            )}
                        </Column>
                        <Column style={styles.itemDetailsCol}>
                            <Text style={styles.itemName}>{item.productName}</Text>
                            {item.variantName && <Text style={styles.itemVariant}>{item.variantName}</Text>}
                            <Text style={styles.itemQty}>× {item.quantity}</Text>
                        </Column>
                        <Column style={styles.itemPriceCol}>
                            <Text style={styles.itemPrice}>{formatter.format(item.priceCents / 100)}</Text>
                        </Column>
                    </Row>
                ))}
            </Section>

            <Hr style={styles.hr} />

            {/* Summary */}
            <Section style={styles.summarySection}>
                <Row style={styles.summaryRow}>
                    <Column><Text style={styles.summaryLabel}>{copy.subtotal}</Text></Column>
                    <Column style={styles.summaryValueCol}><Text style={styles.summaryValue}>{formatter.format(subtotalCents / 100)}</Text></Column>
                </Row>
                <Row style={styles.summaryRow}>
                    <Column><Text style={styles.summaryLabel}>{copy.shipping}</Text></Column>
                    <Column style={styles.summaryValueCol}><Text style={styles.summaryValue}>{shippingCents === 0 ? copy.free : formatter.format(shippingCents / 100)}</Text></Column>
                </Row>
                <Row style={styles.summaryRow}>
                    <Column><Text style={styles.summaryLabel}>{copy.tax}</Text></Column>
                    <Column style={styles.summaryValueCol}><Text style={styles.summaryValue}>{formatter.format(taxCents / 100)}</Text></Column>
                </Row>
                <Hr style={styles.hrLight} />
                <Row style={styles.totalRow}>
                    <Column><Text style={styles.totalLabel}>{copy.total}</Text></Column>
                    <Column style={styles.summaryValueCol}><Text style={styles.totalValue}>{formatter.format(totalCents / 100)}</Text></Column>
                </Row>
            </Section>

            <Hr style={styles.hr} />

            {/* Shipping Address */}
            <Section style={styles.addressSection}>
                <Text style={styles.sectionTitle}>{copy.shippingTo}</Text>
                <Text style={styles.addressLine}>{shippingAddress.line1}</Text>
                {shippingAddress.line2 && <Text style={styles.addressLine}>{shippingAddress.line2}</Text>}
                <Text style={styles.addressLine}>{shippingAddress.postalCode} {shippingAddress.city}</Text>
                <Text style={styles.addressLine}>{shippingAddress.country}</Text>
            </Section>

            {/* Closing */}
            <Text style={styles.closing}>{copy.closing}</Text>
            <Text style={styles.signature}>{copy.signature}</Text>
        </EmailLayout>
    );
}

const COPY_EN = {
    preview: "Your Maison Aurèle order",
    greeting: "Thank you, {name}",
    intro: "We've received your order and it's being prepared with the utmost care in our atelier. You'll receive a shipping notification once your pieces are on their way.",
    orderNumber: "Order Number",
    items: "Your Pieces",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax",
    total: "Total",
    free: "Complimentary",
    shippingTo: "Shipping To",
    closing: "We appreciate your trust in Maison Aurèle. Each piece is crafted with passion and heritage.",
    signature: "— The Maison Aurèle Atelier",
};

const COPY_FR = {
    preview: "Votre commande Maison Aurèle",
    greeting: "Merci, {name}",
    intro: "Nous avons bien reçu votre commande et elle est en cours de préparation avec le plus grand soin dans notre atelier. Vous recevrez une notification d'expédition dès que vos pièces seront en route.",
    orderNumber: "Numéro de commande",
    items: "Vos pièces",
    subtotal: "Sous-total",
    shipping: "Livraison",
    tax: "TVA",
    total: "Total",
    free: "Offerte",
    shippingTo: "Adresse de livraison",
    closing: "Nous vous remercions de votre confiance. Chaque pièce est créée avec passion et héritage.",
    signature: "— L'Atelier Maison Aurèle",
};

const styles = {
    greeting: {
        color: "#26180e",
        fontFamily: '"Didot", "Playfair Display", Georgia, serif',
        fontSize: "28px",
        fontWeight: "400" as const,
        margin: "0 0 16px",
    },
    intro: {
        color: "#5a4a3a",
        fontSize: "14px",
        lineHeight: "24px",
        margin: "0 0 32px",
    },
    orderBox: {
        backgroundColor: "#faf8f5",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center" as const,
        marginBottom: "32px",
    },
    orderLabel: {
        color: "#8a7a6a",
        fontSize: "10px",
        letterSpacing: "0.3em",
        margin: "0 0 8px",
        textTransform: "uppercase" as const,
    },
    orderValue: {
        color: "#26180e",
        fontFamily: "monospace",
        fontSize: "18px",
        fontWeight: "600" as const,
        letterSpacing: "0.1em",
        margin: 0,
    },
    sectionTitle: {
        color: "#8a7a6a",
        fontSize: "10px",
        letterSpacing: "0.4em",
        margin: "0 0 16px",
        textTransform: "uppercase" as const,
    },
    itemsSection: {
        marginBottom: "24px",
    },
    itemRow: {
        marginBottom: "16px",
    },
    itemImageCol: {
        width: "70px",
        verticalAlign: "top" as const,
    },
    itemImage: {
        borderRadius: "4px",
        objectFit: "cover" as const,
    },
    itemImagePlaceholder: {
        backgroundColor: "#f0ebe5",
        borderRadius: "4px",
        height: "80px",
        width: "60px",
    },
    itemDetailsCol: {
        paddingLeft: "16px",
        verticalAlign: "top" as const,
    },
    itemName: {
        color: "#26180e",
        fontSize: "14px",
        fontWeight: "500" as const,
        margin: "0 0 4px",
    },
    itemVariant: {
        color: "#8a7a6a",
        fontSize: "12px",
        margin: "0 0 4px",
    },
    itemQty: {
        color: "#8a7a6a",
        fontSize: "12px",
        margin: 0,
    },
    itemPriceCol: {
        textAlign: "right" as const,
        verticalAlign: "top" as const,
        width: "100px",
    },
    itemPrice: {
        color: "#26180e",
        fontSize: "14px",
        fontWeight: "500" as const,
        margin: 0,
    },
    hr: {
        borderColor: "#e8e4df",
        borderWidth: "1px",
        margin: "24px 0",
    },
    hrLight: {
        borderColor: "#f0ebe5",
        borderWidth: "1px",
        margin: "12px 0",
    },
    summarySection: {
        marginBottom: "24px",
    },
    summaryRow: {
        marginBottom: "8px",
    },
    summaryLabel: {
        color: "#5a4a3a",
        fontSize: "13px",
        margin: 0,
    },
    summaryValueCol: {
        textAlign: "right" as const,
    },
    summaryValue: {
        color: "#5a4a3a",
        fontSize: "13px",
        margin: 0,
    },
    totalRow: {
        marginTop: "12px",
    },
    totalLabel: {
        color: "#26180e",
        fontSize: "14px",
        fontWeight: "600" as const,
        margin: 0,
    },
    totalValue: {
        color: "#26180e",
        fontFamily: '"Didot", "Playfair Display", Georgia, serif',
        fontSize: "20px",
        fontWeight: "400" as const,
        margin: 0,
    },
    addressSection: {
        marginBottom: "32px",
    },
    addressLine: {
        color: "#5a4a3a",
        fontSize: "13px",
        lineHeight: "20px",
        margin: 0,
    },
    closing: {
        color: "#5a4a3a",
        fontSize: "13px",
        fontStyle: "italic" as const,
        lineHeight: "22px",
        margin: "0 0 16px",
    },
    signature: {
        color: "#b58f6f",
        fontSize: "12px",
        margin: 0,
    },
};

export default OrderConfirmationEmail;
