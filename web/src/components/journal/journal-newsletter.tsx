"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import { Send, CheckCircle2, Sparkles } from "lucide-react";

type JournalNewsletterProps = {
  locale: Locale;
  variant?: "default" | "minimal" | "dark";
};

const COPY = {
  en: {
    kicker: "Newsletter",
    title: "Receive our editorial correspondences",
    subtitle: "Monthly letters from our atelier, behind-the-scenes stories, and exclusive previews of upcoming collections.",
    placeholder: "Your email address",
    cta: "Subscribe",
    success: "Welcome to our world",
    successMessage: "Check your inbox for a confirmation letter.",
    privacy: "We respect your privacy. Unsubscribe anytime.",
    benefits: [
      "Exclusive behind-the-scenes content",
      "Early access to new collections",
      "Invitations to private events",
    ],
  },
  fr: {
    kicker: "Newsletter",
    title: "Recevez nos correspondances éditoriales",
    subtitle: "Lettres mensuelles de notre atelier, coulisses et avant-premières de nos prochaines collections.",
    placeholder: "Votre adresse email",
    cta: "S'inscrire",
    success: "Bienvenue dans notre univers",
    successMessage: "Consultez votre boîte mail pour une lettre de confirmation.",
    privacy: "Nous respectons votre vie privée. Désabonnement à tout moment.",
    benefits: [
      "Contenu exclusif des coulisses",
      "Accès anticipé aux nouvelles collections",
      "Invitations aux événements privés",
    ],
  },
  ar: {
    kicker: "النشرة البريدية",
    title: "استلم مراسلاتنا التحريرية",
    subtitle: "رسائل شهرية من الأتيليه، قصص من الكواليس، ومعاينات حصرية للمجموعات القادمة.",
    placeholder: "عنوان بريدك الإلكتروني",
    cta: "اشترك",
    success: "مرحباً بك في عالمنا",
    successMessage: "تفقّد بريدك الوارد لرسالة التأكيد.",
    privacy: "نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.",
    benefits: [
      "محتوى حصري من الكواليس",
      "وصول مبكر للمجموعات الجديدة",
      "دعوات للفعاليات الخاصة",
    ],
  },
};

export function JournalNewsletter({ locale, variant = "default" }: JournalNewsletterProps) {
  const copy = COPY[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSuccess(true);
    setIsSubmitting(false);
    setEmail("");
  };

  if (variant === "dark") {
    return (
      <DarkNewsletter
        locale={locale}
        copy={copy}
        email={email}
        setEmail={setEmail}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        error={error}
        handleSubmit={handleSubmit}
        isInView={isInView}
        sectionRef={sectionRef}
      />
    );
  }

  if (variant === "minimal") {
    return (
      <MinimalNewsletter
        locale={locale}
        copy={copy}
        email={email}
        setEmail={setEmail}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        error={error}
        handleSubmit={handleSubmit}
        isInView={isInView}
        sectionRef={sectionRef}
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[var(--parchment)] to-white px-6 py-24 md:px-12 md:py-32"
    >
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[var(--gilded-rose)]/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[var(--espresso)]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-[var(--gilded-rose)]"
            >
              <Sparkles className="h-4 w-4" />
              {copy.kicker}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="mt-4 font-display text-4xl leading-tight text-[var(--espresso)] md:text-5xl"
            >
              {copy.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-[var(--espresso)]/60"
            >
              {copy.subtitle}
            </motion.p>

            {/* Benefits */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="mt-8 space-y-3"
            >
              {copy.benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 text-sm text-[var(--espresso)]/70"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gilded-rose)]/10">
                    <CheckCircle2 className="h-3 w-3 text-[var(--gilded-rose)]" />
                  </span>
                  {benefit}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex items-center"
          >
            <div className="w-full rounded-[2rem] border border-[var(--espresso)]/10 bg-white p-8 shadow-[0_30px_80px_rgba(20,15,10,0.08)] md:p-10">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-[var(--espresso)]">
                    {copy.success}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--espresso)]/60">
                    {copy.successMessage}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={copy.placeholder}
                      required
                      className="w-full rounded-xl border border-[var(--espresso)]/10 bg-[var(--parchment)]/50 px-5 py-4 text-sm text-[var(--espresso)] placeholder:text-[var(--espresso)]/40 focus:border-[var(--gilded-rose)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--gilded-rose)]/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[var(--onyx)] px-6 py-4 text-xs uppercase tracking-[0.4em] text-white transition-all duration-300 hover:bg-[var(--espresso)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                      />
                    ) : (
                      <>
                        <span>{copy.cta}</span>
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[0.65rem] text-[var(--espresso)]/40">
                    {copy.privacy}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Dark variant
function DarkNewsletter({
  locale,
  copy,
  email,
  setEmail,
  isSubmitting,
  isSuccess,
  handleSubmit,
  isInView,
  sectionRef,
}: {
  locale: Locale;
  copy: typeof COPY.en;
  email: string;
  setEmail: (email: string) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  isInView: boolean;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--onyx)] px-6 py-24 text-white md:px-12 md:py-32"
    >
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[var(--gilded-rose)]/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-screen-lg text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-xs uppercase tracking-[0.5em] text-[var(--gilded-rose)]"
        >
          {copy.kicker}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-4xl md:text-5xl"
        >
          {copy.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-base text-white/60"
        >
          {copy.subtitle}
        </motion.p>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-green-500/30 bg-green-500/10 px-6 py-3 text-green-400"
          >
            <CheckCircle2 className="h-5 w-5" />
            {copy.success}
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={copy.placeholder}
              required
              className="flex-1 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.4em] text-[var(--onyx)] transition-all hover:bg-white/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-[var(--onyx)]/30 border-t-[var(--onyx)]"
                />
              ) : (
                <>
                  {copy.cta}
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.form>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-6 text-[0.65rem] text-white/30"
        >
          {copy.privacy}
        </motion.p>
      </div>
    </section>
  );
}

// Minimal variant
function MinimalNewsletter({
  locale,
  copy,
  email,
  setEmail,
  isSubmitting,
  isSuccess,
  handleSubmit,
  isInView,
  sectionRef,
}: {
  locale: Locale;
  copy: typeof COPY.en;
  email: string;
  setEmail: (email: string) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  isInView: boolean;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <section
      ref={sectionRef}
      className="border-t border-[var(--espresso)]/10 bg-[var(--parchment)] px-6 py-16 md:px-12"
    >
      <div className="mx-auto max-w-screen-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col items-center text-center"
        >
          <span className="text-xs uppercase tracking-[0.5em] text-[var(--espresso)]/40">
            {copy.kicker}
          </span>
          <h3 className="mt-3 font-display text-2xl text-[var(--espresso)]">
            {copy.title}
          </h3>

          {isSuccess ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 inline-flex items-center gap-2 text-sm text-green-600"
            >
              <CheckCircle2 className="h-4 w-4" />
              {copy.success}
            </motion.span>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.placeholder}
                required
                className="flex-1 rounded-full border border-[var(--espresso)]/15 bg-white px-5 py-3 text-sm focus:border-[var(--espresso)]/30 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--onyx)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition-colors hover:bg-[var(--espresso)] disabled:opacity-50"
              >
                {copy.cta}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
