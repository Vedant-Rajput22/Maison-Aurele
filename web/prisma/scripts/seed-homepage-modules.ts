import "dotenv/config"; // Load env vars for tsx runs
import { prisma } from "../../src/lib/prisma";
import { Locale } from "@prisma/client";

const locales: Locale[] = [Locale.FR, Locale.EN];

// Curated luxury fashion imagery for homepage
const LUXURY_IMAGES = {
  hero: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80&sat=-30",
  gallery: [
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=80",
  ],
  story: [
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80",
  ],
  atelier: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80&sat=-25",
  ],
  lookbook: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1400&q=80",
  ],
  editorial: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80",
};

const heroVideoPoster = LUXURY_IMAGES.hero;

const modules = [
  {
    type: "hero_scene",
    slug: "hero-default",
    sortOrder: 10,
    config: (locale: Locale) => ({
      pretitle: locale === Locale.FR ? "Chapitre I" : "Chapter I",
      titleLines:
        locale === Locale.FR
          ? ["Maison Aurèle", "Atelier numérique" + " — Couture privée"]
          : ["Maison Aurèle", "Digital atelier" + " — Private couture"],
      manifesto:
        locale === Locale.FR
          ? "Silhouettes cinématiques, couture et services sur mesure."
          : "Cinematic silhouettes, couture, and white-glove services.",
      primaryCta: { label: locale === Locale.FR ? "Découvrir" : "Enter", href: "/collections" },
      secondaryCta: { label: locale === Locale.FR ? "Journal" : "Journal", href: "/journal" },
      stats: [
        { label: "Looks", value: "24" },
        { label: locale === Locale.FR ? "Atelier" : "Atelier", value: "Paris" },
        { label: locale === Locale.FR ? "Heures" : "Hours", value: "24/7" },
      ],
      video: {
        src: heroVideoPoster,
        poster: heroVideoPoster,
      },
    }),
  },
  {
    type: "artisan_marquee",
    slug: "artisan-marquee",
    sortOrder: 20,
    config: (_locale: Locale) => ({
      items: ["Faubourg Saint-Honoré", "Dentelle de Calais", "Atelier Nuit", "Main gauche"],
    }),
  },
  {
    type: "gallery_scroll_scene",
    slug: "gallery-scroll",
    sortOrder: 30,
    config: (locale: Locale) => ({
      kicker: locale === Locale.FR ? "Galerie" : "Gallery",
      heading: locale === Locale.FR ? "Galerie Vivante" : "Living Gallery",
      description:
        locale === Locale.FR
          ? "Une sélection immersive de matières et silhouettes."
          : "An immersive selection of materials and silhouettes.",
      artworks: [
        { title: "Velours", body: "Texture", image: LUXURY_IMAGES.gallery[0] },
        { title: "Lumière", body: "Reflets", image: LUXURY_IMAGES.gallery[1] },
        { title: "Architecture", body: "Structure", image: LUXURY_IMAGES.gallery[2] },
      ],
    }),
  },
  {
    type: "story_panels",
    slug: "story-panels",
    sortOrder: 40,
    config: (locale: Locale) => ({
      kicker: locale === Locale.FR ? "Atelier" : "Atelier",
      heading: locale === Locale.FR ? "Narratifs" : "Narratives",
      description:
        locale === Locale.FR ? "Chapitres éditoriaux" : "Editorial chapters",
      panels: [
        { title: "Nocturne", body: "Silhouette", tag: "Drop", image: LUXURY_IMAGES.story[0] },
        { title: "Heritage", body: "Archive", tag: "Maison", image: LUXURY_IMAGES.story[1] },
      ],
      collectionSlug: null,
    }),
  },
  {
    type: "atelier_diptych",
    slug: "atelier-diptych",
    sortOrder: 50,
    config: (locale: Locale) => ({
      kicker: locale === Locale.FR ? "Atelier" : "Atelier",
      title: locale === Locale.FR ? "Diptyque" : "Diptych",
      body:
        locale === Locale.FR
          ? "Silhouettes sculptées, détails macro." 
          : "Sculpted silhouettes and macro details.",
      bullets: ["Sur-mesure", "Edition limitée", "Paris"],
      images: [
        { src: LUXURY_IMAGES.atelier[0], alt: "atelier" },
        { src: LUXURY_IMAGES.atelier[1], alt: "detail" },
      ],
    }),
  },
  {
    type: "lookbook_carousel",
    slug: "lookbook-carousel",
    sortOrder: 60,
    config: (locale: Locale) => ({
      kicker: locale === Locale.FR ? "Lookbook" : "Lookbook",
      title: locale === Locale.FR ? "Capsule" : "Capsule",
      description:
        locale === Locale.FR ? "Sélection défilé." : "Runway selection.",
      slides: [
        { title: "Look 01", body: "Noir", image: LUXURY_IMAGES.lookbook[0] },
        { title: "Look 02", body: "Lumière", image: LUXURY_IMAGES.lookbook[1] },
        { title: "Look 03", body: "Volume", image: LUXURY_IMAGES.lookbook[2] },
      ],
      collectionSlug: null,
    }),
  },
  {
    type: "sculpted_quotes",
    slug: "sculpted-quotes",
    sortOrder: 70,
    config: (_locale: Locale) => ({
      quotes: [
        "La maison écrit en lumière.",
        "Chaque silhouette est un film.",
        "Le tissu devient narration.",
      ],
    }),
  },
  {
    type: "editorial_teaser",
    slug: "editorial-teaser",
    sortOrder: 80,
    config: (locale: Locale) => ({
      title: locale === Locale.FR ? "Journal" : "Journal",
      body:
        locale === Locale.FR
          ? "Essais, films, et récits de l'atelier."
          : "Essays, films, and atelier stories.",
      highlights: ["Film", "Essai", "Archive"],
      ctaLabel: locale === Locale.FR ? "Lire" : "Read",
      ctaHref: "/journal",
      heroImage: LUXURY_IMAGES.editorial,
      badgeLabel: locale === Locale.FR ? "Nouvelle" : "New",
      postSlug: null,
    }),
  },
  {
    type: "maison_timeline",
    slug: "maison-timeline",
    sortOrder: 90,
    config: (locale: Locale) => ({
      kicker: locale === Locale.FR ? "Frise" : "Timeline",
      title: locale === Locale.FR ? "Maison" : "Maison",
      description:
        locale === Locale.FR ? "Repères de l'atelier." : "Atelier milestones.",
      entries: [
        { year: "1962", title: "Atelier", body: "Paris" },
        { year: "2024", title: "Numérique", body: "Immersif" },
        { year: "2025", title: "Couture", body: "Made-to-order" },
      ],
    }),
  },
  {
    type: "limited_drop_banner",
    slug: "limited-drop",
    sortOrder: 100,
    config: (locale: Locale) => ({
      title: locale === Locale.FR ? "Drop limité" : "Limited drop",
      body:
        locale === Locale.FR
          ? "Ouverture prochaine, liste d'attente."
          : "Opens soon, waitlist open.",
      ctaLabel: locale === Locale.FR ? "Réserver" : "Join",
      ctaHref: "/drops",
      dropId: null,
    }),
  },
];

async function main() {
  for (const locale of locales) {
    for (const mod of modules) {
      const slug = `${mod.slug}-${locale.toLowerCase()}`;
      await prisma.homepageModule.upsert({
        where: { slug },
        update: {
          type: mod.type,
          locale,
          config: mod.config(locale),
          sortOrder: mod.sortOrder,
        },
        create: {
          slug,
          type: mod.type,
          locale,
          config: mod.config(locale),
          sortOrder: mod.sortOrder,
        },
      });
    }
  }

  console.log("Homepage modules ready for FR/EN.");
}

main()
  .catch((err) => {
    console.error("Seed homepage modules failed", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
