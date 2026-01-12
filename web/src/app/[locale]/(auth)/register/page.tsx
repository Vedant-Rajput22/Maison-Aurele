import type { Locale } from "@/lib/i18n/config";
import { isLocale } from "@/lib/i18n/config";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { RegisterForm } from "@/components/auth/register-form";

type Params = { locale: string } | Promise<{ locale: string }>;

export default async function RegisterPage({ params }: { params: Params }) {
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

    return <RegisterForm locale={locale} />;
}

export const metadata = {
    title: "Create Account — Maison Aurèle",
    description: "Join the Maison for exclusive access, bespoke appointments, and personalized curation.",
};
