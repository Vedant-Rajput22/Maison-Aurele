import * as React from "react";
import { Button, Heading, Hr, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

interface ShippingUpdateProps {
    orderNumber: string;
    customerName: string;
    trackingNumber?: string;
    trackingUrl?: string;
    carrier?: string;
    estimatedDelivery?: string;
    locale?: "en" | "fr";
}

export function ShippingUpdateEmail({
    orderNumber,
    customerName,
    trackingNumber,
    trackingUrl,
    carrier = "Premium Courier",
    estimatedDelivery,
    locale = "en",
}: ShippingUpdateProps) {
    const copy = locale === "fr" ? COPY_FR : COPY_EN;

    return (
        <EmailLayout preview={`${copy.preview} ${orderNumber}`}>
            {/* Greeting */}
            <Heading style={styles.greeting}>{copy.greeting.replace("{name}", customerName)}</Heading>
            <Text style={styles.intro}>{copy.intro}</Text>

            {/* Shipping Info Box */}
            <Section style={styles.shippingBox}>
                <Text style={styles.boxLabel}>{copy.orderNumber}</Text>
                <Text style={styles.boxValue}>{orderNumber}</Text>

                <Hr style={styles.boxDivider} />

                <Text style={styles.boxLabel}>{copy.carrier}</Text>
                <Text style={styles.boxValue}>{carrier}</Text>

                {trackingNumber && (
                    <>
                        <Hr style={styles.boxDivider} />
                        <Text style={styles.boxLabel}>{copy.tracking}</Text>
                        <Text style={styles.trackingNumber}>{trackingNumber}</Text>
                    </>
                )}

                {estimatedDelivery && (
                    <>
                        <Hr style={styles.boxDivider} />
                        <Text style={styles.boxLabel}>{copy.estimated}</Text>
                        <Text style={styles.boxValue}>{estimatedDelivery}</Text>
                    </>
                )}
            </Section>

            {/* Track Button */}
            {trackingUrl && (
                <Section style={styles.buttonSection}>
                    <Button href={trackingUrl} style={styles.button}>
                        {copy.trackButton}
                    </Button>
                </Section>
            )}

            {/* White Glove Notice */}
            <Section style={styles.noticeBox}>
                <Text style={styles.noticeTitle}>{copy.whiteGloveTitle}</Text>
                <Text style={styles.noticeText}>{copy.whiteGloveText}</Text>
            </Section>

            {/* Closing */}
            <Text style={styles.closing}>{copy.closing}</Text>
            <Text style={styles.signature}>{copy.signature}</Text>
        </EmailLayout>
    );
}

const COPY_EN = {
    preview: "Your order is on its way",
    greeting: "Exciting news, {name}",
    intro: "Your Maison Aurèle pieces have departed our atelier and are making their way to you. Each item has been carefully wrapped in our signature packaging.",
    orderNumber: "Order",
    carrier: "Carrier",
    tracking: "Tracking Number",
    estimated: "Estimated Delivery",
    trackButton: "Track Your Package",
    whiteGloveTitle: "White Glove Delivery",
    whiteGloveText: "Your courier will contact you to arrange a convenient delivery time. All packages are delivered with signature confirmation.",
    closing: "We can't wait for you to experience your new pieces.",
    signature: "— The Maison Aurèle Team",
};

const COPY_FR = {
    preview: "Votre commande est en route",
    greeting: "Excellente nouvelle, {name}",
    intro: "Vos pièces Maison Aurèle ont quitté notre atelier et sont en route vers vous. Chaque article a été soigneusement emballé dans notre packaging signature.",
    orderNumber: "Commande",
    carrier: "Transporteur",
    tracking: "Numéro de suivi",
    estimated: "Livraison estimée",
    trackButton: "Suivre votre colis",
    whiteGloveTitle: "Livraison White Glove",
    whiteGloveText: "Notre coursier vous contactera pour convenir d'un créneau de livraison. Tous les colis sont livrés avec confirmation de signature.",
    closing: "Nous avons hâte que vous découvriez vos nouvelles pièces.",
    signature: "— L'équipe Maison Aurèle",
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
    shippingBox: {
        backgroundColor: "#faf8f5",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "24px",
    },
    boxLabel: {
        color: "#8a7a6a",
        fontSize: "10px",
        letterSpacing: "0.3em",
        margin: "0 0 4px",
        textTransform: "uppercase" as const,
    },
    boxValue: {
        color: "#26180e",
        fontSize: "14px",
        fontWeight: "500" as const,
        margin: 0,
    },
    trackingNumber: {
        color: "#26180e",
        fontFamily: "monospace",
        fontSize: "16px",
        fontWeight: "600" as const,
        letterSpacing: "0.05em",
        margin: 0,
    },
    boxDivider: {
        borderColor: "#e8e4df",
        borderWidth: "1px",
        margin: "16px 0",
    },
    buttonSection: {
        textAlign: "center" as const,
        marginBottom: "32px",
    },
    button: {
        backgroundColor: "#26180e",
        borderRadius: "50px",
        color: "#ffffff",
        display: "inline-block",
        fontSize: "11px",
        fontWeight: "500" as const,
        letterSpacing: "0.2em",
        padding: "16px 32px",
        textDecoration: "none",
        textTransform: "uppercase" as const,
    },
    noticeBox: {
        backgroundColor: "#f8f5f0",
        borderLeft: "3px solid #b58f6f",
        padding: "16px 20px",
        marginBottom: "32px",
    },
    noticeTitle: {
        color: "#26180e",
        fontSize: "12px",
        fontWeight: "600" as const,
        letterSpacing: "0.1em",
        margin: "0 0 8px",
        textTransform: "uppercase" as const,
    },
    noticeText: {
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

export default ShippingUpdateEmail;
