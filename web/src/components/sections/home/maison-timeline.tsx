"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { MaisonTimelineContent } from "@/lib/data/homepage-types";
import { gsap, ScrollTrigger, prefersReducedMotion, MOTION_DEFAULTS } from "@/lib/motion";

export function MaisonTimeline({ data }: { data: MaisonTimelineContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current || !timelineRef.current || !lineRef.current) return;

    const section = sectionRef.current;
    const timeline = timelineRef.current;
    const line = lineRef.current;
    const entries = timeline.querySelectorAll("[data-timeline-entry]");

    // Animate the timeline line
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
        },
      }
    );

    // Animate each entry
    entries.forEach((entry, index) => {
      const content = entry.querySelector("[data-entry-content]");
      const marker = entry.querySelector("[data-entry-marker]");

      // Content reveal
      if (content) {
        gsap.fromTo(
          content,
          { 
            opacity: 0, 
            x: index % 2 === 0 ? -60 : 60,
            y: 30,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: MOTION_DEFAULTS.duration.luxury,
            ease: MOTION_DEFAULTS.ease.luxury,
            scrollTrigger: {
              trigger: entry,
              start: "top 75%",
            },
          }
        );
      }

      // Marker pulse
      if (marker) {
        gsap.fromTo(
          marker,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: MOTION_DEFAULTS.ease.elastic,
            scrollTrigger: {
              trigger: entry,
              start: "top 70%",
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-32 text-white md:px-12"
      style={{ background: "radial-gradient(ellipse at 20% 0%, #1d1310 0%, #0a0605 50%, #050303 100%)" }}
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(209,169,130,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-screen-2xl">
        {/* Header */}
        <div className="mb-24 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.6rem] uppercase tracking-[0.7em] text-[var(--gilded-rose)]"
            >
              {data.kicker}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 font-display text-4xl leading-[1.1] lg:text-5xl"
            >
              {data.title}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-lg text-sm leading-relaxed text-white/60"
          >
            {data.description}
          </motion.p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-[1px] -translate-x-1/2 lg:block">
            <div className="absolute inset-0 bg-white/10" />
            <div
              ref={lineRef}
              className="absolute inset-0 origin-top bg-gradient-to-b from-[var(--gilded-rose)] via-white/50 to-transparent"
              style={{ transformOrigin: "top" }}
            />
          </div>

          {/* Timeline entries */}
          <div className="space-y-16 lg:space-y-24">
            {data.entries.map((entry, index) => {
              const isEven = index % 2 === 0;

              return (
                <article
                  key={`${entry.year}-${entry.title}`}
                  data-timeline-entry
                  className={`relative grid gap-8 lg:grid-cols-2 ${
                    isEven ? "" : "lg:text-right"
                  }`}
                >
                  {/* Marker */}
                  <div
                    data-entry-marker
                    className="absolute left-1/2 top-8 hidden h-4 w-4 -translate-x-1/2 lg:block"
                  >
                    <div className="absolute inset-0 animate-ping rounded-full bg-[var(--gilded-rose)]/30" />
                    <div className="relative h-full w-full rounded-full border-2 border-[var(--gilded-rose)] bg-[#0a0605]" />
                  </div>

                  {/* Content */}
                  <div
                    data-entry-content
                    className={`${isEven ? "lg:pr-16" : "lg:order-2 lg:pl-16"}`}
                  >
                    <div
                      className={`overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_50px_150px_rgba(0,0,0,0.5)] backdrop-blur-sm lg:p-10 ${
                        isEven ? "" : "lg:ml-auto"
                      }`}
                      style={{ maxWidth: "480px" }}
                    >
                      <div className="space-y-4">
                        {/* Year badge */}
                        <div className="flex items-center gap-4">
                          <span className="rounded-full border border-[var(--gilded-rose)]/30 bg-[var(--gilded-rose)]/10 px-4 py-1 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--gilded-rose)]">
                            {entry.year}
                          </span>
                          <span className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                        </div>

                        <h3 className="font-display text-2xl lg:text-3xl">{entry.title}</h3>
                        <p className="text-sm leading-relaxed text-white/70">{entry.body}</p>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
                        <span className="text-[0.55rem] uppercase tracking-[0.4em] text-white/40">
                          {localeNote(index)}
                        </span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[0.6rem] text-white/50">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Empty column for layout */}
                  <div className={`hidden lg:block ${isEven ? "lg:order-2" : ""}`} />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function localeNote(index: number) {
  const notes = ["Faubourg Saint-Honoré", "Marais", "Rive Gauche", "Côte d'Azur", "Atelier Nuit"];
  return notes[index % notes.length];
}
