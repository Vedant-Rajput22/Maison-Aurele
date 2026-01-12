import { Resend } from "resend";

// Check if Resend is configured
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey && process.env.NODE_ENV === "production") {
    console.warn("RESEND_API_KEY is not set. Emails will not be sent.");
}

export const resend = apiKey ? new Resend(apiKey) : null;

// Default sender configuration
// Use Resend's test domain for development, or your verified domain for production
const isDev = process.env.NODE_ENV !== "production";
const fromDomain = isDev ? "onboarding@resend.dev" : "noreply@maison-aurele.com";

export const emailConfig = {
    from: isDev ? "Maison Aurèle <onboarding@resend.dev>" : "Maison Aurèle <noreply@maison-aurele.com>",
    replyTo: "concierge@maison-aurele.com",
};
