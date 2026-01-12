import type { Locale } from "@/lib/i18n/config";
import { getJournalEntry, getJournalEntries } from "@/lib/data/journal";
import { notFound } from "next/navigation";
import { JournalArticleClient } from "./journal-article-client";

// Revalidate every hour (data is cached)
export const revalidate = 3600;

type PageParams =
  | { locale: Locale; slug: string }
  | Promise<{ locale: Locale; slug: string }>;

export default async function JournalEntryPage({
  params,
}: {
  params: PageParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;
  const entry = await getJournalEntry(locale, resolved.slug);

  if (!entry) {
    notFound();
  }

  // Get related articles for the "Continue Reading" section
  const allEntries = await getJournalEntries(locale);
  const relatedArticles = allEntries
    .filter((e) => e.id !== entry.id)
    .slice(0, 3);

  // Calculate reading time
  const wordCount = entry.bodyParagraphs
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime = Math.max(3, Math.round(wordCount / 180));

  return (
    <JournalArticleClient
      locale={locale}
      entry={entry}
      relatedArticles={relatedArticles}
      readingTime={readingTime}
    />
  );
}
