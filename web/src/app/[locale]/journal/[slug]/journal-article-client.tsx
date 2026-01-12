"use client";

import { useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { JournalEntry, JournalCard } from "@/lib/data/journal";
import {
  JournalArticleHeader,
  JournalArticleBody,
  JournalRelatedArticles,
  JournalFeaturedProducts,
  JournalReadingProgress,
  JournalNewsletter,
} from "@/components/journal";

type JournalArticleClientProps = {
  locale: Locale;
  entry: JournalEntry;
  relatedArticles: JournalCard[];
  readingTime: number;
};

export function JournalArticleClient({
  locale,
  entry,
  relatedArticles,
  readingTime,
}: JournalArticleClientProps) {
  const articleRef = useRef<HTMLElement>(null);

  return (
    <>
      {/* Reading Progress Bar */}
      <JournalReadingProgress
        target={articleRef}
        position="top"
        variant="gold"
      />

      <article ref={articleRef}>
        {/* Cinematic Header */}
        <JournalArticleHeader
          locale={locale}
          entry={entry}
          readingTime={readingTime}
        />

        {/* Article Body with Sidebar */}
        <JournalArticleBody
          locale={locale}
          paragraphs={entry.bodyParagraphs}
          blocks={entry.blocks}
        />

        {/* Featured Products from the article */}
        {entry.features.length > 0 && (
          <JournalFeaturedProducts locale={locale} features={entry.features} />
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <JournalRelatedArticles locale={locale} articles={relatedArticles} />
        )}

        {/* Newsletter CTA */}
        <JournalNewsletter locale={locale} variant="minimal" />
      </article>
    </>
  );
}
