"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Locale,
  isLocale,
  localeLabels,
  locales,
} from "@/lib/i18n/config";

function buildHref(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  const rest = isLocale(segments[0]) ? segments.slice(1) : segments;
  const trailingPath = rest.length ? `/${rest.join("/")}` : "";
  return `/${targetLocale}${trailingPath}`;
}

export function LocaleSwitcher({
  currentLocale,
  className,
}: {
  currentLocale: Locale;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.4em]",
        className,
      )}
    >
      {locales.map((locale) => {
        const active = locale === currentLocale;
        const href = buildHref(pathname, locale);

        return (
          <Link
            key={locale}
            href={href}
            scroll={false}
            className={cn(
              "relative px-2 py-1 text-current",
              active && "active",
            )}
          >
            {localeLabels[locale]}
            {active ? (
              <span
                className="pointer-events-none absolute inset-x-1 -bottom-0.5 block h-px"
                style={{ backgroundColor: "var(--gilded-rose)" }}
              />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
