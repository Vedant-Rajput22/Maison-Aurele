import * as React from "react";
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface EmailLayoutProps {
    preview: string;
    children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
    return (
        <Html>
            <Head />
            <Preview>{preview}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    {/* Header */}
                    <Section style={styles.header}>
                        <Heading style={styles.logo}>Maison Aurèle</Heading>
                        <Text style={styles.tagline}>Paris · Haute Couture</Text>
                    </Section>

                    <Hr style={styles.divider} />

                    {/* Content */}
                    <Section style={styles.content}>{children}</Section>

                    <Hr style={styles.divider} />

                    {/* Footer */}
                    <Section style={styles.footer}>
                        <Text style={styles.footerText}>
                            Questions? Contact our concierge at{" "}
                            <Link href="mailto:concierge@maison-aurele.com" style={styles.link}>
                                concierge@maison-aurele.com
                            </Link>
                        </Text>
                        <Text style={styles.footerAddress}>
                            8 Rue du Faubourg Saint-Honoré, 75008 Paris
                        </Text>
                        <Text style={styles.footerLinks}>
                            <Link href="https://maison-aurele.com" style={styles.link}>
                                Website
                            </Link>
                            {" · "}
                            <Link href="https://maison-aurele.com/en/account" style={styles.link}>
                                My Account
                            </Link>
                            {" · "}
                            <Link href="https://maison-aurele.com/en/contact" style={styles.link}>
                                Contact
                            </Link>
                        </Text>
                        <Text style={styles.copyright}>
                            © {new Date().getFullYear()} Maison Aurèle. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const styles = {
    body: {
        backgroundColor: "#f5f3f0",
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        margin: 0,
        padding: "40px 0",
    },
    container: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 24px rgba(38, 24, 14, 0.08)",
        margin: "0 auto",
        maxWidth: "600px",
        padding: "0",
    },
    header: {
        padding: "40px 40px 24px",
        textAlign: "center" as const,
    },
    logo: {
        color: "#26180e",
        fontFamily: '"Didot", "Playfair Display", Georgia, serif',
        fontSize: "24px",
        fontWeight: "400",
        letterSpacing: "0.3em",
        margin: 0,
        textTransform: "uppercase" as const,
    },
    tagline: {
        color: "#8a7a6a",
        fontSize: "10px",
        letterSpacing: "0.4em",
        margin: "8px 0 0",
        textTransform: "uppercase" as const,
    },
    divider: {
        borderColor: "#e8e4df",
        borderWidth: "1px",
        margin: "0 40px",
    },
    content: {
        padding: "32px 40px",
    },
    footer: {
        padding: "24px 40px 40px",
        textAlign: "center" as const,
    },
    footerText: {
        color: "#8a7a6a",
        fontSize: "12px",
        margin: "0 0 8px",
    },
    footerAddress: {
        color: "#8a7a6a",
        fontSize: "11px",
        margin: "0 0 16px",
    },
    footerLinks: {
        color: "#8a7a6a",
        fontSize: "11px",
        margin: "0 0 16px",
    },
    link: {
        color: "#b58f6f",
        textDecoration: "none",
    },
    copyright: {
        color: "#b8b0a6",
        fontSize: "10px",
        margin: 0,
    },
};
