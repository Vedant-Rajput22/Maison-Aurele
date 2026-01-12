import type { Locale } from "@/lib/i18n/config";
import { isLocale } from "@/lib/i18n/config";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";

type Params = { locale: string } | Promise<{ locale: string }>;

export default async function LoginPage({ params }: { params: Params }) {
    const resolved = await params;

    if (!isLocale(resolved.locale)) {
        notFound();
    }

    const locale = resolved.locale as Locale;
    const currentUser = await getCurrentUser();

    // Redirect if already logged in
    if (currentUser) {
        redirect(`/${locale}/account`);
    }

    return <LoginForm locale={locale} />;
}

export const metadata = {
    title: "Sign In — Maison Aurèle",
    description: "Access your digital concierge, orders, and bespoke appointments.",
};
