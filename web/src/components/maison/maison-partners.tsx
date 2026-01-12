"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Users, Gem } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Partner = {
  name: string;
  locationFr: string;
  locationEn: string;
  specialty: string;
};

type Props = {
  locale: Locale;
};

const COPY = {
  en: {
    kicker: "Partners",
    title: "The finest ateliers",
    subtitle: "Twelve partner maisons craft smoked velvets, archive laces, and liquid satins. Every look lists the atelier involved and material provenance.",
    viewCollections: "View collections",
    partnerAteliers: "Partner ateliers",
    yearsCollaboration: "Years of collaboration",
    countries: "Countries",
    partners: [
      { name: "Maison Lesage", locationFr: "Paris", locationEn: "Paris", specialty: "Embroidery" },
      { name: "Ateliers Lyon", locationFr: "Lyon", locationEn: "Lyon", specialty: "Silk weaving" },
      { name: "Como Silk", locationFr: "Como, Italie", locationEn: "Como, Italy", specialty: "Fabrics" },
      { name: "Les Baux", locationFr: "Provence", locationEn: "Provence", specialty: "Dyeing" },
    ],
  },
  fr: {
    kicker: "Partenaires",
    title: "Les ateliers d'excellence",
    subtitle: "Douze maisons partenaires tissent velours fumés, dentelles d'archives et satins liquides. Chaque pièce mentionne l'atelier impliqué et la provenance des matières.",
    viewCollections: "Voir les collections",
    partnerAteliers: "Ateliers partenaires",
    yearsCollaboration: "Années de collaboration",
    countries: "Pays",
    partners: [
      { name: "Maison Lesage", locationFr: "Paris", locationEn: "Paris", specialty: "Broderie" },
      { name: "Ateliers Lyon", locationFr: "Lyon", locationEn: "Lyon", specialty: "Tissage soie" },
      { name: "Como Silk", locationFr: "Como, Italie", locationEn: "Como, Italy", specialty: "Étoffes" },
      { name: "Les Baux", locationFr: "Provence", locationEn: "Provence", specialty: "Teinture" },
    ],
  },
} as const;

const IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=800&q=80",
];

export function MaisonPartners({ locale }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rightY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <ScrollReveal>
      <section ref={containerRef} className="relative overflow-hidden bg-[var(--parchment)] py-32">
        {/* Background texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full">
            <pattern id="partnerGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#partnerGrid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left: Main content card */}
            <motion.div style={{ y: leftY }}>
              <div className="rounded-[3rem] border border-ink/8 bg-[var(--onyx)] p-10 text-white shadow-[0_60px_150px_rgba(6,3,0,0.4)] md:p-14">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-white/30" />
                  <span className="text-[0.6rem] uppercase tracking-[0.5em] text-white/50">
                    {copy.kicker}
                  </span>
                </div>

                <h2 className="mt-6 font-display text-4xl md:text-5xl">{copy.title}</h2>
                <p className="mt-6 text-lg leading-relaxed text-white/70">{copy.subtitle}</p>

                {/* Stats row */}
                <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                  <div>
                    <div className="flex items-center gap-2 text-white/40">
                      <Users size={14} />
                    </div>
                    <p className="mt-2 font-display text-3xl">12</p>
                    <p className="mt-1 text-[0.55rem] uppercase tracking-[0.3em] text-white/40">
                      {copy.partnerAteliers}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-white/40">
                      <Gem size={14} />
                    </div>
                    <p className="mt-2 font-display text-3xl">60+</p>
                    <p className="mt-1 text-[0.55rem] uppercase tracking-[0.3em] text-white/40">
                      {copy.yearsCollaboration}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-white/40">
                      <MapPin size={14} />
                    </div>
                    <p className="mt-2 font-display text-3xl">7</p>
                    <p className="mt-1 text-[0.55rem] uppercase tracking-[0.3em] text-white/40">
                      {copy.countries}
                    </p>
                  </div>
                </div>

                {/* Partner list */}
                <div className="mt-10 space-y-4">
                  {copy.partners.map((partner, index) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10"
                    >
                      <div>
                        <p className="font-display text-lg">{partner.name}</p>
                        <p className="text-xs text-white/50">
                          {locale === "fr" ? partner.locationFr : partner.locationEn}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/20 px-3 py-1 text-[0.55rem] uppercase tracking-wider text-white/60">
                        {partner.specialty}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/${locale}/collections`}
                  className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-ink"
                >
                  {copy.viewCollections}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>

            {/* Right: Image gallery */}
            <motion.div style={{ y: rightY }} className="grid gap-6 sm:grid-cols-2">
              {IMAGES.slice(0, 2).map((image, index) => (
                <motion.div
                  key={image}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`group relative overflow-hidden rounded-[2.5rem] border border-ink/8 shadow-lg ${
                    index === 0 ? "aspect-[3/4]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={image}
                    alt="Atelier"
                    fill
                    sizes="(min-width: 768px) 25vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
              ))}

              {/* Third image spans full width */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group relative aspect-[16/9] overflow-hidden rounded-[2.5rem] border border-ink/8 shadow-lg sm:col-span-2"
              >
                <Image
                  src={IMAGES[2]}
                  alt="Atelier"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
