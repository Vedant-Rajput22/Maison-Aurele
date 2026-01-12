"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Award, Scissors, Package } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Props = {
  locale: Locale;
  atelierNotes: string[];
  heritageTag?: string | null;
  originCountry?: string | null;
  priceRange: string;
};

const COPY = {
  en: {
    maisonSignature: "Maison signature",
    headline: "Lines sculpted by Paris light, finished with invisible precision.",
    atelier: "Maison atelier",
    atelierSubhead: "Every gesture is precise, every stitch is a promise.",
    personalization: "Personalization",
    personalizationDesc: "Monograms, linings, and proportions can be refined via our concierge.",
    bookAppointment: "Book a fitting",
    care: "Care & material",
    origin: "Origin",
    certificate: "Certificate of authenticity",
    craftedIn: "Crafted in our",
    parisianAtelier: "Parisian atelier",
    features: [
      { icon: "award", label: "Heritage craftsmanship" },
      { icon: "scissors", label: "Made to measure" },
      { icon: "package", label: "Luxury packaging" },
    ],
  },
  fr: {
    maisonSignature: "Écriture de la maison",
    headline: "Des lignes sculptées par la lumière de Paris, accompagnées de finitions invisibles.",
    atelier: "Atelier maison",
    atelierSubhead: "Chaque geste est précis, chaque couture est une promesse.",
    personalization: "Personnalisation",
    personalizationDesc: "Monogrammes, doublures et proportions sont ajustés via notre conciergerie.",
    bookAppointment: "Réserver un essayage",
    care: "Soin & matière",
    origin: "Origine",
    certificate: "Certificat d'authenticité",
    craftedIn: "Créé dans notre",
    parisianAtelier: "atelier parisien",
    features: [
      { icon: "award", label: "Savoir-faire ancestral" },
      { icon: "scissors", label: "Sur mesure" },
      { icon: "package", label: "Emballage luxe" },
    ],
  },
  ar: {
    maisonSignature: "توقيع الدار",
    headline: "خطوط منحوتة بضوء باريس، مُنجزة بدقة غير مرئية.",
    atelier: "أتيليه الدار",
    atelierSubhead: "كل حركة دقيقة، كل غرزة وعد.",
    personalization: "التخصيص",
    personalizationDesc: "يمكن تحسين الحروف والبطانات والأبعاد عبر خدمة الكونسيرج.",
    bookAppointment: "احجز قياس",
    care: "العناية والمواد",
    origin: "الأصل",
    certificate: "شهادة الأصالة",
    craftedIn: "صُنع في",
    parisianAtelier: "أتيليه باريس",
    features: [
      { icon: "award", label: "حرفية تراثية" },
      { icon: "scissors", label: "مصنوع حسب المقاس" },
      { icon: "package", label: "تغليف فاخر" },
    ],
  },
} as const;

const iconMap: Record<string, typeof Award> = {
  award: Award,
  scissors: Scissors,
  package: Package,
};

export function ProductAtelierSection({
  locale,
  atelierNotes,
  heritageTag,
  originCountry,
  priceRange,
}: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <>
      {/* Signature Banner */}
      <ScrollReveal className="border-y border-ink/10 bg-gradient-to-r from-white via-[var(--parchment)]/40 to-white">
        <section className="relative overflow-hidden px-6 py-16 md:px-12">
          {/* Background pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative mx-auto flex max-w-screen-2xl flex-col items-center gap-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.8em] text-ink/40"
            >
              <Sparkles size={12} />
              {copy.maisonSignature}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl font-display text-3xl leading-tight md:text-4xl"
            >
              {copy.headline}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {heritageTag && (
                <span className="rounded-full border border-ink/15 bg-white/50 px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.4em] text-ink/60 backdrop-blur-sm">
                  {heritageTag}
                </span>
              )}
              <span className="rounded-full border border-ink/15 bg-white/50 px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.4em] text-ink/60 backdrop-blur-sm">
                {priceRange}
              </span>
              {originCountry && (
                <span className="rounded-full border border-ink/15 bg-white/50 px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.4em] text-ink/60 backdrop-blur-sm">
                  {originCountry}
                </span>
              )}
            </motion.div>

            {/* Feature icons */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center gap-8"
            >
              {copy.features.map((feature, idx) => {
                const Icon = iconMap[feature.icon] || Award;
                return (
                  <div key={idx} className="flex items-center gap-2 text-ink/50">
                    <Icon size={16} />
                    <span className="text-xs">{feature.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* Atelier Section */}
      <ScrollReveal>
        <section
          ref={containerRef}
          className="relative overflow-hidden border-t border-ink/10 bg-gradient-to-br from-white via-white to-[var(--parchment)]/30"
        >
          <div className="mx-auto grid max-w-screen-2xl gap-12 px-6 py-24 md:px-12 lg:grid-cols-[0.55fr_0.45fr] lg:items-center">
            {/* Left content */}
            <motion.div style={{ y: y1 }} className="space-y-8">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.6em] text-ink/50">{copy.atelier}</p>
                <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
                  {copy.atelierSubhead}
                </h2>
              </div>

              {atelierNotes.length > 0 && (
                <div className="space-y-4 text-sm leading-relaxed text-ink/70">
                  {atelierNotes.map((note, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {note}
                    </motion.p>
                  ))}
                </div>
              )}

              {/* Origin badge */}
              <div className="inline-flex items-center gap-3 rounded-full border border-ink/10 bg-white/80 px-5 py-3 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 shadow-inner" />
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.4em] text-ink/40">
                    {copy.craftedIn}
                  </p>
                  <p className="text-sm font-medium">{copy.parisianAtelier}</p>
                </div>
              </div>
            </motion.div>

            {/* Right card */}
            <motion.div
              style={{ y: y2 }}
              className="rounded-[2.5rem] border border-ink/8 bg-[var(--onyx)] p-10 text-white shadow-[0_40px_100px_rgba(15,11,8,0.35)]"
            >
              <p className="text-[0.6rem] uppercase tracking-[0.6em] text-white/50">
                {copy.personalization}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-white/80">
                {copy.personalizationDesc}
              </p>

              <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <Link
                href={`/${locale}/appointments`}
                className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs uppercase tracking-[0.5em] text-white transition-all hover:bg-white hover:text-ink"
              >
                {copy.bookAppointment}
                <motion.span
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </motion.span>
              </Link>

              {/* Trust badges */}
              <div className="mt-8 flex items-center justify-center gap-6">
                {copy.features.slice(0, 2).map((feature, idx) => {
                  const Icon = iconMap[feature.icon] || Award;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-white/40">
                      <Icon size={14} />
                      <span className="text-[0.6rem] uppercase tracking-wider">{feature.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
