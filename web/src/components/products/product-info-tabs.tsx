"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProductInfoTab = {
  key: string;
  label: string;
  content: ReactNode;
};

export function ProductInfoTabs({ tabs }: { tabs: ProductInfoTab[] }) {
  const [activeKey, setActiveKey] = useState(() => tabs[0]?.key ?? "");

  if (!tabs.length) {
    return null;
  }

  const activeTab = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-4 border-b border-ink/10 text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveKey(tab.key)}
            className={cn(
              "pb-3 text-xs uppercase tracking-[0.4em] transition-colors",
              activeTab.key === tab.key ? "text-ink" : "text-ink/45 hover:text-ink/70",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-6 text-sm leading-relaxed text-ink/75">{activeTab.content}</div>
    </div>
  );
}
