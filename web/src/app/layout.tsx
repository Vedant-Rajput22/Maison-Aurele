import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { defaultLocale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.maison-aurele.com"),
  title: {
    default: "Maison Aurele",
    template: "%s | Maison Aurele",
  },
  description:
    "Maison Aurele — a Parisian maison crafting ultra-luxury couture with cinematic digital storytelling.",
  keywords: [
    "Maison Aurele",
    "haute couture",
    "luxury fashion",
    "Paris atelier",
    "French design",
  ],
  openGraph: {
    title: "Maison Aurele",
    description:
      "Discover collections, editorials, and the Maison Aurele atelier through cinematic digital experiences.",
    type: "website",
    locale: "fr_FR",
    siteName: "Maison Aurele",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<Record<string, never>>;
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  await params;

  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body className={`${fontVariables} antialiased bg-[var(--parchment)] text-[var(--espresso)]`}>
        {children}
      </body>
    </html>
  );
}
