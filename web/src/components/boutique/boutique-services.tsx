"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, MessageCircle, Sparkles, Users, Crown, Gem, Gift, Clock } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Props = {
  locale: Locale;
};

const COPY = {
  en: {
    kicker: "Our services",
    title: "An exceptional experience",
    subtitle: "Every visit to Maison Aurèle is an immersion into the world of haute couture",
    services: [
      {
        id: "private",
        icon: "crown",
        title: "Private consultations",
        description: "A personal appointment in our salon privé, where our master artisans guide you through our collections with undivided attention.",
        duration: "90 minutes",
      },
      {
        id: "bespoke",
        icon: "gem",
        title: "Bespoke creations",
        description: "Transform your vision into reality. From sketch to final piece, experience the complete journey of haute couture creation.",
        duration: "By arrangement",
      },
      {
        id: "virtual",
        icon: "message",
        title: "Virtual appointments",
        description: "Connect with our consultants from anywhere in the world for an intimate presentation of our latest creations.",
        duration: "60 minutes",
      },
      {
        id: "events",
        icon: "users",
        title: "Private events",
        description: "Host an exclusive viewing or intimate gathering in our historic Parisian salon. Perfect for special occasions.",
        duration: "Custom",
      },
    ],
    additionalServices: [
      {
        icon: "gift",
        title: "Gift wrapping",
        description: "Signature presentation with hand-calligraphed cards",
      },
      {
        icon: "sparkles",
        title: "Alterations",
        description: "Complimentary fit adjustments by our ateliers",
      },
      {
        icon: "clock",
        title: "After hours",
        description: "Private appointments outside regular hours",
      },
    ],
    cta: "Book your experience",
  },
  fr: {
    kicker: "Nos services",
    title: "Une expérience d'exception",
    subtitle: "Chaque visite chez Maison Aurèle est une immersion dans l'univers de la haute couture",
    services: [
      {
        id: "private",
        icon: "crown",
        title: "Consultations privées",
        description: "Un rendez-vous personnel dans notre salon privé, où nos maîtres artisans vous guident à travers nos collections avec une attention exclusive.",
        duration: "90 minutes",
      },
      {
        id: "bespoke",
        icon: "gem",
        title: "Créations sur mesure",
        description: "Transformez votre vision en réalité. Du croquis à la pièce finale, vivez le parcours complet de la création haute couture.",
        duration: "Sur arrangement",
      },
      {
        id: "virtual",
        icon: "message",
        title: "Rendez-vous virtuels",
        description: "Connectez-vous avec nos conseillers de n'importe où dans le monde pour une présentation intime de nos dernières créations.",
        duration: "60 minutes",
      },
      {
        id: "events",
        icon: "users",
        title: "Événements privés",
        description: "Organisez une présentation exclusive ou une réunion intime dans notre salon parisien historique. Parfait pour les occasions spéciales.",
        duration: "Sur mesure",
      },
    ],
    additionalServices: [
      {
        icon: "gift",
        title: "Emballage cadeau",
        description: "Présentation signature avec cartes calligraphiées à la main",
      },
      {
        icon: "sparkles",
        title: "Retouches",
        description: "Ajustements offerts par nos ateliers",
      },
      {
        icon: "clock",
        title: "Hors heures",
        description: "Rendez-vous privés en dehors des heures régulières",
      },
    ],
    cta: "Réserver votre expérience",
  },
} as const;

const iconMap = {
  crown: Crown,
  gem: Gem,
  message: MessageCircle,
  users: Users,
  gift: Gift,
  sparkles: Sparkles,
  clock: Clock,
  calendar: Calendar,
};

export function BoutiqueServices({ locale }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <ScrollReveal>
      <section ref={containerRef} className="relative overflow-hidden py-32">
        {/* Background */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
          <Image
            src="/assets/media/atelier-workshop.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white" />
        </motion.div>

        <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12">
          {/* Header */}
          <div className="mb-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[0.6rem] uppercase tracking-[0.6em] text-ink/40">
                {copy.kicker}
              </span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl">{copy.title}</h2>
              <p className="mx-auto mt-6 max-w-xl text-ink/60">{copy.subtitle}</p>
            </motion.div>
          </div>

          {/* Main services grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {copy.services.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative h-full overflow-hidden rounded-[2rem] border border-ink/8 bg-white p-8 shadow-[0_20px_60px_rgba(16,10,8,0.05)] transition-all duration-500 hover:border-ink/15 hover:shadow-[0_30px_80px_rgba(16,10,8,0.1)] md:p-10">
                    {/* Index number */}
                    <span className="absolute right-8 top-8 font-display text-7xl text-ink/[0.03] transition-all duration-500 group-hover:text-ink/[0.06]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gilded-rose)]/10 to-[var(--gilded-rose)]/5 transition-transform duration-500 group-hover:scale-110">
                      <IconComponent size={24} className="text-[var(--gilded-rose)]" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 mt-8">
                      <h3 className="font-display text-2xl">{service.title}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-ink/60">{service.description}</p>
                    </div>

                    {/* Duration badge */}
                    <div className="relative z-10 mt-8 flex items-center gap-2">
                      <Clock size={14} className="text-ink/40" />
                      <span className="text-[0.6rem] uppercase tracking-[0.4em] text-ink/40">
                        {service.duration}
                      </span>
                    </div>

                    {/* Hover gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--gilded-rose)]/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="rounded-[2rem] border border-ink/8 bg-gradient-to-br from-[var(--parchment)]/50 to-white p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-3">
                {copy.additionalServices.map((service, index) => {
                  const IconComponent = iconMap[service.icon as keyof typeof iconMap];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                        <IconComponent size={20} className="text-ink/60" />
                      </div>
                      <h4 className="mt-4 font-display text-lg">{service.title}</h4>
                      <p className="mt-2 text-xs text-ink/50">{service.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <a
              href={`/${locale}/appointments`}
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-10 py-5 text-xs uppercase tracking-[0.3em] text-white transition-all hover:bg-ink/90"
            >
              <Calendar size={16} className="transition-transform group-hover:scale-110" />
              {copy.cta}
            </a>
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  );
}
