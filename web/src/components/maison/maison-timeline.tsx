"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type TimelineEntry = {
  year: string;
  titleFr: string;
  titleEn: string;
  bodyFr: string;
  bodyEn: string;
};

type Stat = {
  labelFr: string;
  labelEn: string;
  value: string;
};

type Props = {
  locale: Locale;
  timeline: TimelineEntry[];
  stats: Stat[];
};

const COPY = {
  en: {
    kicker: "Maison timeline",
    title: "Heritage & innovations",
    milestone: "Milestone",
    present: "Present day",
  },
  fr: {
    kicker: "Frise maison",
    title: "Héritage et innovations",
    milestone: "Étape",
    present: "Aujourd'hui",
  },
} as const;

export function MaisonTimeline({ locale, timeline, stats }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineProgress = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

  return (
    <ScrollReveal>
      <section ref={containerRef} className="relative overflow-hidden bg-white py-32">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(247,242,234,0.8),transparent_70%)]" />

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
              <h2 className="mt-4 font-display text-4xl md:text-5xl">{copy.title}</h2>
            </motion.div>
          </div>

          {/* Stats grid */}
          <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.labelEn}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-[2rem] border border-ink/8 bg-gradient-to-br from-[var(--parchment)]/50 to-white p-8 transition-all duration-500 hover:border-ink/15 hover:shadow-lg"
              >
                {/* Decorative accent */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-[var(--gilded-rose)]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <p className="text-[0.55rem] uppercase tracking-[0.5em] text-ink/40">
                  {locale === "fr" ? stat.labelFr : stat.labelEn}
                </p>
                <p className="mt-2 font-display text-5xl tracking-tight">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 hidden h-full w-px bg-ink/10 lg:left-1/2 lg:block" />

            {/* Animated progress line */}
            <motion.div
              style={{ height: lineProgress }}
              className="absolute left-8 top-0 hidden w-px bg-gradient-to-b from-[var(--gilded-rose)] via-ink/40 to-transparent lg:left-1/2 lg:block"
            />

            {/* Timeline entries */}
            <div className="space-y-16 lg:space-y-24">
              {timeline.map((entry, index) => {
                const isEven = index % 2 === 0;
                const title = locale === "fr" ? entry.titleFr : entry.titleEn;
                const body = locale === "fr" ? entry.bodyFr : entry.bodyEn;

                return (
                  <motion.div
                    key={entry.year}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={`relative lg:grid lg:grid-cols-2 lg:gap-20 ${
                      isEven ? "" : "lg:direction-rtl"
                    }`}
                  >
                    {/* Year marker (center) */}
                    <div className="absolute left-4 top-0 z-10 lg:left-1/2 lg:-translate-x-1/2">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink/20 bg-white shadow-lg"
                      >
                        <span className="font-display text-lg">{entry.year}</span>
                      </motion.div>
                    </div>

                    {/* Content card */}
                    <div
                      className={`ml-24 lg:ml-0 ${
                        isEven ? "lg:pr-20 lg:text-right" : "lg:col-start-2 lg:pl-20 lg:text-left"
                      }`}
                    >
                      <div className="rounded-[2rem] border border-ink/8 bg-white p-8 shadow-[0_20px_60px_rgba(16,10,8,0.08)] transition-all duration-500 hover:shadow-[0_30px_80px_rgba(16,10,8,0.12)]">
                        <span className="text-[0.55rem] uppercase tracking-[0.4em] text-ink/40">
                          {copy.milestone} {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mt-3 font-display text-2xl">{title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-ink/65">{body}</p>

                        {/* Decorative line */}
                        <div className={`mt-6 h-px w-16 bg-gradient-to-r from-[var(--gilded-rose)] to-transparent ${
                          isEven ? "lg:ml-auto" : ""
                        }`} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Present marker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 flex justify-center"
            >
              <div className="flex items-center gap-4 rounded-full border border-ink/10 bg-[var(--parchment)] px-6 py-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--gilded-rose)]" />
                <span className="text-[0.6rem] uppercase tracking-[0.4em] text-ink/50">
                  {copy.present}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
