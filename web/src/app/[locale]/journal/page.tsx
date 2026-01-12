import type { Locale } from "@/lib/i18n/config";
import { getJournalEntries } from "@/lib/data/journal";
import { JournalIndexClient } from "./journal-index-client";

// Revalidate every hour (data is cached)
export const revalidate = 3600;

type LocaleParams = { locale: Locale } | Promise<{ locale: Locale }>;

export default async function JournalIndexPage({
  params,
}: {
  params: LocaleParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;

  const entries = await getJournalEntries(locale);
  const categories = Array.from(new Set(entries.map((entry) => entry.category)));

  return (
    <JournalIndexClient 
      locale={locale} 
      entries={entries} 
      categories={categories} 
    />
  );
}
