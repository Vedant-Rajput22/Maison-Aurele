"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";
import type { LimitedDropBannerContent } from "@/lib/data/homepage-types";
import { gsap, prefersReducedMotion, MOTION_DEFAULTS } from "@/lib/motion";

function resolveHref(locale: Locale, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

// Countdown hook
function useCountdown(targetTimestamp: number) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetTimestamp - Date.now();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetTimestamp]);

  return timeLeft;
}

export function LimitedDropBanner({
  locale,
  data,
}: {
  locale: Locale;
  data: LimitedDropBannerContent;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);

  // Set target date 14 days from now for demo - memoized to prevent infinite loops
  const targetTimestamp = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.getTime();
  }, []);
  const timeLeft = useCountdown(targetTimestamp);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!countdownRef.current) return;

    const items = countdownRef.current.querySelectorAll("[data-countdown-item]");

    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: MOTION_DEFAULTS.ease.luxury,
          scrollTrigger: {
            trigger: countdownRef.current,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  const countdownItems = [
    { value: timeLeft.days, label: locale === "fr" ? "jours" : "days" },
    { value: timeLeft.hours, label: locale === "fr" ? "heures" : "hours" },
    { value: timeLeft.minutes, label: locale === "fr" ? "minutes" : "min" },
    { value: timeLeft.seconds, label: locale === "fr" ? "sec" : "sec" },
  ];

  return (
    <section
      ref={sectionRef}
      className="px-6 pb-32 md:px-12"
      style={{ backgroundColor: "var(--parchment)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[3rem] border border-[var(--espresso)]/5 shadow-[0_60px_200px_rgba(6,4,2,0.15)]"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0d0b] via-[#0f0807] to-[#1a0d0b]" />

        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(209,169,130,0.12),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(100,80,60,0.1),transparent_40%)]" />

        {/* Grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="relative grid gap-0 lg:grid-cols-[1.2fr_1fr]">
          {/* Left content panel */}
          <div className="relative border-b border-white/5 p-10 md:p-14 lg:border-b-0 lg:border-r">
            {/* Corner accent */}
            <div className="absolute left-10 top-10 h-16 w-[1px] bg-gradient-to-b from-[var(--gilded-rose)]/40 to-transparent" />
            <div className="absolute left-10 top-10 h-[1px] w-16 bg-gradient-to-r from-[var(--gilded-rose)]/40 to-transparent" />

            <div className="space-y-8">
              {/* Badge */}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 rounded-full border border-[var(--gilded-rose)]/30 bg-[var(--gilded-rose)]/10 px-4 py-1.5 text-[0.55rem] uppercase tracking-[0.6em] text-[var(--gilded-rose)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--gilded-rose)]" />
                  {locale === "fr" ? "Édition limitée" : "Limited edition"}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-3xl leading-tight text-white md:text-4xl lg:text-5xl">
                {data.title}
              </h3>

              {/* Body */}
              <p className="max-w-lg text-[0.95rem] leading-relaxed text-white/60">
                {data.body}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "24 silhouettes", icon: "◇" },
                  { label: locale === "fr" ? "Livraison exclusive" : "White glove", icon: "✦" },
                  { label: locale === "fr" ? "Numéroté" : "Numbered", icon: "№" },
                ].map((feature) => (
                  <span
                    key={feature.label}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.6rem] uppercase tracking-[0.4em] text-white/50"
                  >
                    <span className="text-[var(--gilded-rose)]">{feature.icon}</span>
                    {feature.label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <Link
                  href={resolveHref(locale, data.ctaHref)}
                  className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-[0.65rem] uppercase tracking-[0.4em] text-[var(--espresso)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  <span className="relative z-10">{data.ctaLabel}</span>
                  <span className="absolute inset-0 -translate-x-full bg-[var(--gilded-rose)] transition-transform duration-500 group-hover:translate-x-0" />
                  <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {data.ctaLabel}
                  </span>
                </Link>
                <Link
                  href={resolveHref(locale, "/appointments")}
                  className="group flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-white/50 transition-colors hover:text-white"
                >
                  <span>{locale === "fr" ? "Prendre rendez-vous" : "Book appointment"}</span>
                  <svg
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right countdown panel */}
          <div className="relative flex flex-col items-center justify-center p-10 md:p-14">
            {/* Decorative rings */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 rounded-full border border-white/[0.03]" />
              <div className="absolute h-80 w-80 rounded-full border border-white/[0.02]" />
              <div className="absolute h-96 w-96 rounded-full border border-white/[0.01]" />
            </div>

            <div className="relative text-center">
              <p className="text-[0.55rem] uppercase tracking-[0.7em] text-white/40">
                {locale === "fr" ? "La collection arrive dans" : "Collection drops in"}
              </p>

              {/* Countdown grid */}
              <div ref={countdownRef} className="mt-8 grid grid-cols-4 gap-4 md:gap-6">
                {countdownItems.map((item, idx) => (
                  <div
                    key={item.label}
                    data-countdown-item
                    className="relative flex flex-col items-center"
                  >
                    {/* Value */}
                    <div className="relative">
                      <span className="font-display text-4xl text-white md:text-5xl lg:text-6xl">
                        {String(item.value).padStart(2, "0")}
                      </span>
                      {/* Glow effect */}
                      <div className="absolute inset-0 blur-xl">
                        <span className="font-display text-4xl text-[var(--gilded-rose)]/20 md:text-5xl lg:text-6xl">
                          {String(item.value).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    {/* Label */}
                    <span className="mt-2 text-[0.5rem] uppercase tracking-[0.5em] text-white/30">
                      {item.label}
                    </span>
                    {/* Separator */}
                    {idx < countdownItems.length - 1 && (
                      <span className="absolute -right-2 top-1/3 text-xl text-white/10 md:-right-3">
                        :
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom text */}
              <p className="mt-10 text-[0.5rem] uppercase tracking-[0.5em] text-white/20">
                {locale === "fr" ? "Inscrivez-vous pour un accès anticipé" : "Sign up for early access"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
