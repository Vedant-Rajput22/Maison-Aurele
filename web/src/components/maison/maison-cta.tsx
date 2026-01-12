"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, MessageCircle, Phone, Mail } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Props = {
  locale: Locale;
};

const COPY = {
  en: {
    kicker: "Private experience",
    title: "Begin your journey",
    subtitle: "Schedule a private consultation with our atelier team, in Paris or virtually.",
    options: [
      {
        id: "appointment",
        icon: "calendar",
        title: "Private appointment",
        description: "Experience our collection in person with dedicated guidance from our style advisors.",
        cta: "Book now",
        href: "/appointments",
      },
      {
        id: "virtual",
        icon: "message",
        title: "Virtual consultation",
        description: "Connect with our team from anywhere in the world via video call.",
        cta: "Schedule call",
        href: "/appointments",
      },
      {
        id: "contact",
        icon: "phone",
        title: "Concierge",
        description: "Our dedicated team is available to answer any questions.",
        cta: "Get in touch",
        href: "/boutique",
      },
    ],
    or: "or",
    email: "concierge@maison-aurele.fr",
    phone: "+33 (0)1 86 95 24 01",
    available: "Available Mon–Sat, 10am–7pm CET",
  },
  fr: {
    kicker: "Expérience privée",
    title: "Commencez votre voyage",
    subtitle: "Planifiez une consultation privée avec notre équipe d'atelier, à Paris ou virtuellement.",
    options: [
      {
        id: "appointment",
        icon: "calendar",
        title: "Rendez-vous privé",
        description: "Découvrez notre collection en personne avec les conseils de nos stylistes.",
        cta: "Réserver",
        href: "/appointments",
      },
      {
        id: "virtual",
        icon: "message",
        title: "Consultation virtuelle",
        description: "Connectez-vous avec notre équipe depuis n'importe où par appel vidéo.",
        cta: "Planifier",
        href: "/appointments",
      },
      {
        id: "contact",
        icon: "phone",
        title: "Conciergerie",
        description: "Notre équipe dédiée est disponible pour répondre à toutes vos questions.",
        cta: "Nous contacter",
        href: "/boutique",
      },
    ],
    or: "ou",
    email: "concierge@maison-aurele.fr",
    phone: "+33 (0)1 86 95 24 01",
    available: "Disponible Lun–Sam, 10h–19h",
  },
} as const;

const iconMap = {
  calendar: Calendar,
  message: MessageCircle,
  phone: Phone,
};

export function MaisonCTA({ locale }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <ScrollReveal>
      <section ref={containerRef} className="relative overflow-hidden bg-white py-32">
        {/* Background elements */}
        <motion.div
          style={{ y: backgroundY }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(218,200,182,0.2),transparent_60%)]" />
        </motion.div>

        <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12">
          {/* Header */}
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.6em] text-ink/40">
                {copy.kicker}
              </span>
              <h2 className="font-display text-4xl md:text-5xl">{copy.title}</h2>
              <p className="mx-auto max-w-xl text-lg text-ink/60">{copy.subtitle}</p>
            </motion.div>
          </div>

          {/* Options grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {copy.options.map((option, index) => {
              const Icon = iconMap[option.icon as keyof typeof iconMap] || Calendar;
              const isHovered = hoveredOption === option.id;

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  onMouseEnter={() => setHoveredOption(option.id)}
                  onMouseLeave={() => setHoveredOption(null)}
                >
                  <Link
                    href={`/${locale}${option.href}`}
                    className="group relative block h-full overflow-hidden rounded-[2.5rem] border border-ink/8 bg-gradient-to-b from-[var(--parchment)]/50 to-white p-8 shadow-[0_20px_60px_rgba(16,10,8,0.06)] transition-all duration-500 hover:border-ink/20 hover:shadow-[0_40px_100px_rgba(16,10,8,0.12)]"
                  >
                    {/* Hover background */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--gilded-rose)]/5 to-transparent"
                        />
                      )}
                    </AnimatePresence>

                    <div className="relative">
                      {/* Icon */}
                      <motion.div
                        animate={{ rotate: isHovered ? 5 : 0 }}
                        className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-ink/10 bg-white shadow-sm transition-colors group-hover:border-[var(--gilded-rose)]/30 group-hover:bg-[var(--gilded-rose)]/5"
                      >
                        <Icon size={24} className="text-ink/60 transition-colors group-hover:text-[var(--gilded-rose)]" />
                      </motion.div>

                      {/* Content */}
                      <h3 className="font-display text-2xl">{option.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink/60">{option.description}</p>

                      {/* CTA */}
                      <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-ink/70 transition-colors group-hover:text-ink">
                        {option.cta}
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-col items-center gap-6 text-center"
          >
            <span className="text-[0.55rem] uppercase tracking-[0.5em] text-ink/30">{copy.or}</span>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href={`mailto:${copy.email}`}
                className="group flex items-center gap-3 rounded-full border border-ink/10 px-5 py-3 transition hover:border-ink/20 hover:bg-ink/5"
              >
                <Mail size={16} className="text-ink/50" />
                <span className="text-sm">{copy.email}</span>
              </a>
              <a
                href={`tel:${copy.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-3 rounded-full border border-ink/10 px-5 py-3 transition hover:border-ink/20 hover:bg-ink/5"
              >
                <Phone size={16} className="text-ink/50" />
                <span className="text-sm">{copy.phone}</span>
              </a>
            </div>

            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-ink/40">{copy.available}</p>
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  );
}
