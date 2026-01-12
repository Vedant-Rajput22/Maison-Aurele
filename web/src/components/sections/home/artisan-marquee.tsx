"use client";

import { useRef, useEffect, useState } from "react";
import type { MarqueeContent } from "@/lib/data/homepage-types";

export function ArtisanMarquee({ data }: { data: MarqueeContent }) {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Duplicate items for seamless loop
  const list = [...data.items, ...data.items, ...data.items];

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "var(--parchment)" }}>
      {/* Top decorative line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--espresso)]/15 to-transparent" />

      <div
        className="relative overflow-hidden py-8"
        style={{
          background: "linear-gradient(180deg, rgba(246,240,230,0.9) 0%, rgba(246,240,230,0.7) 50%, rgba(246,240,230,0.9) 100%)",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[var(--parchment)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[var(--parchment)] to-transparent" />

        {/* Marquee track */}
        <div
          ref={marqueeRef}
          className={`marquee-track flex items-center gap-16 ${isPaused ? "paused" : ""}`}
        >
          {list.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center gap-16 whitespace-nowrap">
              <span className="text-[0.65rem] uppercase tracking-[0.7em] text-[var(--espresso)]/50 transition-colors duration-500 hover:text-[var(--gilded-rose)]">
                {item}
              </span>
              {/* Decorative diamond separator */}
              <span className="flex h-1.5 w-1.5 rotate-45 items-center justify-center bg-[var(--gilded-rose)]/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--espresso)]/15 to-transparent" />

      <style jsx>{`
        .marquee-track {
          animation: scroll 45s linear infinite;
          will-change: transform;
        }

        .marquee-track.paused {
          animation-play-state: paused;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

