"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const COPY = {
    en: {
        kicker: "Welcome back",
        headline: "Enter the Maison",
        subline: "Access your digital concierge, orders, and bespoke appointments.",
        email: "Email",
        password: "Password",
        submit: "Sign in",
        submitting: "Authenticating...",
        forgotPassword: "Forgot password?",
        noAccount: "New to the maison?",
        createAccount: "Create an account",
        error: "Invalid credentials. Please try again.",
        benefits: [
            "Track orders & deliveries",
            "Bespoke appointment booking",
            "Exclusive early access",
            "Personalized recommendations",
        ],
    },
    fr: {
        kicker: "Bon retour",
        headline: "Entrez dans la Maison",
        subline: "Accédez à votre conciergerie, commandes et rendez-vous sur mesure.",
        email: "Email",
        password: "Mot de passe",
        submit: "Se connecter",
        submitting: "Authentification...",
        forgotPassword: "Mot de passe oublié ?",
        noAccount: "Nouvelle cliente ?",
        createAccount: "Créer un compte",
        error: "Identifiants invalides. Veuillez réessayer.",
        benefits: [
            "Suivre commandes & livraisons",
            "Réservation rendez-vous sur mesure",
            "Accès anticipé exclusif",
            "Recommandations personnalisées",
        ],
    },
} as const;

export function LoginForm({ locale }: { locale: Locale }) {
    const copy = COPY[locale] || COPY.en;
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = await signIn("credentials", {
                email: form.email,
                password: form.password,
                redirect: false,
            });
            if (result?.error) {
                setError(copy.error);
            } else {
                router.push(`/${locale}/account`);
                router.refresh();
            }
        });
    };

    return (
        <div className="relative flex min-h-screen">
            {/* Left Panel - Decorative */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
            >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1612] via-[#2d241d] to-[#1a1612]" />

                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(218,200,182,0.15),transparent_60%)]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(180,150,120,0.1),transparent_60%)]"
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <Sparkles size={16} className="text-[#dac8b6]" />
                            <span className="text-[0.65rem] uppercase tracking-[0.5em] text-[#dac8b6]/60">
                                Maison Aurèle
                            </span>
                        </div>

                        <h2 className="font-display text-5xl text-white/90 leading-tight mb-6">
                            Your digital
                            <br />
                            <span className="text-[#dac8b6]">atelier</span> awaits
                        </h2>

                        <p className="text-white/50 text-sm leading-relaxed max-w-md mb-12">
                            A curated space where every silhouette tells a story,
                            every piece arrives with its certificate of authenticity.
                        </p>

                        {/* Benefits List */}
                        <div className="space-y-4">
                            {copy.benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="h-px w-8 bg-gradient-to-r from-[#dac8b6]/60 to-transparent" />
                                    <span className="text-[0.7rem] uppercase tracking-[0.3em] text-white/60">
                                        {benefit}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Lines */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </motion.div>

            {/* Right Panel - Form */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex w-full lg:w-1/2 flex-col justify-center px-8 py-16 md:px-16 lg:px-20"
                style={{ backgroundColor: "var(--parchment)" }}
            >
                <div className="mx-auto w-full max-w-md">
                    {/* Kicker */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <span className="text-[0.6rem] uppercase tracking-[0.6em] text-ink/40">
                            {copy.kicker}
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-display text-4xl md:text-5xl text-ink mb-4"
                    >
                        {copy.headline}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm text-ink/60 mb-10"
                    >
                        {copy.subline}
                    </motion.p>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-ink/50">
                                <Mail size={12} />
                                <span>{copy.email}</span>
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                                required
                                className="w-full rounded-2xl border border-ink/15 bg-white/80 px-5 py-4 text-sm text-ink placeholder:text-ink/30 outline-none transition-all focus:border-ink/40 focus:shadow-[0_0_0_4px_rgba(38,24,14,0.05)]"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-ink/50">
                                    <Lock size={12} />
                                    <span>{copy.password}</span>
                                </label>
                                <button
                                    type="button"
                                    className="text-[0.6rem] uppercase tracking-[0.3em] text-ink/40 hover:text-ink transition-colors"
                                >
                                    {copy.forgotPassword}
                                </button>
                            </div>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                                required
                                className="w-full rounded-2xl border border-ink/15 bg-white/80 px-5 py-4 text-sm text-ink placeholder:text-ink/30 outline-none transition-all focus:border-ink/40 focus:shadow-[0_0_0_4px_rgba(38,24,14,0.05)]"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3"
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={pending}
                            whileHover={{ scale: pending ? 1 : 1.01 }}
                            whileTap={{ scale: pending ? 1 : 0.99 }}
                            className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-ink px-6 py-4 text-xs uppercase tracking-[0.4em] text-white transition-all hover:bg-ink/90 disabled:opacity-60 shadow-[0_10px_40px_rgba(38,24,14,0.2)]"
                        >
                            <span>{pending ? copy.submitting : copy.submit}</span>
                            {!pending && (
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Register Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-10 text-center"
                    >
                        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink/40">
                            {copy.noAccount}
                        </span>
                        <Link
                            href={`/${locale}/register`}
                            className="ml-2 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.3em] text-ink hover:text-[var(--gilded-rose)] transition-colors"
                        >
                            {copy.createAccount}
                            <ArrowRight size={12} />
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
