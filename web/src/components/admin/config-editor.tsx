"use client";

import { useState } from "react";

const PRESETS: Record<string, object> = {
  hero: {
    headline: "Cinematic couture",
    subheadline: "Paris atelier, limited editions",
    ctaLabel: "Discover",
    ctaHref: "/shop",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  },
  gallery: {
    title: "Scenes",
    items: [
      { title: "Atelier", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
      { title: "Riviera", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
    ],
  },
  drop: {
    title: "Limited drop",
    subtitle: "Edition of 25",
    ctaLabel: "Join drop",
    ctaHref: "/drops",
  },
};

type Props = {
  name: string;
  defaultValue: string;
  className?: string;
  rows?: number;
};

export function ConfigEditor({ name, defaultValue, className, rows = 6 }: Props) {
  const [value, setValue] = useState(defaultValue);

  const applyPreset = (preset: object) => {
    setValue(JSON.stringify(preset, null, 2));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
        <span>Presets</span>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRESETS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(PRESETS[key])}
              className="rounded-full border border-white/20 px-3 py-1 text-[0.7rem] text-white/80 hover:bg-white/10"
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={rows}
        className={className}
        placeholder={'{ "headline": "..." }'}
      />
    </div>
  );
}
